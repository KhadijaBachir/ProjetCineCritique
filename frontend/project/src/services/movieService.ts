import api from './api';

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  backdrop_path?: string;
  genre_ids?: number[];
  genres?: string[];
  runtime?: number;
}

export interface MoviesResponse {
  success: boolean;
  message: string;
  data: {
    results?: Movie[];
    movies?: Movie[];
    pagination?: any;
  };
}

export const movieService = {
  // Films populaires
  getPopularMovies: async (): Promise<Movie[]> => {
    try {
      const response = await api.get('/movies/popular');
      console.log('Réponse films populaires:', response.data);
      
      const data = response.data;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.data?.results)) return data.data.results;
      if (Array.isArray(data.data?.movies)) return data.data.movies;
      if (Array.isArray(data)) return data;
      
      console.warn('Structure inattendue pour films populaires:', data);
      return [];
    } catch (error) {
      console.error('Erreur getPopularMovies:', error);
      throw error;
    }
  },

  // Films les mieux notés
  getTopRatedMovies: async (): Promise<Movie[]> => {
    try {
      const response = await api.get('/movies/top-rated');
      console.log('Réponse top rated:', response.data);
      
      const data = response.data;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.data?.movies)) return data.data.movies;
      if (Array.isArray(data.data?.results)) return data.data.results;
      if (Array.isArray(data.movies)) return data.movies;
      if (Array.isArray(data)) return data;
      
      console.warn('Structure inattendue pour top rated:', data);
      return [];
    } catch (error) {
      console.error('Erreur getTopRatedMovies:', error);
      throw error;
    }
  },

  // Détails d'un film
  getMovieDetails: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`);
    return response.data.data?.movie || response.data.data || response.data;
  },

  // Recherche de films
  searchMovies: async (query: string, page: number = 1): Promise<Movie[]> => {
    const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
    const data = response.data;
    
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.results)) return data.data.results;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data)) return data;
    
    return [];
  },
};