import api from './api';

export interface User {
  id: number;
  email: string;
  pseudo: string;
  bio?: string;
  photo?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  // Connexion
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    console.log('Réponse du serveur:', response.data);
    return response.data.data;
  },


  // Inscription
  register: async (userData: {
    email: string;
    password: string;
    pseudo: string;
    bio?: string;
    photo?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  // Récupérer le profil utilisateur
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  // Mettre à jour le profil
  updateProfile: async (profileData: {
    pseudo?: string;
    bio?: string;
    photo?: string;
  }): Promise<User> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data.data;
  },
};