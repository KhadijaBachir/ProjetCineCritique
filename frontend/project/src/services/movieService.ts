import api from './api';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  genres: string[];
  cast: any[];
  director: string;
  average_rating: number;
  review_count: number;
}

export interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: string;
  username: string;
  avatar_url: string;
}

export const movieService = {
  // Rechercher des films
  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Récupérer les détails d'un film
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  },

  // Récupérer les films populaires
  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await api.get('/movies/popular');
    return response.data;
  },

  // Récupérer les films les mieux notés
  getTopRatedMovies: async (): Promise<Movie[]> => {
    const response = await api.get('/movies/top-rated');
    return response.data;
  },
};