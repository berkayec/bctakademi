import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Users, Mail, GraduationCap, ShieldCheck } from 'lucide-react';

export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  
  // URL'den veya local hafızadan key kontrolü (shizi2510)
  const key = new URLSearchParams(search).get('key') || localStorage.getItem('bct_admin_access_key');

  const fetchUsers = async () => {
    if (!key) return;
    try {
      const res = await fetch(`/api/admin/users?key=${key}`);
      const result = await res.json();
      if (result.success) setUsers(result.data);
    } catch (e) { toast.error("Kullanıcılar yüklenemedi."); }
    setLoading(false);
  };

  const updateStatus = async (email: string, status: 'active' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status, key })
      });
      const result = await res.json();
      if (result.success) {
        toast.success(status === 'active' ? "Kullanıcı Onaylandı!" : "Kullanıcı Reddedildi.");
        fetchUsers();
      }
    } catch (e) { toast.error("İşlem başarısız."); }
  };

  useEffect(() => { 
    if (key === 'shizi2510') {
      localStorage.setItem('bct_admin_access_key', key);
      fetchUsers(); 
    }
  }, [key]);

  if (!key || key !== 'shizi2510') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Yetkisiz Erişim</h1>
          <p className="text-slate-500">Bu sayfayı görüntülemek için geçerli bir anahtar gereklidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen pt-10">
      <div className="flex items-center justify-between bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-orange-500" /> BCT Kontrol Merkezi
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Bekleyen başvuruları buradan yönetebilirsiniz.</p>
        </div>
        <div className="hidden md:block bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 font-mono text-orange-400">
          ADMIN MODE
        </div>
      </div>

      <div className="grid gap-4">
        {users.filter(u => u.status === 'pending_admin').map(user => (
          <div key={user.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-900">{user.username}</span>
                <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest">{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail size={16} /> {user.email}</span>
                <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {user.detail}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={() => updateStatus(user.email, 'active')} className="flex-1 md:flex-none bg-teal-500 hover:bg-teal-600 font-bold h-12 rounded-xl gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                <CheckCircle size={18} /> Onayla
              </Button>
              <Button onClick={() => updateStatus(user.email, 'rejected')} variant="ghost" className="flex-1 md:flex-none text-red-500 hover:bg-red-50 font-bold h-12 rounded-xl gap-2 transition-all">
                <XCircle size={18} /> Reddet
              </Button>
            </div>
          </div>
        ))}

        {users.filter(u => u.status === 'pending_admin').length === 0 && !loading && (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Users className="mx-auto w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium italic">Şu an onay bekleyen başvuru bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
