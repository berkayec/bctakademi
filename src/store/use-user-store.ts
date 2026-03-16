import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Kullanıcı durumları: 
// pending_email: Mail kodu bekleniyor
// pending_admin: Kod onaylandı, senin (admin) onayın bekleniyor
// active: Tam erişim
// rejected: Reddedildi
export type UserStatus = 'pending_email' | 'pending_admin' | 'active' | 'rejected';

export type UserTitle = 'BCT Çırağı' | 'BCT Teknisyeni' | 'Klinik Mühendis Adayı' | 'Uzman Biyomedikalci';

// Session süresi: 7 gün (milisaniye cinsinden)
// Değiştirmek istersen: 1 gün = 1 * 24 * 60 * 60 * 1000
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface User {
  username: string;
  email: string;
  role: string;
  detail: string;
  points: number;
  status: UserStatus;
  completedUnits: string[];
  accessedResources: string[];
  watchedVideos: string[];
  loginTime: number; // Session başlangıç zamanı (timestamp)
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
  login: (userData: Partial<User>) => void;
  signup: (username: string, email: string, metadata: { role: string; detail: string; status: UserStatus }) => void;
  setStatus: (status: UserStatus) => void;
  logout: () => void;
  addPoints: (amount: number) => void;
  completeUnit: (unitId: string) => void;
  trackResource: (resourceId: string) => void;
  trackVideo: (videoId: string) => void;
  setHasSeenTutorial: (val: boolean) => void;
  checkSessionExpiry: () => void; // Session kontrolü
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
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
          status: userData.status || 'active',
          completedUnits: [],
          accessedResources: [],
          watchedVideos: [],
          loginTime: Date.now(), // Giriş zamanını kaydet
        },
        isAuthenticated: true
      }),

      signup: (username, email, metadata) => set({
        user: {
          username,
          email,
          role: metadata.role,
          detail: metadata.detail,
          status: metadata.status,
          points: 150,
          completedUnits: [],
          accessedResources: [],
          watchedVideos: [],
          loginTime: Date.now(), // Giriş zamanını kaydet
        },
        isAuthenticated: true
      }),

      setStatus: (newStatus) => set((state) => ({
        user: state.user ? { ...state.user, status: newStatus } : null
      })),

      logout: () => set({ user: null, isAuthenticated: false }),

      // Manuel session kontrolü — AppShell içinde çağrılabilir
      checkSessionExpiry: () => {
        const { user, logout } = get();
        if (!user?.loginTime) return;
        const elapsed = Date.now() - user.loginTime;
        if (elapsed > SESSION_DURATION_MS) {
          logout();
        }
      },

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

      // Sayfa açılışında (localStorage'dan yüklenince) session süresi kontrol edilir
      onRehydrateStorage: () => (state) => {
        if (!state?.user?.loginTime) return;
        const elapsed = Date.now() - state.user.loginTime;
        if (elapsed > SESSION_DURATION_MS) {
          // Session süresi dolmuş — otomatik çıkış
          state.logout();
        }
      },
    }
  )
);

export const getUserTitle = (points: number): UserTitle => {
  if (points <= 500) return 'BCT Çırağı';
  if (points <= 1500) return 'BCT Teknisyeni';
  if (points <= 3000) return 'Klinik Mühendis Adayı';
  return 'Uzman Biyomedikalci';
};
