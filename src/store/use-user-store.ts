import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserTitle = 'BCT Çırağı' | 'BCT Teknisyeni' | 'Klinik Mühendis Adayı' | 'Uzman Biyomedikalci';

interface User {
  username: string;
  email: string;
  role: string;      // Yeni: Kullanıcı rolü
  detail: string;    // Yeni: Okul veya Kurum detayı
  points: number;
  completedUnits: string[];
  accessedResources: string[];
  watchedVideos: string[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
  login: (username: string, email: string) => void;
  // Signup fonksiyonunu yeni metadata parametresini alacak şekilde güncelledik
  signup: (username: string, email: string, metadata?: { role: string; detail: string }) => void;
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
      
      login: (username, email) => set({ 
        user: { 
          username, 
          email, 
          role: 'other', // Login olan eski kullanıcılar için varsayılan
          detail: '',
          points: 100, 
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
          role: metadata?.role || 'other', // Gelen rolü kaydet
          detail: metadata?.detail || '',  // Gelen detayı kaydet
          points: 150, // Signup bonus
          completedUnits: [], 
          accessedResources: [],
          watchedVideos: [] 
        }, 
        isAuthenticated: true 
      }),

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
