import api from './api';

export interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  movie_title?: string;
  movie_poster?: string;
}

export const reviewService = {
  // Créer une critique
  createReview: async (reviewData: {
    movie_id: number;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Récupérer les critiques d'un film
  getMovieReviews: async (movieId: number): Promise<Review[]> => {
    const response = await api.get(`/reviews/movie/${movieId}`);
    return response.data;
  },

  // Récupérer les critiques d'un utilisateur
  getUserReviews: async (userId: number): Promise<Review[]> => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Mettre à jour une critique
  updateReview: async (reviewId: number, reviewData: {
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Supprimer une critique
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};