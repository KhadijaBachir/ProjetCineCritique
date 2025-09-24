import api from './api';

export interface FavoriteMovie {
  id: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  movieReleaseDate: string;
  addedAt: string;
}

export const favoriteService = {
  // Récupérer tous les favoris de l'utilisateur
  getUserFavorites: async (): Promise<FavoriteMovie[]> => {
    const response = await api.get('/favorites');
    return response.data.data.favorites || response.data.data;
  },

  // Ajouter un film aux favoris
  addFavorite: async (movieData: {
    movieId: number;
    movieTitle: string;
    moviePoster: string | null;
    movieReleaseDate: string;
  }): Promise<FavoriteMovie> => {
    const response = await api.post('/favorites', movieData);
    return response.data.data.favorite || response.data.data;
  },

  // Supprimer un film des favoris
  removeFavorite: async (movieId: number): Promise<void> => {
    await api.delete(`/favorites/${movieId}`);
  },

  // Vérifier si un film est dans les favoris
  checkFavorite: async (movieId: number): Promise<boolean> => {
    const response = await api.get(`/favorites/check/${movieId}`);
    return response.data.data.isFavorite;
  }
};