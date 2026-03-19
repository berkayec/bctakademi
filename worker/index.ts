import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from './core-utils';
import { userRoutes } from './userRoutes'; // Rotaları doğrudan içeri alıyoruz

const app = new Hono<{ Bindings: Env }>();

// 1. Loglama (Geliştirme sırasında hataları görmeni sağlar)
app.use('*', logger());

// 2. CORS Ayarları (Frontend'in Backend ile konuşabilmesi için şart)
app.use('/api/*', cors({ 
    origin: '*', 
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowHeaders: ['Content-Type', 'Authorization'] 
}));

// 3. Rotaları Kaydet (userRoutes.ts içindeki tüm fonksiyonları buraya bağlar)
userRoutes(app);

// 4. Sağlık Kontrolü (Sitenin ayakta olduğunu anlamak için)
app.get('/api/health', (c) => c.json({ 
    success: true, 
    data: { status: 'healthy', timestamp: new Date().toISOString() }
}));

// 5. Hata Yakalayıcılar
app.notFound((c) => c.json({ success: false, error: 'İstediğiniz adres bulunamadı.' }, 404));

app.onError((err, c) => {
    console.error(`[CRITICAL ERROR]: ${err}`);
    return c.json({ 
        success: false, 
        error: 'Sunucu tarafında bir hata oluştu.',
        detail: err.message 
    }, 500);
});

// Cloudflare Worker standardı
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        return app.fetch(request, env, ctx);
    },
} satisfies ExportedHandler<Env>;
