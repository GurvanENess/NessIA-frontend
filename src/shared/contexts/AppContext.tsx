import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  appReducer,
  initialState,
  AppState,
  AppAction,
  Company,
} from "../store/AppReducer";
import { handleError } from "../utils/errorHandler";

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setGlobalError: (error: unknown, message: string) => void;
  clearGlobalError: () => void;
  setCurrentCompany: (company: Company) => void;
  clearCurrentCompany: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage key
const CURRENT_COMPANY_KEY = "nessia_current_company";

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load current company from localStorage on mount
  useEffect(() => {
    try {
      const savedCompany = localStorage.getItem(CURRENT_COMPANY_KEY);
      if (savedCompany) {
        const company = JSON.parse(savedCompany);
        dispatch({ type: "SET_CURRENT_COMPANY", payload: company });
      }
    } catch (error) {
      console.error("Failed to load current company from localStorage:", error);
    }
  }, []);

  // Save current company to localStorage when it changes
  useEffect(() => {
    if (state.currentCompany) {
      try {
        localStorage.setItem(
          CURRENT_COMPANY_KEY,
          JSON.stringify(state.currentCompany)
        );
      } catch (error) {
        console.error("Failed to save current company to localStorage:", error);
      }
    } else {
      localStorage.removeItem(CURRENT_COMPANY_KEY);
    }
  }, [state.currentCompany]);

  const setGlobalError = (error: unknown, message: string) => {
    const summary = handleError(error, message);
    dispatch({ type: "SET_GLOBAL_ERROR", payload: summary });
  };

  const clearGlobalError = () => dispatch({ type: "CLEAR_GLOBAL_ERROR" });

  const setCurrentCompany = (company: Company) => {
    dispatch({ type: "SET_CURRENT_COMPANY", payload: company });
  };

  const clearCurrentCompany = () => {
    dispatch({ type: "CLEAR_CURRENT_COMPANY" });
  };

  const value = {
    state,
    dispatch,
    setGlobalError,
    clearGlobalError,
    setCurrentCompany,
    clearCurrentCompany,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
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
