import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  appReducer,
  initialState,
  AppState,
  AppAction,
} from "../store/AppReducer";
import { handleError } from "../utils/errorHandler";

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setGlobalError: (error: unknown, message: string) => void;
  clearGlobalError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setGlobalError = (error: unknown, message: string) => {
    const summary = handleError(error, message);
    dispatch({ type: "SET_GLOBAL_ERROR", payload: summary });
  };

  const clearGlobalError = () => dispatch({ type: "CLEAR_GLOBAL_ERROR" });

  return (
    <AppContext.Provider
      value={{ state, dispatch, setGlobalError, clearGlobalError }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
