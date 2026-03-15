import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    
    // 1. KAYIT OLMA (SIGNUP)
    app.post('/api/signup', async (c) => {
        try {
            const { username, email, role, detail } = await c.req.json();
            
            // 6 haneli rastgele bir kod üret
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Kullanıcıyı D1 Veritabanına kaydet (Durum: pending_email)
            await c.env.DB.prepare(
                `INSERT INTO users (username, email, role, detail, verification_code, status) 
                 VALUES (?, ?, ?, ?, ?, 'pending_email')`
            )
            .bind(username, email, role, detail, code)
            .run();

            // Gmail üzerinden MailChannels kullanarak kodu gönder
            const emailSent = await sendGmail(email, username, code);

            return c.json({ 
                success: true, 
                message: 'Doğrulama kodu gönderildi.',
                status: emailSent ? 'Email Sent' : 'Email Failed' 
            });

        } catch (error: any) {
            // Eğer kullanıcı zaten varsa (UNIQUE constraint) hata döner
            if (error.message.includes("UNIQUE")) {
                return c.json({ success: false, error: 'Bu e-posta adresi zaten kayıtlı.' }, 400);
            }
            return c.json({ success: false, error: error.message }, 500);
        }
    });

    // 2. KOD DOĞRULAMA (VERIFY)
    app.post('/api/verify', async (c) => {
        try {
            const { email, code } = await c.req.json();

            // Kodu veritabanından kontrol et
            const user = await c.env.DB.prepare(
                `SELECT * FROM users WHERE email = ? AND verification_code = ?`
            )
            .bind(email, code)
            .first();

            if (!user) {
                return c.json({ success: false, error: 'Geçersiz kod veya e-posta.' }, 400);
            }

            // Kodu temizle ve durumu 'pending_admin' yap (Senin onayını bekliyor)
            await c.env.DB.prepare(
                `UPDATE users SET status = 'pending_admin', verification_code = NULL WHERE email = ?`
            )
            .bind(email)
            .run();

            return c.json({ 
                success: true, 
                message: 'E-posta başarıyla doğrulandı. Admin onayı bekleniyor.' 
            });

        } catch (error: any) {
            return c.json({ success: false, error: error.message }, 500);
        }
    });
}

// YARDIMCI FONKSİYON: Gmail Gönderimi
// Cloudflare Workers üzerinde en sağlıklı mail gönderme yolu MailChannels'dır.
async function sendGmail(toEmail: string, name: string, code: string) {
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: toEmail, name: name }] }],
            from: { email: "destek@bctakademi.com", name: "BCT Akademi" },
            subject: "BCT Akademi Doğrulama Kodun",
            content: [{ 
                type: "text/plain", 
                value: `Merhaba ${name},\n\nBCT Akademi'ye giriş yapmak için doğrulama kodun: ${code}\n\nBu koddan sonra hesabın admin onayına düşecektir.` 
            }],
        }),
    });

    return response.status === 202;
}
