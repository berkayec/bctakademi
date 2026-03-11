import React from 'react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  size?: number;
  hideText?: boolean;
}
export function Logo({ className, size = 32, hideText = false }: LogoProps) {
  // Proportional scaling for text based on SVG size
  const fontSize = Math.max(size * 0.65, 14);
  return (
    <div className={cn("flex items-center gap-3 shrink-0", className)}>
      <div style={{ width: size, height: size }} className="shrink-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
        >
          {/* Academic Shield Shape */}
          <path
            d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z"
            className="fill-slate-900 stroke-teal-500"
            strokeWidth="5"
          />
          {/* ECG Pulse Wave - Thickened for better visibility */}
          <path
            d="M20 55H32L38 30L50 80L56 55H68L74 42L80 55H85"
            className="stroke-orange-500"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom Sparkle Detail */}
          <circle cx="50" cy="82" r="4" className="fill-teal-400 animate-pulse" />
        </svg>
      </div>
      {!hideText && (
        <span
          style={{ fontSize }}
          className="font-display font-black tracking-tighter bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent select-none whitespace-nowrap"
        >
          BCTAkademi
        </span>
      )}
    </div>
  );
}