import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { exec } from "node:child_process";
import pino from "pino";
import { cloudflare } from "@cloudflare/vite-plugin";

const logger = pino();

const stripAnsi = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

const LOG_MESSAGE_BOUNDARY = /\n(?=\[[A-Z][^\]]*\])/g;

const emitLog = (level: "info" | "warn" | "error", rawMessage: string) => {
  const cleaned = stripAnsi(rawMessage).replace(/\r\n/g, "\n");
  const parts = cleaned
    .split(LOG_MESSAGE_BOUNDARY)
    .map((p) => p.trimEnd())
    .filter((p) => p.trim().length > 0);
  if (parts.length === 0) { logger[level](cleaned.trimEnd()); return; }
  for (const part of parts) logger[level](part);
};

const customLogger = {
  warnOnce:      (msg: string) => emitLog("warn", msg),
  info:          (msg: string) => emitLog("info", msg),
  warn:          (msg: string) => emitLog("warn", msg),
  error:         (msg: string) => emitLog("error", msg),
  hasErrorLogged: () => false,
  clearScreen:   () => {},
  hasWarned:     false,
};

function watchDependenciesPlugin() {
  return {
    name: "watch-dependencies",
    configureServer(server: any) {
      const filesToWatch = [
        path.resolve("package.json"),
        path.resolve("bun.lock"),
      ];
      server.watcher.add(filesToWatch);
      server.watcher.on("change", (filePath: string) => {
        if (filesToWatch.includes(filePath)) {
          console.log(`\n Dependency file changed: ${path.basename(filePath)}. Clearing caches...`);
          exec("rm -f .eslintcache tsconfig.tsbuildinfo", (err, _stdout, stderr) => {
            if (err) { console.error("Failed to clear caches:", stderr); return; }
            console.log("Caches cleared.\n");
          });
        }
      });
    },
  };
}

function reloadTriggerPlugin() {
  return {
    name: "reload-trigger",
    configureServer(server: any) {
      const triggerFile = path.resolve(".reload-trigger");
      server.watcher.add(triggerFile);
      server.watcher.on("change", (filePath: string) => {
        if (filePath === triggerFile || filePath.endsWith(".reload-trigger")) {
          logger.info("Reload triggered via .reload-trigger");
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default ({ mode }: { mode: string }) => {
  const env        = loadEnv(mode, process.cwd());
  const isProd     = mode === "production";

  return defineConfig({
    plugins: [
      react(),
      cloudflare(),
      watchDependenciesPlugin(),
      reloadTriggerPlugin(),
    ],

    build: {
      minify: true,

      // Production'da sourcemap kapalı — bundle boyutunu şişirmez
      // Development'ta inline sourcemap hata ayıklamayı kolaylaştırır
      sourcemap: isProd ? false : "inline",

      rollupOptions: {
        output: {
          // Route bazlı code splitting — ilk yükleme süresi düşer
          manualChunks: {
            vendor:   ['react', 'react-dom', 'react-router-dom'],
            ui:       ['framer-motion', 'lucide-react', '@radix-ui/react-dialog'],
            store:    ['zustand'],
            query:    ['@tanstack/react-query'],
          },
          sourcemapExcludeSources: isProd,
        },
      },
    },

    customLogger: env.VITE_LOGGER_TYPE === 'json' ? customLogger : undefined,

    css: {
      devSourcemap: !isProd,
    },

    server: {
      allowedHosts: true,
      watch: {
        awaitWriteFinish: {
          stabilityThreshold: 150,
          pollInterval: 50,
        },
      },
    },

    resolve: {
      alias: {
        "@":       path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["agents"],
      force:   true,
    },

    define: {
      global: "globalThis",
    },

    cacheDir: "node_modules/.vite",
  });
};
