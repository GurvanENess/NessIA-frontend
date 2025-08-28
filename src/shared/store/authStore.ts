import { create } from 'zustand';
import { supabaseClient } from '../services/supabase';

interface FormDataType {
  email: string;
  password: string;
  username?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (formData: FormDataType) => Promise<{ success: boolean; data: unknown }>;
}

export const useAuthStore = create<AuthStore>((set) => {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) {
      set({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata.name ||
            session.user.email!.split('@')[0],
          token: session.access_token,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  });

  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    signup: async ({ email, password, username }) => {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: username },
        },
      });
      if (error) throw error;
      return { success: true, data };
    },
    login: async (email, password) => {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            token: data.session?.access_token,
            name:
              data.user.user_metadata.display_name ||
              data.user.email!.split('@')[0],
          },
          isAuthenticated: true,
        });
      }
    },
    logout: async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    },
  };
});
