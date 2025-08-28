import { create } from 'zustand';
import { LoginErrors } from '../entities/entities';

interface LoginStore {
  isLoading: boolean;
  errors: LoginErrors;
  setLoading: (isLoading: boolean) => void;
  setErrors: (errors: LoginErrors) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  isLoading: false,
  errors: {},
  setLoading: (isLoading) => set({ isLoading }),
  setErrors: (errors) => set({ errors }),
}));
