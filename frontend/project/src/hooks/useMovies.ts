import { useState, } from 'react';
import { movieService, Movie } from '../services/movieService';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await movieService.searchMovies(query);
      setMovies(results);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const getPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await movieService.getPopularMovies();
      setMovies(results);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films populaires');
    } finally {
      setLoading(false);
    }
  };

  const getTopRatedMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await movieService.getTopRatedMovies();
      setMovies(results);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films les mieux notés');
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    loading,
    error,
    searchMovies,
    getPopularMovies,
    getTopRatedMovies,
  };
};