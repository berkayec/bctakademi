import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    
    // --- KULLANICI İŞLEMLERİ ---

    app.post('/api/signup', async (c) => {
        try {
            const { username, email, role, detail } = await c.req.json();
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await c.env.DB.prepare(
                `INSERT INTO users (username, email, role, detail, verification_code, status) 
                 VALUES (?, ?, ?, ?, ?, 'pending_email')`
            ).bind(username, email, role, detail, code).run();

            const emailSent = await sendGmail(email, username, code);
            return c.json({ success: true, message: 'Kod gönderildi.', status: emailSent ? 'Sent' : 'Failed' });
        } catch (error: any) {
            if (error.message.includes("UNIQUE")) return c.json({ success: false, error: 'E-posta zaten kayıtlı.' }, 400);
            return c.json({ success: false, error: error.message }, 500);
        }
    });

    app.post('/api/verify', async (c) => {
        try {
            const { email, code } = await c.req.json();
            const user = await c.env.DB.prepare(`SELECT * FROM users WHERE email = ? AND verification_code = ?`).bind(email, code).first();

            if (!user) return c.json({ success: false, error: 'Geçersiz kod.' }, 400);

            await c.env.DB.prepare(`UPDATE users SET status = 'pending_admin', verification_code = NULL WHERE email = ?`).bind(email).run();
            
            // Admin Bildirimi
            await sendAdminAlert(user.username, user.email);

            return c.json({ success: true, message: 'Doğrulandı, admin onayı bekleniyor.' });
        } catch (error: any) {
            return c.json({ success: false, error: error.message }, 500);
        }
    });

    // --- ADMIN İŞLEMLERİ (Özel Yetkili) ---

    // Bekleyen veya tüm kullanıcıları listele
    app.get('/api/admin/users', async (c) => {
        const key = c.req.query('key');
        if (key !== 'shizi2510') return c.json({ error: 'Yetkisiz erişim' }, 401);

        const users = await c.env.DB.prepare(`SELECT * FROM users ORDER BY created_at DESC`).all();
        return c.json({ success: true, data: users.results });
    });

    // Kullanıcı durumunu güncelle (Onayla/Reddet)
    app.post('/api/admin/update-status', async (c) => {
        const { email, status, key } = await c.req.json();
        if (key !== 'shizi2510') return c.json({ error: 'Yetkisiz erişim' }, 401);

        await c.env.DB.prepare(`UPDATE users SET status = ? WHERE email = ?`)
            .bind(status, email)
            .run();

        return c.json({ success: true, message: `Kullanıcı durumu ${status} olarak güncellendi.` });
    });
}

// Mail Fonksiyonları
async function sendGmail(to: string, name: string, code: string) {
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: to, name }] }],
            from: { email: "destek@bctakademi.com", name: "BCT Akademi" },
            subject: "BCT Doğrulama Kodu",
            content: [{ type: "text/plain", value: `Merhaba ${name}, kodun: ${code}` }],
        }),
    });
    return response.status === 202;
}

async function sendAdminAlert(name: string, email: string) {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: "destek@bctakademi.com", name: "Admin" }] }],
            from: { email: "sistem@bctakademi.com", name: "BCT Sistem" },
            subject: `Yeni Onay Bekleyen: ${name}`,
            content: [{ type: "text/plain", value: `${name} (${email}) e-posta onayını yaptı, senin onayını bekliyor.` }],
        }),
    });
}
