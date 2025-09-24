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
  // Vérifier si l'URL Cloudinary est valide (pas d'avatar par défaut)
  isValidPhoto: (photoUrl: string | undefined): boolean => {
    if (!photoUrl) return false;
    return photoUrl.includes('cloudinary.com') && 
           !photoUrl.includes('default_profile') &&
           photoUrl.includes('/image/upload/');
  },

  // Connexion - Garder seulement les URLs valides
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    console.log('Réponse du serveur:', response.data);
    
    const user = response.data.data.user;
    
    // Si l'URL est invalide, on la supprime (pas d'avatar de remplacement)
    if (!authService.isValidPhoto(user.photo)) {
      user.photo = undefined;
    }
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  },

  // Inscription avec upload de photo
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const formData = new FormData();

    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('pseudo', userData.pseudo);
    if (userData.bio) formData.append('bio', userData.bio);
    if (userData.photo) {
      formData.append('photo', userData.photo);
    }

    const response = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const user = response.data.data.user;
    
    // Vérifier la validité de la photo
    if (!authService.isValidPhoto(user.photo)) {
      user.photo = undefined;
    }

    return response.data.data;
  },

  // Récupérer le profil utilisateur
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    const user = response.data.data;
    
    // Vérifier la validité de la photo
    if (!authService.isValidPhoto(user.photo)) {
      user.photo = undefined;
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Mettre à jour le profil
  updateProfile: async (profileData: {
    pseudo?: string;
    bio?: string;
    photo?: File;
  }): Promise<User> => {
    if (profileData.photo) {
      const formData = new FormData();
      formData.append('photo', profileData.photo);

      const photoResponse = await api.post('/auth/me/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (profileData.pseudo || profileData.bio) {
        await api.put('/auth/me', {
          pseudo: profileData.pseudo,
          bio: profileData.bio
        });
      }

      const user = photoResponse.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } else {
      const response = await api.put('/auth/me', profileData);
      const user = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  },

  // Déconnexion
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Vérifier si authentifié
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};