import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, PenTool, FileBox, 
  Image as ImageIcon, Settings, Plus, Edit, 
  Trash2, Save, X, ChevronRight, Video, FileText,
  TrendingUp, Users, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- TÜRLER ---
type TabType = 'overview' | 'courses' | 'blog' | 'resources' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-72 border-r border-border bg-card/50 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Settings className="w-6 h-6" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase">BCT <span className="text-orange-500">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <MenuButton id="overview" name="Genel Bakış" icon={LayoutDashboard} activeTab={activeTab} onClick={setActiveTab} />
          <MenuButton id="courses" name="Dersler & Üniteler" icon={BookOpen} activeTab={activeTab} onClick={setActiveTab} />
          <MenuButton id="blog" name="Blog Yazıları" icon={PenTool} activeTab={activeTab} onClick={setActiveTab} />
          <MenuButton id="resources" name="Kaynak Merkezi" icon={FileBox} activeTab={activeTab} onClick={setActiveTab} />
          <div className="pt-6 mt-6 border-t border-border">
            <MenuButton id="settings" name="Site Ayarları" icon={Settings} activeTab={activeTab} onClick={setActiveTab} />
          </div>
        </nav>

        <div className="p-6 border-t border-border bg-muted/20">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-rose-500 font-bold">
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 overflow-y-auto">
        <header className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background/50 backdrop-blur-md sticky top-0 z-40 border-b border-border/50">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight uppercase italic">
              {activeTab === 'overview' && "Yönetim Paneli"}
              {activeTab === 'courses' && "Müfredat Yönetimi"}
              {activeTab === 'blog' && "İçerik Editörü"}
              {activeTab === 'resources' && "Kütüphane Yönetimi"}
              {activeTab === 'settings' && "Sistem Ayarları"}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">Hoş geldin Berkay, bugün neyi güncellemek istersin?</p>
          </div>
          <div className="flex gap-3">
             <Button asChild variant="outline" className="rounded-xl border-border font-bold">
               <a href="/" target="_blank">SİTEYE GİT</a>
             </Button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewSection />}
              {activeTab === 'courses' && <CourseManager />}
              {activeTab === 'blog' && <BlogManager />}
              {activeTab === 'resources' && <ResourceManager />}
              {activeTab === 'settings' && <SettingsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- ALT BİLEŞENLER ---

function MenuButton({ id, name, icon: Icon, activeTab, onClick }: { id: TabType, name: string, icon: any, activeTab: TabType, onClick: any }) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group",
        active 
          ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-orange-500")} />
      {name}
    </button>
  );
}

// 1. GENEL BAKIŞ
function OverviewSection() {
  const stats = [
    { label: 'Toplam Öğrenci', value: '1,284', icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Aktif Kurslar', value: '18', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Bitirilen Üniteler', value: '5,420', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Yeni Kayıtlar', value: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", s.bg)}>
                <s.icon className={cn("w-6 h-6", s.color)} />
              </div>
              <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-3xl font-black">{s.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold mb-6">Son Aktiviteler</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">AY</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Ahmet Yılmaz <span className="font-normal text-muted-foreground">"Ventilatör Bakımı" kursunu bitirdi.</span></p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">14 Dakika Önce</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// 2. DERS YÖNETİMİ
function CourseManager() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-muted/30 p-8 rounded-[2.5rem] border border-border">
        <div>
          <h3 className="text-2xl font-bold">Kurs Listesi</h3>
          <p className="text-muted-foreground font-medium">Yeni kurs ekle veya mevcutları düzenle.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95">
          <Plus className="w-5 h-5 mr-2" /> YENİ KURS EKLE
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { title: 'EKG Cihazları Bakımı', cat: 'Klinik Mühendislik', units: 8 },
          { title: 'Biyomedikal Sensörler', cat: 'Temel Elektronik', units: 12 },
          { title: 'Görüntüleme Sistemleri', cat: 'İleri Düzey', units: 5 },
        ].map((c, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-[2rem] flex items-center justify-between group hover:border-orange-500/50 transition-all shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{c.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="secondary" className="rounded-lg text-[10px]">{c.cat}</Badge>
                  <span className="text-xs text-muted-foreground font-bold">{c.units} Ünite</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-teal-500/10 hover:text-teal-500"><Edit className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-rose-500/10 hover:text-rose-500"><Trash2 className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="rounded-xl"><ChevronRight className="w-5 h-5" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* DERS EKLEME MODALI */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[3rem] p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic uppercase tracking-tight">Yeni Kurs</h2>
              <Button size="icon" variant="ghost" onClick={() => setShowModal(false)} className="rounded-full"><X className="w-6 h-6" /></Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kurs Başlığı</label>
                <Input className="rounded-2xl h-14 bg-muted/50 border-border px-6 font-bold" placeholder="Örn: Diyaliz Cihazları Revizyonu" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Açıklama</label>
                <Textarea className="rounded-2xl min-h-[120px] bg-muted/50 border-border p-6 font-medium" placeholder="Kursun kısa özeti..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kategori</label>
                  <select className="w-full h-14 rounded-2xl bg-muted/50 border border-border px-6 font-bold outline-none appearance-none">
                    <option>Temel Dersler</option>
                    <option>Alan Dersleri</option>
                    <option>Klinik Mühendislik</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kapak Görseli URL</label>
                  <Input className="rounded-2xl h-14 bg-muted/50 border-border px-6 font-bold" placeholder="https://..." />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setShowModal(false)} variant="ghost" className="flex-1 h-14 rounded-2xl font-bold">İptal</Button>
                <Button className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20">KAYDET VE YAYINLA</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// 3. BLOG YÖNETİMİ
function BlogManager() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-orange-500 p-8 rounded-[2.5rem] text-white">
        <div>
          <h3 className="text-2xl font-bold">BCT Güncel Editörü</h3>
          <p className="opacity-80 font-medium">Sektördeki son haberleri ve teknik yazıları paylaş.</p>
        </div>
        <Button className="bg-white text-orange-500 hover:bg-slate-100 rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest shadow-xl">
          <Plus className="w-5 h-5 mr-2" /> YENİ YAZI OLUŞTUR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i} className="bg-card border-border rounded-[2.5rem] overflow-hidden group transition-all hover:shadow-2xl">
            <div className="aspect-video bg-muted relative overflow-hidden">
               <div className="absolute inset-0 bg-black/20" />
               <Badge className="absolute top-4 left-4 bg-orange-500">Yayınlandı</Badge>
            </div>
            <CardContent className="p-8 space-y-4">
              <h4 className="text-2xl font-bold leading-tight group-hover:text-orange-500 transition-colors">Yapay Zeka Destekli Radyoloji Sistemleri</h4>
              <p className="text-muted-foreground text-sm line-clamp-2">Geleceğin hastanelerinde görüntüleme teknolojileri nasıl evriliyor...</p>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">12 Mart 2026</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-teal-500/10"><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 4. KAYNAK YÖNETİMİ
function ResourceManager() {
  return (
    <div className="space-y-8">
      <Card className="bg-muted/30 border-border border-2 border-dashed rounded-[3rem] p-12 text-center group hover:bg-muted/50 transition-all">
        <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
          <FileBox className="w-10 h-10 text-teal-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Yeni Kaynak Yükle</h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">PDF teknik dökümanlar, sunumlar veya yardımcı video linklerini ekle.</p>
        <Button className="bg-teal-600 hover:bg-teal-500 rounded-2xl h-14 px-10 font-black">YÜKLEMEYE BAŞLA</Button>
      </Card>
      
      {/* Kaynak Listesi Tablo... */}
    </div>
  );
}

// 5. SİTE AYARLARI
function SettingsSection() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="max-w-2xl space-y-8">
      <Card className="bg-card border-border rounded-[2.5rem] p-8 space-y-8">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Settings className="w-6 h-6 text-orange-500" /> Kritik Ayarlar
        </h3>
        
        <div className="flex items-center justify-between p-6 bg-muted/50 rounded-3xl border border-border">
          <div className="space-y-1">
            <p className="font-bold">Bakım Modu</p>
            <p className="text-xs text-muted-foreground">Siteyi ziyaretçilere kapat ve bakım ekranını göster.</p>
          </div>
          <button 
            onClick={() => setMaintenance(!maintenance)}
            className={cn(
              "w-16 h-8 rounded-full transition-all relative p-1",
              maintenance ? "bg-orange-500" : "bg-slate-700"
            )}
          >
            <div className={cn("w-6 h-6 bg-white rounded-full transition-all shadow-md", maintenance ? "translate-x-8" : "translate-x-0")} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Site Başlığı</label>
            <Input className="rounded-2xl h-14 bg-muted/50 border-border px-6 font-bold" defaultValue="BCT Akademi | Biyomedikal Eğitim Portalı" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Admin İletişim E-posta</label>
            <Input className="rounded-2xl h-14 bg-muted/50 border-border px-6 font-bold" defaultValue="akademi@bctakademi.com" />
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-500 rounded-2xl h-16 font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-900/20">
            <Save className="w-5 h-5 mr-2" /> TÜM AYARLARI KAYDET
          </Button>
        </div>
      </Card>
    </div>
  );
}
