const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;  
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export class TMDbService {
  private static async fetchFromTMDb(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'fr-FR');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }
    return response.json();
  }

  static async getPopularMovies(page: number = 1) {
    return this.fetchFromTMDb('/movie/popular', { page: page.toString() });
  }

  static async getTopRatedMovies(page: number = 1) {
    return this.fetchFromTMDb('/movie/top_rated', { page: page.toString() });
  }

  static async searchMovies(query: string, page: number = 1) {
    return this.fetchFromTMDb('/search/movie', { 
      query,
      page: page.toString()
    });
  }

  static async getMovieDetails(movieId: number) {
    return this.fetchFromTMDb(`/movie/${movieId}`);
  }

  static async getMovieCredits(movieId: number) {
    return this.fetchFromTMDb(`/movie/${movieId}/credits`);
  }

  static async getGenres() {
    return this.fetchFromTMDb('/genre/movie/list');
  }

  static getImageUrl(path: string | null, size: string = 'w500') {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  static getPosterUrl(path: string | null) {
    return this.getImageUrl(path, 'w500');
  }

  static getBackdropUrl(path: string | null) {
    return this.getImageUrl(path, 'w1280');
  }
}
