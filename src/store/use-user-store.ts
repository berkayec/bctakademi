import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserStatus = 'pending_email' | 'pending_admin' | 'active' | 'rejected';
export type UserTitle  = 'BCT Çırağı' | 'BCT Teknisyeni' | 'Klinik Mühendis Adayı' | 'Uzman Biyomedikalci';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface User {
  username:          string;
  email:             string;
  role:              string;
  detail:            string;
  points:            number;
  status:            UserStatus;
  avatar:            string; // avatar id — AVATARS listesinden
  completedUnits:    string[];
  accessedResources: string[];
  watchedVideos:     string[];
  loginTime:         number;
}

interface UserState {
  user:               User | null;
  isAuthenticated:    boolean;
  hasSeenTutorial:    boolean;
  login:              (userData: Partial<User>) => void;
  signup:             (username: string, email: string, metadata: { role: string; detail: string; status: UserStatus }) => void;
  setStatus:          (status: UserStatus) => void;
  logout:             () => void;
  updateProfile:      (data: { username: string; detail: string; avatar: string }) => Promise<void>;
  addPoints:          (amount: number) => void;
  completeUnit:       (unitId: string) => void;
  trackResource:      (resourceId: string) => void;
  trackVideo:         (videoId: string) => void;
  setHasSeenTutorial: (val: boolean) => void;
  checkSessionExpiry: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user:            null,
      isAuthenticated: false,
      hasSeenTutorial: false,

      login: (userData) => set({
        user: {
          username:          userData.username          || '',
          email:             userData.email             || '',
          role:              userData.role              || 'other',
          detail:            userData.detail            || '',
          points:            userData.points            || 100,
          status:            userData.status            || 'active',
          avatar:            userData.avatar            || '',
          completedUnits:    userData.completedUnits    || [],
          accessedResources: userData.accessedResources || [],
          watchedVideos:     userData.watchedVideos     || [],
          loginTime:         Date.now(),
        },
        isAuthenticated: true,
      }),

      signup: (username, email, metadata) => set({
        user: {
          username,
          email,
          role:              metadata.role,
          detail:            metadata.detail,
          status:            metadata.status,
          avatar:            '',
          points:            150,
          completedUnits:    [],
          accessedResources: [],
          watchedVideos:     [],
          loginTime:         Date.now(),
        },
        isAuthenticated: true,
      }),

      setStatus: (newStatus) => set((state) => ({
        user: state.user ? { ...state.user, status: newStatus } : null,
      })),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: async ({ username, detail, avatar }) => {
        const { user } = get();
        if (!user) return;

        try {
          await fetch('/api/profile', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: user.email, username, detail, avatar }),
          });
        } catch {
          // Backend hata verse bile local güncelle
        }

        set((state) => ({
          user: state.user ? { ...state.user, username, detail, avatar } : null,
        }));
      },

      checkSessionExpiry: () => {
        const { user, logout } = get();
        if (!user?.loginTime) return;
        if (Date.now() - user.loginTime > SESSION_DURATION_MS) logout();
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
            points:         state.user.points + 100,
          },
        };
      }),

      trackResource: (resourceId) => set((state) => {
        if (!state.user || state.user.accessedResources.includes(resourceId)) return state;
        return {
          user: {
            ...state.user,
            accessedResources: [...state.user.accessedResources, resourceId],
            points:            state.user.points + 10,
          },
        };
      }),

      trackVideo: (videoId) => set((state) => {
        if (!state.user || state.user.watchedVideos.includes(videoId)) return state;
        return {
          user: {
            ...state.user,
            watchedVideos: [...state.user.watchedVideos, videoId],
            points:        state.user.points + 20,
          },
        };
      }),

      setHasSeenTutorial: (val) => set({ hasSeenTutorial: val }),
    }),
    {
      name:    'bct-user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state?.user?.loginTime) return;
        if (Date.now() - state.user.loginTime > SESSION_DURATION_MS) state.logout();
      },
    }
  )
);

export const getUserTitle = (points: number): UserTitle => {
  if (points <= 500)  return 'BCT Çırağı';
  if (points <= 1500) return 'BCT Teknisyeni';
  if (points <= 3000) return 'Klinik Mühendis Adayı';
  return 'Uzman Biyomedikalci';
};
