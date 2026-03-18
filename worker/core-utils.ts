 * Core utilities for Cloudflare Workers — BCT Akademi
 *
 * Cloudflare Dashboard'da şu Secret'ları tanımla:
 *   Workers & Pages → bctakademi → Settings → Variables and Secrets
 *
 *   ADMIN_KEY      → güçlü bir değer (ör: openssl rand -hex 32)
 *   RESEND_API_KEY → resend.com'dan alınan API key
 *
 * wrangler.jsonc'ye şunu ekle (R2 için):
 *   "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "bctakademi-files" }]
 */
 
export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_KEY: string;        // Cloudflare Secret
  RESEND_API_KEY: string;   // Cloudflare Secret — resend.com API key
  BUCKET?: R2Bucket;        // Cloudflare R2 — opsiyonel, henüz bağlanmadıysa undefined
}
