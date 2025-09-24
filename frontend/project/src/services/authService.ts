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

export interface RegisterData {
  email: string;
  password: string;
  pseudo: string;
  bio?: string;
  photo?: File;
}

export const authService = {
  // Connexion
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    console.log('Réponse du serveur:', response.data);
    return response.data.data;
  },

  // Inscription avec support de l'upload de fichier
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const formData = new FormData();

    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('pseudo', userData.pseudo);
    if (userData.bio) formData.append('bio', userData.bio);
    if (userData.photo) formData.append('photo', userData.photo);

    const response = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
  },

  // Récupérer le profil utilisateur
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Mettre à jour le profil (pseudo, bio et photo)
  updateProfile: async (profileData: {
    pseudo?: string;
    bio?: string;
    photo?: File;
  }): Promise<User> => {
    // Si une photo est fournie, utiliser FormData pour tout envoyer
    if (profileData.photo) {
      const formData = new FormData();
      formData.append('photo', profileData.photo);

      // On envoie d'abord la photo
      const photoResponse = await api.post('/auth/me/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Puis on met à jour pseudo/bio si besoin
      if (profileData.pseudo || profileData.bio) {
        await api.put('/auth/me', {
          pseudo: profileData.pseudo,
          bio: profileData.bio
        });
      }

      return photoResponse.data.data;
    } else {
      // Si pas de photo, mise à jour normale
      const response = await api.put('/auth/me', profileData);
      return response.data.data;
    }
  },
};
