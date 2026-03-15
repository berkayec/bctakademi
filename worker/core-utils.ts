/**
 * Core utilities for the Cloudflare Durable Object and KV template
 * MODIFIED: Added D1 Database binding for BCT Akademi
 */

export interface Env {
    ASSETS: Fetcher;
    // YENİ: Veritabanını buraya tanımlıyoruz
    DB: D1Database; 
}
