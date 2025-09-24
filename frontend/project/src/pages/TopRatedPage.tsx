import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { Movie, Review } from '../types';
import { TMDbService } from '../services/tmdb';
import { reviewService } from '../services/supabase';
import { MovieCard } from '../components/Movies/MovieCard';

interface MovieWithCommunityRating extends Movie {
  communityRating?: number;
  reviewCount?: number;
}

export function TopRatedPage() {
  const [tmdbTopRated, setTmdbTopRated] = useState<Movie[]>([]);
  const [communityTopRated, setCommunityTopRated] = useState<MovieWithCommunityRating[]>([]);
  const [activeTab, setActiveTab] = useState<'tmdb' | 'community'>('tmdb');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopRatedMovies();
  }, []);

  const fetchTopRatedMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // --- Films les mieux notés TMDb ---
      const tmdbResponse = await TMDbService.getTopRatedMovies(1);
      const sortedTmdbMovies = tmdbResponse.results
        .filter((movie: Movie) => movie.vote_average >= 7.0)
        .sort((a: Movie, b: Movie) => b.vote_average - a.vote_average)
        .slice(0, 20);
      setTmdbTopRated(sortedTmdbMovies);

      // --- Films les mieux notés par la communauté ---
      const allReviews = await reviewService.getAllReviews();
      const movieRatings: Record<
        number,
        { total: number; count: number; title: string; poster: string | null }
      > = {};

      allReviews.forEach((review: Review) => {
        if (!movieRatings[review.movie_id]) {
          movieRatings[review.movie_id] = {
            total: 0,
            count: 0,
            title: review.movie_title,
            poster: review.movie_poster,
          };
        }
        movieRatings[review.movie_id].total += review.rating;
        movieRatings[review.movie_id].count += 1;
      });

      const communityMovies: MovieWithCommunityRating[] = Object.entries(movieRatings)
        .map(([movieId, data]) => {
          const average = data.total / data.count;
          return {
            id: parseInt(movieId),
            title: data.title,
            poster_path: data.poster || '',
            backdrop_path: null,
            overview: '',
            release_date: '',
            vote_average: 0,
            vote_count: 0,
            genre_ids: [],
            communityRating: average,
            reviewCount: data.count,
          };
        })
        .filter((m) => (m.communityRating ?? 0) >= 3)
        .sort((a, b) => (b.communityRating ?? 0) - (a.communityRating ?? 0))
        .slice(0, 20);

      setCommunityTopRated(communityMovies);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des films : ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (movieId: number) => {
    window.location.href = `/movie/${movieId}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* ---------- Header ---------- */}
      <div
        className="relative w-full h-64 flex flex-col justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center space-x-3 mb-4">
          <Trophy size={40} className="text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Films les mieux notés</h1>
        </div>
        <p className="relative z-10 text-xl text-gray-200 text-center max-w-2xl mx-auto">
          Découvrez les films qui ont marqué les spectateurs et la critique
        </p>
      </div>

      {/* ---------- Tabs ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('tmdb')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'tmdb'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star size={20} />
              <span>Note TMDb</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={20} />
              <span>Note Communauté</span>
            </button>
          </div>
        </div>

        {/* ---------- Contenu ---------- */}
        {loading ? (
          // Skeleton de chargement
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
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
        ) : (
          <>
            {/* ----- TMDb ----- */}
            {activeTab === 'tmdb' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Films les mieux notés sur TMDb
                </h2>
                <p className="text-gray-400 mb-6">
                  {tmdbTopRated.length} films avec une note ≥ 7.0/10
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {tmdbTopRated.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="relative group bg-gray-800 rounded-lg overflow-hidden flex flex-col"
                    >
                      <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <MovieCard movie={movie} />
                      <div className="p-3 mt-auto">
                        <button
                          onClick={() => handleAddReview(movie.id)}
                          className="w-full bg-yellow-400 text-gray-900 py-2 px-3 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
                        >
                          Faire une critique
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----- Communauté ----- */}
            {activeTab === 'community' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Films les mieux notés par la communauté
                </h2>
                <p className="text-gray-400 mb-6">
                  Basé sur les critiques des utilisateurs (note ≥ 3/5)
                </p>

                {communityTopRated.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {communityTopRated.map((movie, index) => (
                      <div
                        key={movie.id}
                        className="relative group bg-gray-800 rounded-lg overflow-hidden flex flex-col"
                      >
                        <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <MovieCard movie={movie} />
                        {movie.communityRating && (
                          <div className="px-3 pb-2 text-center">
                            <div className="text-yellow-400 font-semibold">
                              {movie.communityRating.toFixed(1)}/5
                            </div>
                            <div className="text-xs text-gray-500">
                              {movie.reviewCount} critique
                              {movie.reviewCount && movie.reviewCount > 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <TrendingUp size={64} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Aucune note communautaire pour le moment
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Soyez parmi les premiers à noter des films !
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/search"
                        className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                      >
                        Rechercher des films
                      </Link>
                      <Link
                        to="/register"
                        className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Créer un compte
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ---------- Info Box ---------- */}
        <div className="mt-16 bg-gray-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Comment fonctionne le classement ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Note TMDb</h4>
              <p className="text-sm text-gray-400">
                Basée sur les votes de millions d'utilisateurs de The Movie Database.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Note Communauté</h4>
              <p className="text-sm text-gray-400">
                Basée sur les critiques laissées par les membres de CinéCritique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
