import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { FormDataType } from "../types/types";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (formData: FormDataType) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mets en place la session utilisateur au premier chargement

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata.name ||
            session.user.email!.split("@")[0],
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    console.log("User: ", user);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // A refacto: le signup ne devrait pas être dans le module d'authentification
  const signup = async ({
    email,
    password,
    username,
  }: FormDataType): Promise<any> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        throw new Error(error.message || "Signup failed. Please try again.");
      }

      return { success: true, data };
    } catch (err) {
      // Tu peux loguer l'erreur ou l'envoyer à un outil comme Sentry
      console.error("Unexpected signup error:", err);
      throw err instanceof Error
        ? err
        : new Error("An unknown error occurred during signup.");
    }
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, simulate a successful login
    // In a real app, you would make an API call here
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw new Error(error.message || "Login failed. Please try again.");
      }

      console.log(data.user.user_metadata);
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata.display_name ||
            data.user.email!.split("@")[0],
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    try {
      const { error } = supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        throw new Error(error.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
