import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  CheckCircle, XCircle, Users, Mail, GraduationCap, ShieldCheck,
  Loader2, BookOpen, FileText, Newspaper, Plus, Pencil, Trash2,
  ChevronRight, ChevronDown, Video, Presentation,
  Save, X
} from 'lucide-react';

type UserStatus = 'pending_admin' | 'active' | 'rejected' | 'pending_email';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  detail: string;
  status: UserStatus;
  created_at: string;
}

// ─── API helper — Authorization: Bearer header kullanır ───────────────────
async function adminFetch(url: string, key: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
      Authorization: `Bearer ${key}`,
    },
  });
  return res.json();
}

// ─── Modal ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── ANA COMPONENT ────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'lessons' | 'blog' | 'resources'>('users');
  const { search } = useLocation();

  // Key sessionStorage'dan okunur — AppShell URL'den siler ama sessionStorage'a yazar
  const keyFromUrl = new URLSearchParams(search).get('key') || '';
  const key = keyFromUrl || sessionStorage.getItem('bct_admin_verified_key') || '';

  // Key URL'den geldiyse sessionStorage'a kaydet (bu component yeniden mount olduğunda kaybolmasın)
  useEffect(() => {
    if (keyFromUrl) {
      sessionStorage.setItem('bct_admin_verified_key', keyFromUrl);
    }
  }, [keyFromUrl]);

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">Admin paneline erişmek için geçerli URL ile girin.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users',     label: 'Kullanıcılar', icon: Users },
    { id: 'lessons',   label: 'Dersler',       icon: BookOpen },
    { id: 'blog',      label: 'Blog',           icon: Newspaper },
    { id: 'resources', label: 'Kaynaklar',      icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 pt-8">
        <div className="bg-slate-900 dark:bg-card text-white p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-orange-500 w-6 h-6" /> BCT Kontrol Merkezi
            </h1>
            <p className="text-slate-400 mt-1 text-sm">İçerik ve kullanıcı yönetimi</p>
          </div>
          <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-orange-400 text-xs">ADMIN</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20'
                  : 'bg-card text-muted-foreground border-border hover:border-teal-500/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users'     && <UsersTab     adminKey={key} />}
        {activeTab === 'lessons'   && <LessonsTab   adminKey={key} />}
        {activeTab === 'blog'      && <BlogTab       adminKey={key} />}
        {activeTab === 'resources' && <ResourcesTab adminKey={key} />}
      </div>
    </div>
  );
}

// ─── KULLANICILAR ─────────────────────────────────────────────────────────
function UsersTab({ adminKey }: { adminKey: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/users', adminKey);
      if (r.success) setUsers(r.data);
    } catch { toast.error('Kullanıcılar yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateStatus = async (email: string, status: 'active' | 'rejected') => {
    setUpdatingEmail(email);
    try {
      const r = await adminFetch('/api/admin/update-status', adminKey, {
        method: 'POST',
        body: JSON.stringify({ email, status }),
      });
      if (r.success) {
        toast.success(status === 'active' ? '✅ Kullanıcı onaylandı!' : '❌ Kullanıcı reddedildi.');
        fetchUsers();
      } else toast.error(r.error || 'İşlem başarısız.');
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
    setUpdatingEmail(null);
  };

  const pending = users.filter(u => u.status === 'pending_admin');
  const others  = users.filter(u => u.status !== 'pending_admin');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Bekleyen',   value: pending.length,                               color: 'text-orange-500' },
          { label: 'Aktif',      value: users.filter(u=>u.status==='active').length,   color: 'text-teal-500' },
          { label: 'Reddedilen', value: users.filter(u=>u.status==='rejected').length, color: 'text-red-500' },
          { label: 'Toplam',     value: users.length,                                  color: 'text-foreground' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Onay Bekleyenler ({pending.length})
        </h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>
        ) : pending.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
            <p className="text-muted-foreground text-sm">Onay bekleyen başvuru yok.</p>
          </div>
        ) : pending.map(user => (
          <div key={user.id} className="bg-card border border-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-foreground">{user.username}</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-bold uppercase">{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{user.email}</span>
                {user.detail && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3"/>{user.detail}</span>}
              </div>
              <p className="text-[10px] text-muted-foreground/60">{new Date(user.created_at).toLocaleString('tr-TR')}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => updateStatus(user.email, 'active')} disabled={!!updatingEmail}
                className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-600 font-bold h-10 rounded-xl border-none gap-1.5 text-sm">
                {updatingEmail === user.email ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <CheckCircle className="w-3.5 h-3.5"/>} Onayla
              </Button>
              <Button onClick={() => updateStatus(user.email, 'rejected')} disabled={!!updatingEmail}
                variant="ghost" className="flex-1 sm:flex-none text-red-500 hover:bg-red-500/10 font-bold h-10 rounded-xl gap-1.5 text-sm">
                <XCircle className="w-3.5 h-3.5"/> Reddet
              </Button>
            </div>
          </div>
        ))}
      </div>

      {others.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-muted-foreground text-sm">Diğer Kullanıcılar ({others.length})</h2>
          {others.map(user => (
            <div key={user.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-bold text-foreground text-sm">{user.username}</span>
                <span className="text-muted-foreground text-xs ml-2 truncate">{user.email}</span>
              </div>
              <StatusBadge status={user.status}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DERSLER ─────────────────────────────────────────────────────────────
function LessonsTab({ adminKey }: { adminKey: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: string; data?: any; parentId?: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/categories', adminKey);
      if (r.success) {
        const catsWithDetails = await Promise.all(r.data.map(async (cat: any) => {
          const cr = await adminFetch(`/api/admin/courses?category_id=${cat.id}`, adminKey);
          const courses = cr.success ? await Promise.all(cr.data.map(async (course: any) => {
            const ur = await adminFetch(`/api/admin/units?course_id=${course.id}`, adminKey);
            const units = ur.success ? await Promise.all(ur.data.map(async (unit: any) => {
              const tr = await adminFetch(`/api/admin/topics?unit_id=${unit.id}`, adminKey);
              return { ...unit, topics: tr.success ? tr.data : [] };
            })) : [];
            return { ...course, units };
          })) : [];
          return { ...cat, courses };
        }));
        setCategories(catsWithDetails);
      }
    } catch { toast.error('Dersler yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (type: string, data: any, id?: string) => {
    const urlMap: Record<string, string> = {
      category: '/api/admin/categories',
      course:   '/api/admin/courses',
      unit:     '/api/admin/units',
      topic:    '/api/admin/topics',
    };
    const url = id ? `${urlMap[type]}/${id}` : urlMap[type];
    try {
      const r = await adminFetch(url, adminKey, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      });
      if (r.success) { toast.success(id ? 'Güncellendi!' : 'Oluşturuldu!'); setModal(null); load(); }
      else toast.error(r.error || 'Hata oluştu.');
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    const urlMap: Record<string, string> = {
      category: '/api/admin/categories',
      course:   '/api/admin/courses',
      unit:     '/api/admin/units',
      topic:    '/api/admin/topics',
    };
    try {
      const r = await adminFetch(`${urlMap[type]}/${id}`, adminKey, { method: 'DELETE' });
      if (r.success) { toast.success('Silindi.'); load(); }
      else toast.error(r.error || 'Silinemedi.');
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-muted-foreground w-8 h-8"/></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-foreground">Kategoriler & Kurslar</h2>
        <Button onClick={() => setModal({ type: 'new-category' })}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-9 text-sm border-none gap-1.5">
          <Plus className="w-4 h-4"/> Kategori Ekle
        </Button>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30"
            onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
            <div className="flex items-center gap-3">
              {expandedCat === cat.id ? <ChevronDown className="w-4 h-4 text-muted-foreground"/> : <ChevronRight className="w-4 h-4 text-muted-foreground"/>}
              <span className="font-bold text-foreground">{cat.title}</span>
              <span className="text-xs text-muted-foreground">({cat.courses?.length || 0} kurs)</span>
            </div>
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal({ type: 'edit-category', data: cat })} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                <Pencil className="w-3.5 h-3.5"/>
              </button>
              <button onClick={() => handleDelete('category', cat.id)} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

          {expandedCat === cat.id && (
            <div className="border-t border-border">
              <div className="p-3 bg-muted/20 flex justify-end">
                <Button onClick={() => setModal({ type: 'new-course', parentId: cat.id })} size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8 text-xs border-none gap-1">
                  <Plus className="w-3 h-3"/> Kurs Ekle
                </Button>
              </div>
              {(cat.courses || []).map((course: any) => (
                <div key={course.id} className="border-t border-border/50">
                  <div className="flex items-center justify-between p-4 pl-8 cursor-pointer hover:bg-muted/20"
                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                    <div className="flex items-center gap-2">
                      {expandedCourse === course.id ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground"/> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground"/>}
                      <span className="font-semibold text-foreground text-sm">{course.title}</span>
                      <span className="text-xs text-muted-foreground">({course.units?.length || 0} ünite)</span>
                    </div>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setModal({ type: 'edit-course', data: course })} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                        <Pencil className="w-3 h-3"/>
                      </button>
                      <button onClick={() => handleDelete('course', course.id)} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3 h-3"/>
                      </button>
                    </div>
                  </div>

                  {expandedCourse === course.id && (
                    <div className="bg-muted/10">
                      <div className="p-2 pl-12 flex justify-end border-t border-border/30">
                        <Button onClick={() => setModal({ type: 'new-unit', parentId: course.id })} size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-7 text-xs border-none gap-1">
                          <Plus className="w-3 h-3"/> Ünite Ekle
                        </Button>
                      </div>
                      {(course.units || []).map((unit: any) => (
                        <div key={unit.id} className="border-t border-border/30">
                          <div className="flex items-center justify-between p-3 pl-12 cursor-pointer hover:bg-muted/30"
                            onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}>
                            <div className="flex items-center gap-2">
                              {expandedUnit === unit.id ? <ChevronDown className="w-3 h-3 text-muted-foreground"/> : <ChevronRight className="w-3 h-3 text-muted-foreground"/>}
                              <span className="text-sm text-foreground">{unit.title}</span>
                              <span className="text-[10px] text-muted-foreground">({unit.topics?.length || 0} konu)</span>
                            </div>
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <button onClick={() => setModal({ type: 'edit-unit', data: unit })} className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors">
                                <Pencil className="w-3 h-3"/>
                              </button>
                              <button onClick={() => handleDelete('unit', unit.id)} className="p-1 text-muted-foreground hover:text-red-500 rounded hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>
                          {expandedUnit === unit.id && (
                            <div className="bg-muted/20 pb-2">
                              <div className="p-2 pl-16 flex justify-end">
                                <Button onClick={() => setModal({ type: 'new-topic', parentId: unit.id })} size="sm"
                                  className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-7 text-xs border-none gap-1">
                                  <Plus className="w-3 h-3"/> Konu Ekle
                                </Button>
                              </div>
                              {(unit.topics || []).map((topic: any) => (
                                <div key={topic.id} className="flex items-center justify-between px-4 pl-16 py-2 hover:bg-muted/30">
                                  <span className="text-xs text-muted-foreground">{topic.title}</span>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => setModal({ type: 'edit-topic', data: topic })} className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors">
                                      <Pencil className="w-3 h-3"/>
                                    </button>
                                    <button onClick={() => handleDelete('topic', topic.id)} className="p-1 text-muted-foreground hover:text-red-500 rounded hover:bg-red-500/10 transition-colors">
                                      <Trash2 className="w-3 h-3"/>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {modal && <LessonsModal modal={modal} onClose={() => setModal(null)} onSave={handleSave}/>}
    </div>
  );
}

function LessonsModal({ modal, onClose, onSave }: { modal: any; onClose: () => void; onSave: (type: string, data: any, id?: string) => void }) {
  const isEdit = modal.type.startsWith('edit-');
  const entityType = modal.type.replace('new-', '').replace('edit-', '');
  const d = modal.data || {};
  const [form, setForm] = useState({ ...d });

  const titleMap: Record<string, string> = {
    category: 'Kategori', course: 'Kurs', unit: 'Ünite', topic: 'Konu'
  };

  const handleSubmit = () => {
    const payload = { ...form };
    if (!isEdit && modal.parentId) {
      if (entityType === 'course') payload.category_id = modal.parentId;
      if (entityType === 'unit')   payload.course_id   = modal.parentId;
      if (entityType === 'topic')  payload.unit_id     = modal.parentId;
    }
    onSave(entityType, payload, isEdit ? d.id : undefined);
  };

  return (
    <Modal title={`${isEdit ? 'Düzenle' : 'Yeni'} ${titleMap[entityType] || entityType}`} onClose={onClose}>
      <Field label="Başlık" required>
        <Input value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} className="rounded-xl bg-muted/50 border-border"/>
      </Field>

      {(entityType === 'course' || entityType === 'category') && (
        <Field label="Açıklama">
          <Textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[80px]"/>
        </Field>
      )}

      {entityType === 'course' && (
        <Field label="Görsel URL">
          <Input value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="https://..."/>
        </Field>
      )}

      {entityType === 'unit' && (
        <>
          <Field label="Açıklama">
            <Textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[80px]"/>
          </Field>
          <Field label="Tahmini Okuma Süresi">
            <Input value={form.estimated_reading_time||''} onChange={e=>setForm({...form,estimated_reading_time:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="60 dk"/>
          </Field>
        </>
      )}

      {entityType === 'topic' && (
        <>
          <Field label="İçerik">
            <Textarea value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[120px]"/>
          </Field>
          <Field label="YouTube Video ID (opsiyonel)">
            <Input value={form.video_youtube_id||''} onChange={e=>setForm({...form,video_youtube_id:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="dQw4w9WgXcQ"/>
          </Field>
        </>
      )}

      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
          <input type="checkbox" checked={!!form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})} className="rounded"/>
          Yayında
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl border-none gap-1.5">
          <Save className="w-4 h-4"/> {isEdit ? 'Kaydet' : 'Oluştur'}
        </Button>
        <Button onClick={onClose} variant="outline" className="rounded-xl border-border">İptal</Button>
      </div>
    </Modal>
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────
function BlogTab({ adminKey }: { adminKey: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ data?: any } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/blog', adminKey);
      if (r.success) setPosts(r.data);
    } catch { toast.error('Blog yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: any, id?: string) => {
    const url = id ? `/api/admin/blog/${id}` : '/api/admin/blog';
    try {
      const r = await adminFetch(url, adminKey, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      });
      if (r.success) { toast.success(id ? 'Güncellendi!' : 'Yazı oluşturuldu!'); setModal(null); load(); }
      else toast.error(r.error || 'Hata.');
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      const r = await adminFetch(`/api/admin/blog/${id}`, adminKey, { method: 'DELETE' });
      if (r.success) { toast.success('Silindi.'); load(); }
    } catch { toast.error('Silinemedi.'); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-muted-foreground w-8 h-8"/></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-foreground">Blog Yazıları ({posts.length})</h2>
        <Button onClick={() => setModal({})} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-9 text-sm border-none gap-1.5">
          <Plus className="w-4 h-4"/> Yazı Ekle
        </Button>
      </div>
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="w-16 h-12 rounded-xl object-cover shrink-0 opacity-80"/>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-sm truncate">{post.title}</span>
                {post.is_featured && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-bold">Öne Çıkan</span>}
                {!post.is_published && <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full font-bold">Taslak</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{post.author} · {post.category} · {post.read_time}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setModal({ data: post })} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors">
                <Pencil className="w-4 h-4"/>
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-2 text-muted-foreground hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal && <BlogModal data={modal.data} onClose={() => setModal(null)} onSave={handleSave}/>}
    </div>
  );
}

function BlogModal({ data, onClose, onSave }: { data?: any; onClose: () => void; onSave: (d: any, id?: string) => void }) {
  const [form, setForm] = useState({
    title: data?.title || '',
    excerpt: data?.excerpt || '',
    content: data?.content || '',
    author: data?.author || '',
    category: data?.category || '',
    image_url: data?.image_url || '',
    read_time: data?.read_time || '',
    is_featured: data?.is_featured || false,
    is_published: data?.is_published ?? true,
  });

  return (
    <Modal title={data ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'} onClose={onClose}>
      <Field label="Başlık" required><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="rounded-xl bg-muted/50 border-border"/></Field>
      <Field label="Özet"><Textarea value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[60px]"/></Field>
      <Field label="İçerik"><Textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[100px]"/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Yazar"><Input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} className="rounded-xl bg-muted/50 border-border"/></Field>
        <Field label="Kategori"><Input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl bg-muted/50 border-border"/></Field>
      </div>
      <Field label="Görsel URL"><Input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="https://..."/></Field>
      <Field label="Okuma Süresi"><Input value={form.read_time} onChange={e=>setForm({...form,read_time:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="5 dk okuma"/></Field>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} className="rounded"/> Öne Çıkan</label>
        <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})} className="rounded"/> Yayında</label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form, data?.id)} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl border-none gap-1.5">
          <Save className="w-4 h-4"/> {data ? 'Kaydet' : 'Oluştur'}
        </Button>
        <Button onClick={onClose} variant="outline" className="rounded-xl border-border">İptal</Button>
      </div>
    </Modal>
  );
}

// ─── KAYNAKLAR ────────────────────────────────────────────────────────────
function ResourcesTab({ adminKey }: { adminKey: string }) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ data?: any } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/resources', adminKey);
      if (r.success) setResources(r.data);
    } catch { toast.error('Kaynaklar yüklenemedi.'); }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: any, id?: string) => {
    const url = id ? `/api/admin/resources/${id}` : '/api/admin/resources';
    try {
      const r = await adminFetch(url, adminKey, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      });
      if (r.success) { toast.success(id ? 'Güncellendi!' : 'Kaynak oluşturuldu!'); setModal(null); load(); }
      else toast.error(r.error || 'Hata.');
    } catch { toast.error('Sunucuya bağlanılamadı.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kaynağı silmek istediğinize emin misiniz?')) return;
    try {
      const r = await adminFetch(`/api/admin/resources/${id}`, adminKey, { method: 'DELETE' });
      if (r.success) { toast.success('Silindi.'); load(); }
    } catch { toast.error('Silinemedi.'); }
  };

  const typeIcon = (type: string) => {
    if (type === 'Video') return <Video className="w-4 h-4 text-teal-500"/>;
    if (type === 'Sunum') return <Presentation className="w-4 h-4 text-orange-500"/>;
    return <FileText className="w-4 h-4 text-blue-500"/>;
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-muted-foreground w-8 h-8"/></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-foreground">Kaynaklar ({resources.length})</h2>
        <Button onClick={() => setModal({})} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-9 text-sm border-none gap-1.5">
          <Plus className="w-4 h-4"/> Kaynak Ekle
        </Button>
      </div>
      <div className="space-y-3">
        {resources.map(res => (
          <div key={res.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              {typeIcon(res.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-sm">{res.title}</span>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{res.type}</span>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{res.category}</span>
                {!res.is_published && <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full font-bold">Taslak</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{res.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setModal({ data: res })} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors">
                <Pencil className="w-4 h-4"/>
              </button>
              <button onClick={() => handleDelete(res.id)} className="p-2 text-muted-foreground hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal && <ResourceModal data={modal.data} onClose={() => setModal(null)} onSave={handleSave}/>}
    </div>
  );
}

function ResourceModal({ data, onClose, onSave }: { data?: any; onClose: () => void; onSave: (d: any, id?: string) => void }) {
  const [form, setForm] = useState({
    title: data?.title || '',
    description: data?.description || '',
    type: data?.type || 'PDF',
    category: data?.category || '',
    file_size: data?.file_size || '',
    duration: data?.duration || '',
    file_url: data?.file_url || '',
    is_published: data?.is_published ?? true,
  });

  return (
    <Modal title={data ? 'Kaynağı Düzenle' : 'Yeni Kaynak'} onClose={onClose}>
      <Field label="Başlık" required><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="rounded-xl bg-muted/50 border-border"/></Field>
      <Field label="Açıklama"><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-xl bg-muted/50 border-border min-h-[60px]"/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tür">
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-muted/50 text-foreground">
            <option>PDF</option><option>Video</option><option>Sunum</option>
          </select>
        </Field>
        <Field label="Kategori"><Input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl bg-muted/50 border-border"/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Dosya Boyutu"><Input value={form.file_size} onChange={e=>setForm({...form,file_size:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="4.2 MB"/></Field>
        <Field label="Süre (Video)"><Input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="15:20"/></Field>
      </div>
      <Field label="Dosya / İndirme URL"><Input value={form.file_url} onChange={e=>setForm({...form,file_url:e.target.value})} className="rounded-xl bg-muted/50 border-border" placeholder="https://..."/></Field>
      <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})} className="rounded"/> Yayında</label>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form, data?.id)} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl border-none gap-1.5">
          <Save className="w-4 h-4"/> {data ? 'Kaydet' : 'Oluştur'}
        </Button>
        <Button onClick={onClose} variant="outline" className="rounded-xl border-border">İptal</Button>
      </div>
    </Modal>
  );
}

// ─── YARDIMCI ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; cls: string }> = {
    active:        { label: 'Aktif',         cls: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    rejected:      { label: 'Reddedildi',    cls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    pending_admin: { label: 'Bekliyor',      cls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    pending_email: { label: 'Mail Bekliyor', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}
