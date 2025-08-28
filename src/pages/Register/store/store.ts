import { create } from 'zustand';
import { RegisterErrors } from '../entities/entities';

interface RegisterStore {
  isLoading: boolean;
  errors: RegisterErrors;
  setLoading: (isLoading: boolean) => void;
  setErrors: (errors: RegisterErrors) => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  isLoading: false,
  errors: {},
  setLoading: (isLoading) => set({ isLoading }),
  setErrors: (errors) => set({ errors }),
}));
