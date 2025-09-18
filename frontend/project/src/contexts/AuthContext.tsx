import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/supabase"; // le mock que nous avons créé

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const loggedInUser = await authService.signIn(email, password);
      setUser(loggedInUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const newUser = await authService.signUp(email, password, username);
      setUser(newUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
