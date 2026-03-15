import React from 'react';
import { useUserStore } from '@/store/use-user-store';
import { Button } from '@/components/ui/button';
import { Clock, ShieldCheck, LogOut, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function PendingApproval() {
  const { user, logout } = useUserStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 text-center space-y-8 border border-slate-100">
        
        <div className="flex justify-center">
          <Logo size={60} />
        </div>

        <div className="relative">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 animate-pulse">
            <Clock className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
            <ShieldCheck className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">
            Başvurunuz <br />İnceleniyor
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Merhaba <span className="font-bold text-slate-700">{user?.username}</span>, 
            BCT Akademi'ye katılım isteğin başarıyla alındı. 
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 inline-block w-full">
            <p className="text-sm text-slate-600 font-medium">
              Eğitmenlerimiz biyomedikal kimliğini doğruladıktan sonra erişimin açılacaktır. 
              Genellikle <span className="text-orange-600 font-bold">24 saat</span> içinde onaylanır.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-200 text-slate-600 gap-2"
            onClick={() => window.location.href = 'mailto:destek@bctakademi.com'}
          >
            <Mail className="w-4 h-4" /> Bize Ulaşın
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-red-500 gap-2"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm font-medium">
        Biomedical Technology Academy &copy; 2026
      </p>
    </div>
  );
}
