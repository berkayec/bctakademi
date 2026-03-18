import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  CheckCircle, XCircle, Users, Mail, GraduationCap, ShieldCheck,
  Loader2, BookOpen, FileText, Newspaper, Plus, Pencil, Trash2,
  ChevronDown, ChevronRight, Save, X, Eye, EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Tipler ────────────────────────────────────────────────────────────────
type UserStatus = 'pending_admin' | 'active' | 'rejected' | 'pending_email';
interface AdminUser {
  id: number; username: string; email: string;
  role: string; detail: string; status: UserStatus; created_at: string;
}
interface Category { id: string; title: string; sort_order: number; }
interface Course {
  id: string; category_id: string; title: string; description: string;
  image_url: string; sort_order: number; is_published: number;
}
interface Unit {
  id: string; course_id: string; title: string; description: string;
  estimated_reading_time: string; sort_order: number; is_published: number;
}
interface Topic {
  id: string; unit_id: string; title: string; content: string;
  sort_order: number; is_published: number;
}
interface BlogPost {
  id: string; title: string; excerpt: string; content: string; author: string;
  category: string; image_url: string; read_time: string; featured: number;
  is_published: number; published_at: string;
}
interface Resource {
  id: string; title: string; description: string; type: string; category: string;
  file_url: string; file_size: string; duration: string; is_published: number;
}

// ─── Admin paneli sekmeleri ─────────────────────────────────────────────────
const TABS = [
  { id: 'users',     label: 'Kullanıcılar', icon: Users },
  { id: 'courses',   label: 'Dersler',      icon: BookOpen },
  { id: 'blog',      label: 'Blog',         icon: Newspaper },
  { id: 'resources', label: 'Kaynaklar',    icon: FileText },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { search } = useLocation();
  const key = new URLSearchParams(search).get('key') ?? '';
  const [activeTab, setActiveTab] = useState<TabId>('users');

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">URL'de geçerli bir anahtar gereklidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 pt-8">

        {/* Başlık */}
        <div className="flex items-center justify-between bg-slate-900 dark:bg-card text-white p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-orange-500 shrink-0" /> BCT Kontrol Merkezi
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">İçerik ve kullanıcıları buradan yönetin.</p>
          </div>
          <span className="hidden md:block bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 font-mono text-orange-400 text-sm">
            ADMIN MODE
          </span>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-orange-500/50'
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* İçerik */}
        {activeTab === 'users'     && <UsersTab     adminKey={key} />}
        {activeTab === 'courses'   && <CoursesTab   adminKey={key} />}
        {activeTab === 'blog'      && <BlogTab       adminKey={key} />}
        {activeTab === 'resources' && <ResourcesTab adminKey={key} />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// KULLANICILAR SEKMESİ
// ══════════════════════════════════════════════════════════════════════════════
function UsersTab({ adminKey }: { adminKey: string }) {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?key=${encodeURIComponent(adminKey)}`);
      const r   = await res.json();
      if (r.success) setUsers(r.data);
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateStatus = async (email: string, status: 'active' | 'rejected') => {
    setUpdatingId(email);
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status, key: adminKey }),
      });
      const r = await res.json();
      if (r.success) {
        toast.success(status === 'active' ? '✅ Kullanıcı onaylandı!' : '❌ Kullanıcı reddedildi.');
        fetchUsers();
      } else toast.error(r.error || 'İşlem başarısız.');
    } catch { toast.error('Hata oluştu.'); }
    setUpdatingId(null);
  };

  const pending = users.filter(u => u.status === 'pending_admin');
  const others  = users.filter(u => u.status !== 'pending_admin');

  return (
    <div className="space-y-8">
      {/* İstatistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Bekleyen',   value: pending.length,                              color: 'text-orange-500' },
          { label: 'Aktif',      value: users.filter(u => u.status==='active').length, color: 'text-teal-500' },
          { label: 'Reddedilen', value: users.filter(u => u.status==='rejected').length, color: 'text-red-500' },
          { label: 'Toplam',     value: users.length,                                color: 'text-foreground' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bekleyenler */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Onay Bekleyenler ({pending.length})
        </h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : pending.length === 0 ? (
          <EmptyState icon={Users} text="Onay bekleyen başvuru yok." />
        ) : (
          <div className="grid gap-4">
            {pending.map(u => (
              <div key={u.id} className="bg-card border border-border p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-lg transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-foreground">{u.username}</span>
                    <span className="text-[10px] font-black bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 px-2.5 py-1 rounded-full uppercase tracking-widest">{u.role}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail size={13}/> {u.email}</span>
                    {u.detail && <span className="flex items-center gap-1.5"><GraduationCap size={13}/> {u.detail}</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">
                    {new Date(u.created_at).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button onClick={() => updateStatus(u.email, 'active')} disabled={updatingId === u.email}
                    className="flex-1 md:flex-none bg-teal-500 hover:bg-teal-600 font-bold h-11 rounded-xl gap-2 border-none">
                    {updatingId === u.email ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle size={15}/>} Onayla
                  </Button>
                  <Button onClick={() => updateStatus(u.email, 'rejected')} disabled={updatingId === u.email}
                    variant="ghost" className="flex-1 md:flex-none text-red-500 hover:bg-red-500/10 font-bold h-11 rounded-xl gap-2">
                    <XCircle size={15}/> Reddet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Diğerleri */}
      {others.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-muted-foreground">Diğer Kullanıcılar ({others.length})</h2>
          <div className="grid gap-2">
            {others.map(u => (
              <div key={u.id} className="bg-card border border-border px-5 py-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-foreground">{u.username}</span>
                  <span className="text-muted-foreground text-sm ml-3">{u.email}</span>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DERSLER SEKMESİ
// ══════════════════════════════════════════════════════════════════════════════
function CoursesTab({ adminKey }: { adminKey: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses]       = useState<Course[]>([]);
  const [units, setUnits]           = useState<Unit[]>([]);
  const [topics, setTopics]         = useState<Topic[]>([]);
  const [loading, setLoading]       = useState(true);

  // Hangi kurs/ünite açık
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedUnit,   setExpandedUnit]   = useState<string | null>(null);

  // Modal state
  type ModalType = 'category' | 'course' | 'unit' | 'topic' | null;
  const [modal, setModal]         = useState<ModalType>(null);
  const [editing, setEditing]     = useState<any>(null);
  const [parentId, setParentId]   = useState<string>('');
  const [formData, setFormData]   = useState<Record<string, any>>({});
  const [saving, setSaving]       = useState(false);

  const apiFetch = useCallback(async (path: string) => {
    const r = await fetch(`${path}${path.includes('?') ? '&' : '?'}key=${encodeURIComponent(adminKey)}`);
    return r.json();
  }, [adminKey]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [catR, courseR, unitR, topicR] = await Promise.all([
        apiFetch('/api/admin/categories'),
        apiFetch('/api/admin/courses'),
        apiFetch('/api/admin/units'),
        apiFetch('/api/admin/topics'),
      ]);
      if (catR.success)    setCategories(catR.data);
      if (courseR.success) setCourses(courseR.data);
      if (unitR.success)   setUnits(unitR.data);
      if (topicR.success)  setTopics(topicR.data);
    } catch { toast.error('Veriler yüklenemedi.'); }
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openCreate = (type: ModalType, pid = '') => {
    setEditing(null);
    setParentId(pid);
    setFormData({ is_published: true, sort_order: 0 });
    setModal(type);
  };

  const openEdit = (type: ModalType, item: any) => {
    setEditing(item);
    setFormData({ ...item, is_published: item.is_published !== 0 });
    setModal(type);
  };

  const closeModal = () => { setModal(null); setEditing(null); setFormData({}); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = !!editing;
      let url = '';
      let payload: any = { ...formData, key: adminKey };

      if (modal === 'category') {
        url = isEdit ? `/api/admin/categories/${editing.id}` : '/api/admin/categories';
      } else if (modal === 'course') {
        url = isEdit ? `/api/admin/courses/${editing.id}` : '/api/admin/courses';
        if (!isEdit) payload.category_id = parentId;
      } else if (modal === 'unit') {
        url = isEdit ? `/api/admin/units/${editing.id}` : '/api/admin/units';
        if (!isEdit) payload.course_id = parentId;
      } else if (modal === 'topic') {
        url = isEdit ? `/api/admin/topics/${editing.id}` : '/api/admin/topics';
        if (!isEdit) payload.unit_id = parentId;
      }

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const r = await res.json();
      if (r.success || r.id) {
        toast.success(isEdit ? 'Güncellendi!' : 'Oluşturuldu!');
        closeModal();
        loadAll();
      } else toast.error(r.error || 'Hata oluştu.');
    } catch { toast.error('Sunucu hatası.'); }
    setSaving(false);
  };

  const handleDelete = async (type: string, id: string, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz? (Alt içerikler de silinir)`)) return;
    try {
      const res = await fetch(`/api/admin/${type}/${id}?key=${encodeURIComponent(adminKey)}`, { method: 'DELETE' });
      const r   = await res.json();
      if (r.success) { toast.success('Silindi.'); loadAll(); }
      else toast.error(r.error || 'Silinemedi.');
    } catch { toast.error('Hata oluştu.'); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {/* Kategori başlıkları */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Kategoriler & Kurslar</h2>
        <Button onClick={() => openCreate('category')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-9 gap-2 border-none">
          <Plus className="w-4 h-4" /> Kategori Ekle
        </Button>
      </div>

      {categories.length === 0 && (
        <EmptyState icon={BookOpen} text="Henüz kategori yok. Başlamak için kategori ekleyin." />
      )}

      {categories.map(cat => {
        const catCourses = courses.filter(c => c.category_id === cat.id);
        return (
          <div key={cat.id} className="bg-card border border-border rounded-[1.5rem] overflow-hidden">
            {/* Kategori satırı */}
            <div className="flex items-center justify-between px-5 py-4 bg-muted/40">
              <span className="font-bold text-foreground text-base">{cat.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{catCourses.length} kurs</span>
                <CmsActionButtons
                  onEdit={() => openEdit('category', cat)}
                  onDelete={() => handleDelete('categories', cat.id, cat.title)}
                  onAdd={() => openCreate('course', cat.id)}
                  addLabel="Kurs Ekle"
                />
              </div>
            </div>

            {/* Kurslar */}
            {catCourses.map(course => {
              const courseUnits = units.filter(u => u.course_id === course.id);
              const isExpanded  = expandedCourse === course.id;
              return (
                <div key={course.id} className="border-t border-border">
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <span className="font-semibold text-foreground text-sm truncate">{course.title}</span>
                      <PublishedBadge published={course.is_published === 1} />
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">{courseUnits.length} ünite</span>
                      <CmsActionButtons
                        onEdit={() => openEdit('course', course)}
                        onDelete={() => handleDelete('courses', course.id, course.title)}
                        onAdd={() => { setExpandedCourse(course.id); openCreate('unit', course.id); }}
                        addLabel="Ünite Ekle"
                      />
                    </div>
                  </div>

                  {/* Üniteler */}
                  {isExpanded && (
                    <div className="bg-muted/20 border-t border-border">
                      {courseUnits.map(unit => {
                        const unitTopics  = topics.filter(t => t.unit_id === unit.id);
                        const isUnitExp   = expandedUnit === unit.id;
                        return (
                          <div key={unit.id} className="border-b border-border/50 last:border-0">
                            <div className="flex items-center justify-between pl-10 pr-5 py-2.5 hover:bg-muted/30 transition-colors">
                              <button
                                onClick={() => setExpandedUnit(isUnitExp ? null : unit.id)}
                                className="flex items-center gap-2 text-left flex-1 min-w-0"
                              >
                                {isUnitExp ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                                <span className="text-sm text-foreground truncate">{unit.title}</span>
                                <PublishedBadge published={unit.is_published === 1} />
                              </button>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <span className="text-xs text-muted-foreground hidden sm:block">{unitTopics.length} konu</span>
                                <CmsActionButtons
                                  onEdit={() => openEdit('unit', unit)}
                                  onDelete={() => handleDelete('units', unit.id, unit.title)}
                                  onAdd={() => { setExpandedUnit(unit.id); openCreate('topic', unit.id); }}
                                  addLabel="Konu Ekle"
                                />
                              </div>
                            </div>

                            {/* Konular */}
                            {isUnitExp && (
                              <div className="bg-background/50">
                                {unitTopics.map(topic => (
                                  <div key={topic.id} className="flex items-center justify-between pl-16 pr-5 py-2 border-t border-border/30 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-sm text-muted-foreground truncate">{topic.title}</span>
                                      <PublishedBadge published={topic.is_published === 1} />
                                    </div>
                                    <CmsActionButtons
                                      onEdit={() => openEdit('topic', topic)}
                                      onDelete={() => handleDelete('topics', topic.id, topic.title)}
                                    />
                                  </div>
                                ))}
                                <button
                                  onClick={() => openCreate('topic', unit.id)}
                                  className="flex items-center gap-2 pl-16 pr-5 py-2.5 text-xs text-orange-500 hover:text-orange-600 font-bold w-full text-left border-t border-border/30"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Konu Ekle
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <button
                        onClick={() => openCreate('unit', course.id)}
                        className="flex items-center gap-2 pl-10 pr-5 py-3 text-xs text-orange-500 hover:text-orange-600 font-bold w-full text-left border-t border-border/50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ünite Ekle
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {catCourses.length === 0 && (
              <div className="px-5 py-4 text-sm text-muted-foreground italic border-t border-border">
                Bu kategoride henüz kurs yok.
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      {modal && (
        <CmsModal
          title={`${editing ? 'Düzenle' : 'Ekle'} — ${
            modal === 'category' ? 'Kategori' : modal === 'course' ? 'Kurs' :
            modal === 'unit' ? 'Ünite' : 'Konu'
          }`}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {/* Başlık her zaman var */}
          <FormField label="Başlık *" value={formData.title || ''} onChange={v => setFormData(p => ({...p, title: v}))} />

          {modal === 'category' && (
            <FormField label="Sıra No" type="number" value={formData.sort_order ?? 0} onChange={v => setFormData(p => ({...p, sort_order: Number(v)}))} />
          )}

          {modal === 'course' && (
            <>
              <FormField label="Açıklama" value={formData.description || ''} onChange={v => setFormData(p => ({...p, description: v}))} textarea />
              <FormField label="Kapak Resmi URL" value={formData.image_url || ''} onChange={v => setFormData(p => ({...p, image_url: v}))} />
              <FormField label="Sıra No" type="number" value={formData.sort_order ?? 0} onChange={v => setFormData(p => ({...p, sort_order: Number(v)}))} />
              <PublishedToggle value={!!formData.is_published} onChange={v => setFormData(p => ({...p, is_published: v}))} />
            </>
          )}

          {modal === 'unit' && (
            <>
              <FormField label="Açıklama" value={formData.description || ''} onChange={v => setFormData(p => ({...p, description: v}))} textarea />
              <FormField label="Tahmini Okuma Süresi" value={formData.estimated_reading_time || ''} onChange={v => setFormData(p => ({...p, estimated_reading_time: v}))} placeholder="örn: 45 dk" />
              <FormField label="Sıra No" type="number" value={formData.sort_order ?? 0} onChange={v => setFormData(p => ({...p, sort_order: Number(v)}))} />
              <PublishedToggle value={!!formData.is_published} onChange={v => setFormData(p => ({...p, is_published: v}))} />
            </>
          )}

          {modal === 'topic' && (
            <>
              <FormField label="İçerik (Markdown)" value={formData.content || ''} onChange={v => setFormData(p => ({...p, content: v}))} textarea rows={10} />
              <FormField label="Sıra No" type="number" value={formData.sort_order ?? 0} onChange={v => setFormData(p => ({...p, sort_order: Number(v)}))} />
              <PublishedToggle value={!!formData.is_published} onChange={v => setFormData(p => ({...p, is_published: v}))} />
            </>
          )}
        </CmsModal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BLOG SEKMESİ
// ══════════════════════════════════════════════════════════════════════════════
function BlogTab({ adminKey }: { adminKey: string }) {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/blog?key=${encodeURIComponent(adminKey)}`);
      const d = await r.json();
      if (d.success) setPosts(d.data);
    } catch { toast.error('Blog yazıları yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ is_published: true, featured: false });
    setModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormData({ ...post, is_published: post.is_published !== 0, featured: post.featured !== 0 });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, key: adminKey }),
      });
      const r = await res.json();
      if (r.success || r.id) { toast.success(editing ? 'Güncellendi!' : 'Yazı oluşturuldu!'); setModal(false); load(); }
      else toast.error(r.error || 'Hata oluştu.');
    } catch { toast.error('Sunucu hatası.'); }
    setSaving(false);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`"${post.title}" silinsin mi?`)) return;
    const res = await fetch(`/api/admin/blog/${post.id}?key=${encodeURIComponent(adminKey)}`, { method: 'DELETE' });
    const r   = await res.json();
    if (r.success) { toast.success('Silindi.'); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Blog Yazıları ({posts.length})</h2>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-9 gap-2 border-none">
          <Plus className="w-4 h-4" /> Yazı Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground"/></div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} text="Henüz blog yazısı yok." />
      ) : (
        <div className="grid gap-3">
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground truncate">{post.title}</span>
                  {post.featured === 1 && <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">ÖNE ÇIKAN</span>}
                  <PublishedBadge published={post.is_published === 1} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{post.author && `${post.author} · `}{post.category && `${post.category} · `}{post.read_time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4"/>
                </button>
                <button onClick={() => handleDelete(post)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <CmsModal title={editing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'} onClose={() => setModal(false)} onSave={handleSave} saving={saving}>
          <FormField label="Başlık *" value={formData.title || ''} onChange={v => setFormData(p => ({...p, title: v}))} />
          <FormField label="Özet" value={formData.excerpt || ''} onChange={v => setFormData(p => ({...p, excerpt: v}))} textarea rows={3} />
          <FormField label="İçerik (Markdown)" value={formData.content || ''} onChange={v => setFormData(p => ({...p, content: v}))} textarea rows={10} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Yazar" value={formData.author || ''} onChange={v => setFormData(p => ({...p, author: v}))} />
            <FormField label="Kategori" value={formData.category || ''} onChange={v => setFormData(p => ({...p, category: v}))} />
          </div>
          <FormField label="Görsel URL" value={formData.image_url || ''} onChange={v => setFormData(p => ({...p, image_url: v}))} />
          <FormField label="Okuma Süresi" value={formData.read_time || ''} onChange={v => setFormData(p => ({...p, read_time: v}))} placeholder="örn: 5 dk okuma" />
          <div className="flex gap-6">
            <PublishedToggle value={!!formData.is_published} onChange={v => setFormData(p => ({...p, is_published: v}))} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!formData.featured} onChange={e => setFormData(p => ({...p, featured: e.target.checked}))} className="w-4 h-4 accent-amber-500" />
              <span className="text-sm font-medium text-foreground">Öne Çıkan</span>
            </label>
          </div>
        </CmsModal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// KAYNAKLAR SEKMESİ
// ══════════════════════════════════════════════════════════════════════════════
function ResourcesTab({ adminKey }: { adminKey: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState<Resource | null>(null);
  const [formData, setFormData]   = useState<Record<string, any>>({});
  const [saving, setSaving]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/resources?key=${encodeURIComponent(adminKey)}`);
      const d = await r.json();
      if (d.success) setResources(d.data);
    } catch { toast.error('Kaynaklar yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setFormData({ type: 'PDF', is_published: true }); setModal(true); };
  const openEdit   = (r: Resource) => { setEditing(r); setFormData({ ...r, is_published: r.is_published !== 0 }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/resources/${editing.id}` : '/api/admin/resources';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, key: adminKey }),
      });
      const r = await res.json();
      if (r.success || r.id) { toast.success(editing ? 'Güncellendi!' : 'Kaynak oluşturuldu!'); setModal(false); load(); }
      else toast.error(r.error || 'Hata oluştu.');
    } catch { toast.error('Sunucu hatası.'); }
    setSaving(false);
  };

  const handleDelete = async (res: Resource) => {
    if (!confirm(`"${res.title}" silinsin mi?`)) return;
    const r = await fetch(`/api/admin/resources/${res.id}?key=${encodeURIComponent(adminKey)}`, { method: 'DELETE' });
    const d = await r.json();
    if (d.success) { toast.success('Silindi.'); load(); }
  };

  const typeColors: Record<string, string> = {
    PDF:    'bg-red-500/10 text-red-600 dark:text-red-400',
    Video:  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    Sunum:  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Kaynaklar ({resources.length})</h2>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-9 gap-2 border-none">
          <Plus className="w-4 h-4" /> Kaynak Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground"/></div>
      ) : resources.length === 0 ? (
        <EmptyState icon={FileText} text="Henüz kaynak yok." />
      ) : (
        <div className="grid gap-3">
          {resources.map(res => (
            <div key={res.id} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${typeColors[res.type] || ''}`}>{res.type}</span>
                  <span className="font-bold text-foreground truncate">{res.title}</span>
                  <PublishedBadge published={res.is_published === 1} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {res.category && `${res.category} · `}
                  {res.file_size && `${res.file_size} · `}
                  {res.duration && res.duration}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(res)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4"/>
                </button>
                <button onClick={() => handleDelete(res)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <CmsModal title={editing ? 'Kaynağı Düzenle' : 'Yeni Kaynak'} onClose={() => setModal(false)} onSave={handleSave} saving={saving}>
          <FormField label="Başlık *" value={formData.title || ''} onChange={v => setFormData(p => ({...p, title: v}))} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tür *</label>
            <select
              value={formData.type || 'PDF'}
              onChange={e => setFormData(p => ({...p, type: e.target.value}))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              {['PDF','Video','Sunum'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <FormField label="Açıklama" value={formData.description || ''} onChange={v => setFormData(p => ({...p, description: v}))} textarea />
          <FormField label="Kategori" value={formData.category || ''} onChange={v => setFormData(p => ({...p, category: v}))} />
          <FormField label="Dosya / Video URL" value={formData.file_url || ''} onChange={v => setFormData(p => ({...p, file_url: v}))} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Dosya Boyutu" value={formData.file_size || ''} onChange={v => setFormData(p => ({...p, file_size: v}))} placeholder="örn: 4.2 MB" />
            <FormField label="Video Süresi" value={formData.duration || ''} onChange={v => setFormData(p => ({...p, duration: v}))} placeholder="örn: 15:20" />
          </div>
          <PublishedToggle value={!!formData.is_published} onChange={v => setFormData(p => ({...p, is_published: v}))} />
        </CmsModal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORTAK ALT BİLEŞENLER
// ══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; cls: string }> = {
    active:        { label: 'Aktif',          cls: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    rejected:      { label: 'Reddedildi',     cls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    pending_admin: { label: 'Bekliyor',       cls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    pending_email: { label: 'Mail Bekliyor',  cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${cls}`}>{label}</span>;
}

function PublishedBadge({ published }: { published: boolean }) {
  return published ? null : (
    <span className="text-[10px] font-black bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Taslak</span>
  );
}

function CmsActionButtons({
  onEdit, onDelete, onAdd, addLabel
}: {
  onEdit: () => void;
  onDelete: () => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {onAdd && (
        <button onClick={onAdd} title={addLabel}
          className="p-1.5 rounded-lg hover:bg-orange-500/10 text-muted-foreground hover:text-orange-500 transition-colors">
          <Plus className="w-3.5 h-3.5"/>
        </button>
      )}
      <button onClick={onEdit}
        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
        <Pencil className="w-3.5 h-3.5"/>
      </button>
      <button onClick={onDelete}
        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
        <Trash2 className="w-3.5 h-3.5"/>
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="text-center py-16 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border">
      <Icon className="mx-auto w-12 h-12 text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground font-medium italic">{text}</p>
    </div>
  );
}

function CmsModal({
  title, children, onClose, onSave, saving
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-foreground text-base">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {children}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <Button onClick={onClose} variant="ghost" className="flex-1 font-bold rounded-xl h-11">İptal</Button>
          <Button onClick={onSave} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11 gap-2 border-none">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label, value, onChange, type = 'text', textarea = false, rows = 4, placeholder
}: {
  label: string; value: any; onChange: (v: string) => void;
  type?: string; textarea?: boolean; rows?: number; placeholder?: string;
}) {
  const cls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-y";
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={cls} />
      ) : (
        <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="rounded-xl border-border focus-visible:ring-orange-500/50" />
      )}
    </div>
  );
}

function PublishedToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all',
        value
          ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'
          : 'bg-muted border-border text-muted-foreground'
      )}
    >
      {value ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
      {value ? 'Yayında' : 'Taslak'}
    </button>
  );
}
