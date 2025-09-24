import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    bio?: string,
    photo?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: { pseudo?: string; bio?: string; photo?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error: any) {
          if (error.response?.status === 401) {
            console.log("Token invalide ou expiré, déconnexion");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            console.warn("Erreur non critique profil:", error);
            setUser(JSON.parse(savedUser));
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  /** ✅ signUp accepte bio et photo (base64 ou URL) */
  const signUp = async (
    email: string,
    password: string,
    username: string,
    bio?: string,
    photo?: string
  ) => {
    const { token, user } = await authService.register({
      email,
      password,
      pseudo: username,
      bio,
      photo,
    });
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const signOut = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (profileData: { pseudo?: string; bio?: string; photo?: string }) => {
    const updatedUser = await authService.updateProfile(profileData);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
