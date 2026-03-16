/**
 * Core utilities for Cloudflare Workers — BCT Akademi
 *
 * Cloudflare Dashboard'da şu Secret'ları tanımla:
 *   Workers & Pages → bctakademi → Settings → Variables and Secrets
 *
 *   ADMIN_KEY    → güçlü bir değer (ör: openssl rand -hex 32)
 *   RESEND_API_KEY → resend.com'dan alınan API key
 */
 
export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_KEY: string;       // Cloudflare Secret — kodda asla hardcode etme
  RESEND_API_KEY: string;  // Cloudflare Secret — resend.com API key
}
 
