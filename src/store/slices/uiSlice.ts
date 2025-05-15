import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentTopic: string | null;
  notifications: number;
}

const initialState: UiState = {
  sidebarOpen: true,
  currentTopic: null,
  notifications: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentTopic: (state, action: PayloadAction<string | null>) => {
      state.currentTopic = action.payload;
    },
    incrementNotifications: (state) => {
      state.notifications += 1;
    },
    clearNotifications: (state) => {
      state.notifications = 0;
    },
  },
});

export const { toggleSidebar, setCurrentTopic, incrementNotifications, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;