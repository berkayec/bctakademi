import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Kullanıcı durumları: 
// pending_email: Mail kodu bekleniyor
// pending_admin: Kod onaylandı, senin (admin) onayın bekleniyor
// active: Tam erişim
// rejected: Reddedildi
export type UserStatus = 'pending_email' | 'pending_admin' | 'active' | 'rejected';

export type UserTitle = 'BCT Çırağı' | 'BCT Teknisyeni' | 'Klinik Mühendis Adayı' | 'Uzman Biyomedikalci';

interface User {
  username: string;
  email: string;
  role: string;
  detail: string;
  points: number;
  status: UserStatus; // YENİ: Onay durumu
  completedUnits: string[];
  accessedResources: string[];
  watchedVideos: string[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
  login: (userData: Partial<User>) => void; // Güncellendi: Tüm veriyi alabilir
  signup: (username: string, email: string, metadata: { role: string; detail: string; status: UserStatus }) => void;
  setStatus: (status: UserStatus) => void; // YENİ: Durum güncelleme (onaylandığında kullanmak için)
  logout: () => void;
  addPoints: (amount: number) => void;
  completeUnit: (unitId: string) => void;
  trackResource: (resourceId: string) => void;
  trackVideo: (videoId: string) => void;
  setHasSeenTutorial: (val: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasSeenTutorial: false,
      
      login: (userData) => set({ 
        user: { 
          username: userData.username || '', 
          email: userData.email || '', 
          role: userData.role || 'other',
          detail: userData.detail || '',
          points: userData.points || 100,
          status: userData.status || 'active', // Eski kullanıcılara varsayılan aktif
          completedUnits: [], 
          accessedResources: [],
          watchedVideos: [] 
        }, 
        isAuthenticated: true 
      }),

      signup: (username, email, metadata) => set({ 
        user: { 
          username, 
          email, 
          role: metadata.role, 
          detail: metadata.detail, 
          status: metadata.status, // API'den gelen durum (örn: pending_admin)
          points: 150, 
          completedUnits: [], 
          accessedResources: [],
          watchedVideos: [] 
        }, 
        isAuthenticated: true // Session başladı ama status kısıtlı
      }),

      setStatus: (newStatus) => set((state) => ({
        user: state.user ? { ...state.user, status: newStatus } : null
      })),

      logout: () => set({ user: null, isAuthenticated: false }),
      
      addPoints: (amount) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, points: state.user.points + amount } };
      }),

      completeUnit: (unitId) => set((state) => {
        if (!state.user || state.user.completedUnits.includes(unitId)) return state;
        return { 
          user: { 
            ...state.user, 
            completedUnits: [...state.user.completedUnits, unitId],
            points: state.user.points + 100 
          } 
        };
      }),

      trackResource: (resourceId) => set((state) => {
        if (!state.user || state.user.accessedResources.includes(resourceId)) return state;
        return {
          user: {
            ...state.user,
            accessedResources: [...state.user.accessedResources, resourceId],
            points: state.user.points + 10
          }
        };
      }),

      trackVideo: (videoId) => set((state) => {
        if (!state.user || state.user.watchedVideos.includes(videoId)) return state;
        return {
          user: {
            ...state.user,
            watchedVideos: [...state.user.watchedVideos, videoId],
            points: state.user.points + 20
          }
        };
      }),

      setHasSeenTutorial: (val) => set({ hasSeenTutorial: val }),
    }),
    {
      name: 'bct-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getUserTitle = (points: number): UserTitle => {
  if (points <= 500) return 'BCT Çırağı';
  if (points <= 1500) return 'BCT Teknisyeni';
  if (points <= 3000) return 'Klinik Mühendis Adayı';
  return 'Uzman Biyomedikalci';
};
