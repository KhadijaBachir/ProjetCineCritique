import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Star, TrendingUp, Search, ArrowRight, Play, Heart } from 'lucide-react';
import { Movie } from '../types';
import { TMDbService } from '../services/tmdb';
import { MovieCard } from '../components/Movies/MovieCard';

export function HomePage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Utilisez getPopularMovies pour toutes les sections
        const popularResponse = await TMDbService.getPopularMovies();
        const popularResults = popularResponse.results;
        
        setPopularMovies(popularResults.slice(0, 8));
        
        // Pour le Top 10, triez par note
        const topRated = [...popularResults]
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 10);
        setTopRatedMovies(topRated);
        
        // Favoris des fans = films avec le plus de votes
        const favorites = [...popularResults]
          .sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, 8);
        setFavoriteMovies(favorites);

      } catch (err) {
        setError('Erreur lors du chargement des films');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleWatchTrailer = (movieTitle: string) => {
    const searchQuery = encodeURIComponent(`${movieTitle} bande annonce officielle`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section avec bande-annonce YouTube */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video YouTube embed */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/EEtcliMsTjU?autoplay=1&mute=1&loop=1&playlist=EEtcliMsTjU&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen
            title="Bande-annonce CinéCritique"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>

        {/* Hero Content par-dessus la vidéo */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Film size={48} className="text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Ciné<span className="text-yellow-400">Critique</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Découvrez, critiquez et notez vos films préférés.<br />
            Rejoignez une communauté passionnée de cinéphiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="flex items-center space-x-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors font-semibold text-lg"
            >
              <span>Rejoindre la communauté</span>
              <ArrowRight size={20} />
            </Link>
            
            <Link
              to="/top-rated"
              className="flex items-center space-x-2 border border-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              <Star size={20} />
              <span>Découvrir les top films</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Films Populaires
              </h2>
              <p className="text-xl text-gray-400">
                Les films qui font sensation en ce moment
              </p>
            </div>
            
            <Link
              to="/search"
              className="hidden md:flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <span>Voir tous les films</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
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
          )}

          <div className="md:hidden text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <span>Voir tous les films</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Top 10 Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Top 10 des mieux notés
              </h2>
              <p className="text-xl text-gray-400">
                Les films avec les meilleures notes de la communauté
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {topRatedMovies.map((movie, index) => (
                <div key={movie.id} className="relative group">
                  <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => handleWatchTrailer(movie.title)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    title="Regarder la bande-annonce"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Favoris des Fans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Heart size={32} className="text-red-400" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Favoris des Fans
                </h2>
                <p className="text-xl text-gray-400">
                  Les films les plus appréciés par notre communauté
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => handleWatchTrailer(movie.title)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    title="Regarder la bande-annonce"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    👍 {movie.vote_count?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pourquoi choisir CinéCritique ?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une plateforme complète pour tous les amoureux du cinéma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Recherche Avancée
              </h3>
              <p className="text-gray-400">
                Trouvez facilement n'importe quel film grâce à notre moteur de recherche 
                alimenté par TMDb, la plus grande base de données cinématographique.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Critiques & Notes
              </h3>
              <p className="text-gray-400">
                Partagez vos avis avec un système de notation sur 5 étoiles 
                et des commentaires détaillés pour guider la communauté.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Tendances & Classements
              </h3>
              <p className="text-gray-400">
                Découvrez les films les mieux notés par la communauté 
                et suivez les tendances du moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-300">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prêt à rejoindre notre communauté ?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Commencez dès maintenant à découvrir, noter et critiquer vos films préférés
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              Créer mon compte
            </Link>
            <Link
              to="/login"
              className="text-gray-900 px-8 py-4 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors font-semibold text-lg"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}