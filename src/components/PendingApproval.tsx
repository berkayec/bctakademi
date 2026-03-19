import React from 'react';
import { useUserStore } from '@/store/use-user-store';
import { Button } from '@/components/ui/button';
import { Clock, ShieldCheck, LogOut, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function PendingApproval() {
  const { user, logout } = useUserStore();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-card rounded-[2.5rem] shadow-xl p-8 sm:p-12 text-center space-y-8 border border-border transition-colors">

        <div className="flex justify-center">
          <Logo size={60} />
        </div>

        <div className="relative flex justify-center">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 animate-pulse">
            <Clock className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-2 right-[calc(50%-3rem)] bg-card p-2 rounded-full shadow-lg border border-border">
            <ShieldCheck className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
            Başvurunuz <br />İnceleniyor
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Merhaba <span className="font-bold text-foreground">{user?.username}</span>,
            BCT Akademi'ye katılım isteğin başarıyla alındı.
          </p>
          <div className="bg-muted/50 rounded-2xl p-4 border border-border">
            <p className="text-sm text-muted-foreground font-medium">
              Eğitmenlerimiz biyomedikal kimliğini doğruladıktan sonra erişimin açılacaktır.
              Genellikle <span className="text-orange-500 font-bold">24 saat</span> içinde onaylanır.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-border text-foreground gap-2 hover:bg-muted transition-colors"
            onClick={() => window.location.href = 'mailto:akademi@bctakademi.com'}
          >
            <Mail className="w-4 h-4" /> Bize Ulaşın
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-destructive gap-2 transition-colors"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Button>
        </div>
      </div>

      <p className="mt-8 text-muted-foreground text-sm font-medium">
        Biyomedikal Cihaz Teknolojileri Akademisi &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
