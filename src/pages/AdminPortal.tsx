
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Users, Mail, GraduationCap } from 'lucide-react';

export default function AdminPortal() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const key = new URLSearchParams(search).get('key');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?key=${key}`);
      const result = await res.json();
      if (result.success) setUsers(result.data);
    } catch (e) { toast.error("Veriler alınamadı."); }
    setLoading(false);
  };

  const updateStatus = async (email: string, status: 'active' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status, key })
      });
      if ((await res.json()).success) {
        toast.success(`Kullanıcı ${status === 'active' ? 'Onaylandı' : 'Reddedildi'}`);
        fetchUsers();
      }
    } catch (e) { toast.error("İşlem başarısız."); }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="text-orange-500" /> Yönetim Paneli</h1>
        <div className="text-sm bg-slate-100 px-4 py-2 rounded-full font-mono text-slate-500">Key: {key}</div>
      </div>

      <div className="grid gap-4">
        {users.filter(u => u.status === 'pending_admin').map(user => (
          <div key={user.id} className="bg-white border-2 border-orange-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900">{user.username}</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase">{user.role}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                <span className="flex items-center gap-1"><GraduationCap size={14} /> {user.detail}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => updateStatus(user.email, 'active')} className="bg-teal-500 hover:bg-teal-600 gap-2 rounded-xl">
                <CheckCircle size={18} /> Onayla
              </Button>
              <Button onClick={() => updateStatus(user.email, 'rejected')} variant="outline" className="text-red-500 hover:bg-red-50 gap-2 rounded-xl border-red-100">
                <XCircle size={18} /> Reddet
              </Button>
            </div>
          </div>
        ))}
        {users.filter(u => u.status === 'pending_admin').length === 0 && (
          <div className="text-center py-20 text-slate-400 italic">Onay bekleyen kullanıcı bulunamadı.</div>
        )}
      </div>
    </div>
  );
}
