import { Hono } from "hono";
import { Env } from './core-utils';

// ─── Kullanıcıya doğrulama kodu gönder ─────────────────────────────────────
async function sendVerificationEmail( 
  env: Env,
  to: string,
  username: string,
  code: string
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi <noreply@bctakademi.com>',
      to: [to],
      reply_to: 'destek@bctakademi.com',
      subject: 'BCT Akademi — E-posta Doğrulama Kodun',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f172a">Merhaba ${username} 👋</h2>
          <p style="color:#475569">BCT Akademi'ye kaydın için e-posta adresini doğrulaman gerekiyor.</p>
          <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center;margin:24px 0">
            <p style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Doğrulama Kodun</p>
            <p style="font-size:40px;font-weight:900;letter-spacing:.3em;color:#0f172a;margin:0">${code}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px">Bu kod 15 dakika geçerlidir. Eğer bu işlemi sen başlatmadıysan bu e-postayı görmezden gelebilirsin.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <p style="color:#cbd5e1;font-size:11px;text-align:center">Sorularınız için: <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a></p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API hatası: ${err}`);
  }
}

// ─── Admin'e yeni kayıt bildirimi gönder ────────────────────────────────────
async function sendAdminNotification(
  env: Env,
  username: string,
  email: string,
  role: string,
  detail: string
): Promise<void> {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi Sistem <noreply@bctakademi.com>',
      to: ['destek@bctakademi.com', 'bctakademidestek@gmail.com'],
      subject: `[Yeni Başvuru] ${username} — Admin Onayı Bekliyor`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:#f97316;border-radius:12px;padding:16px 24px;margin-bottom:24px">
            <h2 style="color:#fff;margin:0">🔔 Yeni Üyelik Başvurusu</h2>
          </div>
          <p style="color:#475569">E-postasını doğrulayan bir kullanıcı admin onayı bekliyor.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b;width:120px">Ad Soyad</td>
              <td style="padding:12px 16px;color:#0f172a;font-weight:600">${username}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">E-posta</td>
              <td style="padding:12px 16px;color:#0f172a">${email}</td>
            </tr>
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Rol</td>
              <td style="padding:12px 16px;color:#0f172a">${role}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Detay</td>
              <td style="padding:12px 16px;color:#0f172a">${detail || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:32px;text-align:center">
            <a href="https://bctakademi.com/admin-control-portal?key=${env.ADMIN_KEY}"
               style="background:#0f172a;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">
              Admin Paneline Git →
            </a>
          </div>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center">Bu mail otomatik gönderilmiştir.</p>
        </div>
      `,
    }),
  });
}

// ─── Input temizleme ────────────────────────────────────────────────────────
function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 255);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Rotalar ────────────────────────────────────────────────────────────────
export function userRoutes(app: Hono<{ Bindings: Env }>) {

  // POST /api/signup
  app.post('/api/signup', async (c) => {
    try {
      const body = await c.req.json();
      const username = sanitize(body.username);
      const email    = sanitize(body.email).toLowerCase();
      const role     = sanitize(body.role);
      const detail   = sanitize(body.detail);

      if (!username || !email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz isim veya e-posta.' }, 400);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const existing = await c.env.DB.prepare(
        'SELECT id, status FROM users WHERE email = ?'
      ).bind(email).first();

      if (existing) {
        if (existing.status === 'active') {
          return c.json({ success: false, error: 'Bu e-posta zaten aktif bir hesaba sahip.' }, 400);
        }
        await c.env.DB.prepare(
          `UPDATE users SET verification_code = ?, code_expires_at = datetime('now', '+15 minutes') WHERE email = ?`
        ).bind(code, email).run();
      } else {
        await c.env.DB.prepare(
          `INSERT INTO users (username, email, role, detail, verification_code, code_expires_at, status)
           VALUES (?, ?, ?, ?, ?, datetime('now', '+15 minutes'), 'pending_email')`
        ).bind(username, email, role, detail, code).run();
      }

      await sendVerificationEmail(c.env, email, username, code);
      return c.json({ success: true, message: 'Doğrulama kodu gönderildi.' });

    } catch (error: any) {
      console.error('[signup]', error);
      return c.json({ success: false, error: 'Kayıt sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/verify
  app.post('/api/verify', async (c) => {
    try {
      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();
      const code  = sanitize(body.code);

      if (!email || !code || code.length !== 6) {
        return c.json({ success: false, error: 'Geçersiz istek.' }, 400);
      }

      const user = await c.env.DB.prepare(
        `SELECT * FROM users
         WHERE email = ?
           AND verification_code = ?
           AND code_expires_at > datetime('now')`
      ).bind(email, code).first<{ username: string; email: string; role: string; detail: string }>();

      if (!user) {
        return c.json({ success: false, error: 'Kod geçersiz veya süresi dolmuş.' }, 400);
      }

      await c.env.DB.prepare(
        `UPDATE users SET status = 'pending_admin', verification_code = NULL, code_expires_at = NULL WHERE email = ?`
      ).bind(email).run();

      // Admin'e bildirim gönder — hata olsa kayıt akışını durdurma
      try {
        await sendAdminNotification(c.env, user.username, user.email, user.role, user.detail);
      } catch (notifErr) {
        console.error('[verify] Admin bildirimi gönderilemedi:', notifErr);
      }

      return c.json({ success: true, message: 'Doğrulandı, admin onayı bekleniyor.' });

    } catch (error: any) {
      console.error('[verify]', error);
      return c.json({ success: false, error: 'Doğrulama sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/login
  app.post('/api/login', async (c) => {
    try {
      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();

      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta.' }, 400);
      }

      const user = await c.env.DB.prepare(
        'SELECT username, email, role, detail, status FROM users WHERE email = ?'
      ).bind(email).first<{ username: string; email: string; role: string; detail: string; status: string }>();

      if (!user) {
        return c.json({ success: false, error: 'Bu e-posta ile kayıtlı bir hesap bulunamadı.' }, 404);
      }

      return c.json({ success: true, data: user });

    } catch (error: any) {
      console.error('[login]', error);
      return c.json({ success: false, error: 'Giriş sırasında bir hata oluştu.' }, 500);
    }
  });

  // ─── Admin API'leri ──────────────────────────────────────────────────────

  function checkAdminKey(key: string | null, env: Env): boolean {
    return !!key && key === env.ADMIN_KEY;
  }

  // GET /api/admin/users?key=...
  app.get('/api/admin/users', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) {
      return c.json({ error: 'Yetkisiz erişim.' }, 401);
    }
    const users = await c.env.DB.prepare(
      'SELECT id, username, email, role, detail, status, created_at FROM users ORDER BY created_at DESC'
    ).all();
    return c.json({ success: true, data: users.results });
  });

  // POST /api/admin/update-status
  app.post('/api/admin/update-status', async (c) => {
    try {
      const body   = await c.req.json();
      const key    = sanitize(body.key);
      const email  = sanitize(body.email).toLowerCase();
      const status = sanitize(body.status);

      if (!checkAdminKey(key, c.env)) {
        return c.json({ error: 'Yetkisiz erişim.' }, 401);
      }

      const allowed = ['active', 'rejected', 'pending_admin', 'pending_email'];
      if (!allowed.includes(status)) {
        return c.json({ error: 'Geçersiz durum değeri.' }, 400);
      }

      await c.env.DB.prepare(
        'UPDATE users SET status = ? WHERE email = ?'
      ).bind(status, email).run();

      // Kullanıcıya onay/red bildirimi gönder
      if (status === 'active' || status === 'rejected') {
        const user = await c.env.DB.prepare(
          'SELECT username FROM users WHERE email = ?'
        ).bind(email).first<{ username: string }>();

        if (user) {
          const isApproved = status === 'active';
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'BCT Akademi <noreply@bctakademi.com>',
              to: [email],
              reply_to: 'destek@bctakademi.com',
              subject: isApproved
                ? 'BCT Akademi — Hesabınız Onaylandı! 🎉'
                : 'BCT Akademi — Başvurunuz Hakkında',
              html: isApproved ? `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
                  <h2 style="color:#0f172a">Merhaba ${user.username} 🎉</h2>
                  <p style="color:#475569">BCT Akademi'ye hoş geldin! Hesabın onaylandı, artık tüm içeriklere erişebilirsin.</p>
                  <div style="text-align:center;margin:32px 0">
                    <a href="https://bctakademi.com/portal"
                       style="background:#f97316;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700">
                      Portala Git →
                    </a>
                  </div>
                  <p style="color:#94a3b8;font-size:12px">Sorularınız için: <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a></p>
                </div>
              ` : `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
                  <h2 style="color:#0f172a">Merhaba ${user.username}</h2>
                  <p style="color:#475569">Maalesef BCT Akademi'ye üyelik başvurunuz bu aşamada onaylanamamıştır.</p>
                  <p style="color:#475569">Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
                  <p style="color:#94a3b8;font-size:12px;margin-top:24px">
                    <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a>
                  </p>
                </div>
              `,
            }),
          });
        }
      }

      return c.json({ success: true, message: 'Durum güncellendi.' });

    } catch (error: any) {
      console.error('[update-status]', error);
      return c.json({ success: false, error: 'Güncelleme sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/contact
  app.post('/api/contact', async (c) => {
    try {
      const body    = await c.req.json();
      const name    = sanitize(body.name);
      const email   = sanitize(body.email).toLowerCase();
      const subject = sanitize(body.subject);
      const message = sanitize(body.message).slice(0, 2000);

      if (!name || !email || !isValidEmail(email) || !message) {
        return c.json({ success: false, error: 'Tüm alanları doldurmanız gerekmektedir.' }, 400);
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BCT Akademi İletişim <noreply@bctakademi.com>',
          to: ['destek@bctakademi.com', 'bctakademidestek@gmail.com'],
          reply_to: email,
          subject: `[İletişim] ${subject || 'Yeni Mesaj'} — ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
              <h2 style="color:#0f172a">Yeni İletişim Formu Mesajı</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:16px">
                <tr><td style="padding:8px;font-weight:700;color:#64748b;width:100px">Gönderen</td><td style="padding:8px;color:#0f172a">${name}</td></tr>
                <tr style="background:#f8fafc"><td style="padding:8px;font-weight:700;color:#64748b">E-posta</td><td style="padding:8px;color:#0f172a">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:700;color:#64748b">Konu</td><td style="padding:8px;color:#0f172a">${subject}</td></tr>
              </table>
              <div style="background:#f8fafc;border-left:4px solid #f97316;padding:16px;margin-top:24px;border-radius:0 8px 8px 0">
                <p style="color:#0f172a;line-height:1.6;white-space:pre-wrap">${message}</p>
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) throw new Error('Mail gönderilemedi.');
      return c.json({ success: true, message: 'Mesajınız iletildi.' });

    } catch (error: any) {
      console.error('[contact]', error);
      return c.json({ success: false, error: 'Mesaj gönderilemedi, lütfen tekrar deneyin.' }, 500);
    }
  });

// POST /api/profile
app.post('/api/profile', async (c) => {
  try {
    const body     = await c.req.json();
    const email    = sanitize(body.email).toLowerCase();
    const username = sanitize(body.username);
    const detail   = sanitize(body.detail);

    if (!email || !username) return c.json({ success: false, error: 'Geçersiz veri.' }, 400);

    await c.env.DB.prepare(
      'UPDATE users SET username = ?, detail = ? WHERE email = ?'
    ).bind(username, detail, email).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


  
  // POST /api/client-errors
  app.post('/api/client-errors', async (c) => {
    try {
      const body = await c.req.json();
      console.error('[CLIENT ERROR]', JSON.stringify(body));
      return c.json({ success: true });
    } catch {
      return c.json({ success: false }, 400);
    }
  });
}
