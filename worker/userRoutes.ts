import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  
  // --- KULLANICI KAYIT VE DOĞRULAMA ---
  app.post('/api/signup', async (c) => {
    try {
      const { username, email, role, detail } = await c.req.json();
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await c.env.DB.prepare(
        `INSERT INTO users (username, email, role, detail, verification_code, status) 
         VALUES (?, ?, ?, ?, ?, 'pending_email')`
      ).bind(username, email, role, detail, code).run();

      await sendGmail(email, username, code);
      return c.json({ success: true, message: 'Doğrulama kodu gönderildi.' });
    } catch (error: any) {
      if (error.message.includes("UNIQUE")) return c.json({ success: false, error: 'Bu e-posta zaten kayıtlı.' }, 400);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  app.post('/api/verify', async (c) => {
    try {
      const { email, code } = await c.req.json();
      const user = await c.env.DB.prepare(`SELECT * FROM users WHERE email = ? AND verification_code = ?`).bind(email, code).first();

      if (!user) return c.json({ success: false, error: 'Geçersiz kod.' }, 400);

      await c.env.DB.prepare(`UPDATE users SET status = 'pending_admin', verification_code = NULL WHERE email = ?`).bind(email).run();
      return c.json({ success: true, message: 'Doğrulandı, admin onayı bekleniyor.' });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // --- ADMIN PANELİ API'LARI (Sadece senin key'inle çalışır) ---

  // Bekleyen kullanıcıları listele
  app.get('/api/admin/users', async (c) => {
    const key = c.req.query('key');
    if (key !== 'shizi2510') return c.json({ error: 'Yetkisiz' }, 401);

    const users = await c.env.DB.prepare(`SELECT * FROM users ORDER BY created_at DESC`).all();
    return c.json({ success: true, data: users.results });
  });

  // Durum Güncelle (Onayla/Reddet)
  app.post('/api/admin/update-status', async (c) => {
    const { email, status, key } = await c.req.json();
    if (key !== 'shizi2510') return c.json({ error: 'Yetkisiz' }, 401);

    await c.env.DB.prepare(`UPDATE users SET status = ? WHERE email = ?`).bind(status, email).run();
    return c.json({ success: true, message: 'Durum güncellendi.' });
  });
}

// Mail gönderme fonksiyonu (sendGmail) buraya eklenecek...
