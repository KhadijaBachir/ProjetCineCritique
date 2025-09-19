import api from './api';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path?: string;
  genre_ids?: number[];
}

export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const backendMovieService = {
  // Films populaires
  getPopularMovies: async (page: number = 1): Promise<BackendResponse<any>> => {
    const response = await api.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Films les mieux notés
  getTopRatedMovies: async (page: number = 1, limit: number = 10): Promise<BackendResponse<any>> => {
    const response = await api.get(`/movies/top-rated?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Recherche
  searchMovies: async (query: string, page: number = 1): Promise<BackendResponse<any>> => {
    const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  // Détails film
  getMovieDetails: async (movieId: number): Promise<BackendResponse<any>> => {
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  },
};