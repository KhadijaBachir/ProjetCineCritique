import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
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

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        
        // Vérifier si le token est toujours valide
        authService.getProfile()
          .then(userData => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          })
          .catch(() => {
            // Token invalide, déconnecter l'utilisateur
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Début de signIn');
      const { token, user } = await authService.login(email, password);
      console.log('Reçu du serveur - Token:', token);
      console.log('Reçu du serveur - User:', user);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('Storage après connexion - Token:', localStorage.getItem('authToken'));
      console.log('Storage après connexion - User:', localStorage.getItem('user'));
      
    } catch (error: any) {
      console.error('Erreur dans signIn:', error);
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Erreur lors de la connexion');
    }
  };
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { token, user } = await authService.register({ email, password, pseudo: username });
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Erreur lors de l\'inscription');
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (profileData: { pseudo?: string; bio?: string; photo?: string }) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Erreur lors de la mise à jour du profil');
    }
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