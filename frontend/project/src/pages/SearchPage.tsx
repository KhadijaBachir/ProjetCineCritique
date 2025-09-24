import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Heart, Play } from 'lucide-react';
import { Movie, Genre } from '../types';
import { TMDbService } from '../services/tmdb';
import { MovieCard } from '../components/Movies/MovieCard';

// Type pour les options de tri
type SortOption = 'popularity' | 'rating' | 'date';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await TMDbService.getGenres();
        setGenres(response.genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery !== query) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await TMDbService.searchMovies(searchTerm);
      let results = response.results;

      if (selectedGenres.length > 0) {
        results = results.filter((movie: Movie) =>
          movie.genre_ids.some((genreId) => selectedGenres.includes(genreId))
        );
      }

      switch (sortBy) {
        case 'rating':
          results.sort((a: Movie, b: Movie) => (b.vote_average || 0) - (a.vote_average || 0));
          break;
        case 'date':
          results.sort((a: Movie, b: Movie) => {
            const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
            const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
            return dateB - dateA;
          });
          break;
        default:
          results.sort((a: Movie, b: Movie) => (b.vote_count || 0) - (a.vote_count || 0));
      }

      setMovies(results);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      handleSearch();
    }
  };

  const toggleGenre = (genreId: number) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(newSelectedGenres);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity');
  };

  const getGenreName = (genreId: number) => {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : '';
  };

  useEffect(() => {
    if (query.trim()) {
      handleSearch();
    }
  }, [selectedGenres, sortBy]);

  const handleAddReview = (movieId: number) => {
    window.location.href = `/movie/${movieId}`;
  };

  const handleWatchTrailer = (movieTitle: string) => {
    const searchQuery = encodeURIComponent(`${movieTitle} bande annonce officielle`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recherche de films</h1>
          <p className="text-gray-400">Découvrez votre prochain film coup de cœur</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un film par titre..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Filter size={20} />
              <span>Filtres</span>
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filtres</h3>
              <button onClick={clearFilters} className="text-red-400 hover:text-red-300 text-sm">
                Effacer tout
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="popularity">Popularité (nombre de votes)</option>
                <option value="rating">Note moyenne</option>
                <option value="date">Date de sortie</option>
              </select>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {selectedGenres.length > 0 && (
          <div className="mb-6 flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Filtres actifs:</span>
            {selectedGenres.map((genreId) => (
              <span
                key={genreId}
                className="inline-flex items-center space-x-1 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm"
              >
                <span>{getGenreName(genreId)}</span>
                <button
                  type="button"
                  onClick={() => toggleGenre(genreId)}
                  className="hover:bg-yellow-300 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative group bg-gray-800 rounded-lg overflow-hidden flex flex-col"
              >
                <MovieCard movie={movie} />
                <div className="flex justify-between items-center px-3 mt-2 text-sm text-gray-300">
                  <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span>
                    <Heart size={14} className="inline mb-0.5 text-red-400 mr-1" />
                    {movie.vote_count || 0}
                  </span>
                </div>
                <div className="p-3 mt-auto">
                  <button
                    onClick={() => handleAddReview(movie.id)}
                    className="w-full bg-yellow-400 text-gray-900 py-2 px-3 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Faire une critique
                  </button>
                </div>
                <button
                  onClick={() => handleWatchTrailer(movie.title)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  title="Regarder la bande-annonce"
                >
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun film trouvé pour "{query}"</p>
            <p className="text-gray-500 text-sm mt-2">
              Essayez avec un autre terme de recherche
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Utilisez la barre de recherche pour trouver des films</p>
          </div>
        )}
      </div>
    </div>
  );
}
