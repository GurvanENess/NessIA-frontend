import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  AppAction,
  appReducer,
  AppState,
  Company,
  initialState,
} from "../store/AppReducer";
import { db } from "../services/db";
import { handleError } from "../utils/errorHandler";
import { logger } from "../utils/logger";

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setGlobalError: (error: unknown, message: string) => void;
  clearGlobalError: () => void;
  setCurrentCompany: (company: Company) => void;
  clearCurrentCompany: () => void;
  changeCompanyAndReset: (company: Company) => void;
  updateCurrentCompany: (updates: Partial<Company>) => void;
  updateCompanyInList: (id: string, updates: Partial<Company>) => void;
  refreshCurrentCompany: (userId: string) => Promise<void>;
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
      logger.error("Failed to load current company from localStorage", error);
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
        logger.error("Failed to save current company to localStorage", error);
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

  const changeCompanyAndReset = (company: Company) => {
    dispatch({ type: "CHANGE_COMPANY_AND_RESET", payload: company });
  };

  const updateCurrentCompany = (updates: Partial<Company>) => {
    dispatch({ type: "UPDATE_CURRENT_COMPANY", payload: updates });
  };

  const updateCompanyInList = (id: string, updates: Partial<Company>) => {
    dispatch({ type: "UPDATE_COMPANY_IN_LIST", payload: { id, updates } });
  };

  const refreshCurrentCompany = async (userId: string) => {
    if (!state.currentCompany) {
      logger.warn("No current company to refresh");
      return;
    }

    try {
      // Recharger toutes les companies avec leurs plateformes
      const companies = await db.getCompaniesByUserId(userId);
      
      // Trouver la company actuelle dans la liste rechargée
      const refreshedCompany = companies.find(
        (c) => c.id === state.currentCompany?.id
      );

      if (refreshedCompany) {
        // Mettre à jour la company actuelle avec les nouvelles données
        dispatch({ type: "SET_CURRENT_COMPANY", payload: refreshedCompany });
        logger.info("Current company refreshed successfully");
      } else {
        logger.warn("Current company not found in refreshed data");
      }
    } catch (error) {
      logger.error("Failed to refresh current company", error);
      throw error;
    }
  };

  const value = {
    state,
    dispatch,
    setGlobalError,
    clearGlobalError,
    setCurrentCompany,
    clearCurrentCompany,
    changeCompanyAndReset,
    updateCurrentCompany,
    updateCompanyInList,
    refreshCurrentCompany,
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
