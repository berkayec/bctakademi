import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Users, Mail, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Admin paneline erişim:
 *   /admin-control-portal?key=CLOUDFLARE_SECRET_DEGERI
 *
 * Key artık localStorage'a kaydedilmiyor.
 * Her ziyarette URL'de key olması gerekir.
 */

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

export function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const { search } = useLocation();

  // Key sadece URL'den okunur — localStorage'a yazılmaz
  const key = new URLSearchParams(search).get('key');

  const fetchUsers = async () => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?key=${encodeURIComponent(key)}`);
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error('Kullanıcılar yüklenemedi.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  const updateStatus = async (email: string, status: 'active' | 'rejected') => {
    if (!key) return;
    setUpdatingEmail(email);
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status, key }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(status === 'active' ? '✅ Kullanıcı onaylandı!' : '❌ Kullanıcı reddedildi.');
        fetchUsers();
      } else {
        toast.error(result.error || 'İşlem başarısız.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı.');
    }
    setUpdatingEmail(null);
  };

  useEffect(() => {
    if (key) fetchUsers();
    else setLoading(false);
  }, [key]);

  // Yetkisiz erişim
  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">Bu sayfayı görüntülemek için URL'de geçerli bir anahtar gereklidir.</p>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending_admin');
  const otherUsers   = users.filter(u => u.status !== 'pending_admin');

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-6 space-y-8 pt-10">

        {/* Başlık */}
        <div className="flex items-center justify-between bg-slate-900 dark:bg-card text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-orange-500" /> BCT Kontrol Merkezi
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Bekleyen başvuruları buradan yönetebilirsiniz.</p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 font-mono text-orange-400 text-sm">
              ADMIN MODE
            </span>
            <span className="text-slate-500 text-xs">{users.length} toplam kullanıcı</span>
          </div>
        </div>

        {/* İstatistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Bekleyen', value: pendingUsers.length, color: 'text-orange-500' },
            { label: 'Aktif', value: users.filter(u => u.status === 'active').length, color: 'text-teal-500' },
            { label: 'Reddedilen', value: users.filter(u => u.status === 'rejected').length, color: 'text-red-500' },
            { label: 'Toplam', value: users.length, color: 'text-foreground' },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Onay Bekleyenler */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Onay Bekleyenler ({pendingUsers.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
              <Users className="mx-auto w-12 h-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground font-medium italic">Şu an onay bekleyen başvuru bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  updating={updatingEmail === user.email}
                  onApprove={() => updateStatus(user.email, 'active')}
                  onReject={() => updateStatus(user.email, 'rejected')}
                />
              ))}
            </div>
          )}
        </section>

        {/* Diğer Kullanıcılar */}
        {otherUsers.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground text-muted-foreground">
              Diğer Kullanıcılar ({otherUsers.length})
            </h2>
            <div className="grid gap-3">
              {otherUsers.map(user => (
                <div key={user.id} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-foreground">{user.username}</span>
                    <span className="text-muted-foreground text-sm ml-3">{user.email}</span>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, updating, onApprove, onReject }: {
  user: AdminUser;
  updating: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-card border border-border p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-all">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xl font-bold text-foreground">{user.username}</span>
          <span className="text-[10px] font-black bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 px-3 py-1 rounded-full uppercase tracking-widest">
            {user.role}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
          {user.detail && <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {user.detail}</span>}
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          {new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <Button
          onClick={onApprove}
          disabled={updating}
          className="flex-1 md:flex-none bg-teal-500 hover:bg-teal-600 font-bold h-12 rounded-xl gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95 border-none"
        >
          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={16} />}
          Onayla
        </Button>
        <Button
          onClick={onReject}
          disabled={updating}
          variant="ghost"
          className="flex-1 md:flex-none text-red-500 hover:bg-red-500/10 font-bold h-12 rounded-xl gap-2 transition-all"
        >
          <XCircle size={16} /> Reddet
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; cls: string }> = {
    active:        { label: 'Aktif',     cls: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    rejected:      { label: 'Reddedildi', cls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    pending_admin: { label: 'Bekliyor',  cls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    pending_email: { label: 'Mail Bekliyor', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
}
