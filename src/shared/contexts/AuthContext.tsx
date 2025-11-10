import React, { createContext, useContext, useEffect, useState } from "react";
import { supabaseClient } from "../services/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserName: (name: string) => Promise<any>;
  updateUserEmail: (email: string) => Promise<any>;
  updateUserPassword: (password: string) => Promise<any>;
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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata.name ||
            session.user.email!.split("@")[0],
          token: session.access_token,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        token: data.session?.access_token,
        name:
          data.user.user_metadata.display_name ||
          data.user.email!.split("@")[0],
      });
    }
  };

  const updateUserName = async (name: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      data: { name: name },
    });
if (error) throw error;
    return data;
  };

  const updateUserEmail = async (email: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      email,
    });
if (error) throw error;
    return data;
  };

  const updateUserPassword = async (password: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      password,
    });
if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
