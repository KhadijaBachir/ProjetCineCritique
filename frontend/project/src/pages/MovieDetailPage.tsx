import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Star, Users, MessageSquare} from 'lucide-react';
import { MovieDetails, Review } from '../types';
import { TMDbService } from '../services/tmdb';
import { reviewService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from '../components/Movies/StarRating';
import { ReviewForm } from '../components/Reviews/ReviewForm';
import { ReviewCard } from '../components/Reviews/ReviewCard';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [movieData, creditsData] = await Promise.all([
        TMDbService.getMovieDetails(Number(id)),
        TMDbService.getMovieCredits(Number(id))
      ]);

      setMovie({
        ...movieData,
        cast: creditsData.cast.slice(0, 10) // Only show first 10 cast members
      });
    } catch (err) {
      setError('Erreur lors du chargement du film');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      setReviewsLoading(true);
      const reviewsData = await reviewService.getMovieReviews(Number(id));
      setReviews(reviewsData);

      // Find user's review if logged in - CORRECTION ICI
      if (user) {
        const currentUserReview = reviewsData.find(review => 
          String(review.user_id) === String(user.id) // Conversion en string
        );
        setUserReview(currentUserReview || null);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddReview = async (rating: number, comment: string) => {
    if (!movie || !user) return;

    try {
       console.log('🔄 Tentative de création de review...');
          await reviewService.addReview(
          movie.id,
          movie.title,
          movie.poster_path,
          rating,
          comment
        );
        
        console.log('✅ Review créée avec succès');
        await fetchReviews();
        setShowReviewForm(false);
      } catch (error) {
        console.error('❌ Error adding review:', error);
        throw error;
      }
    };

  const handleUpdateReview = async (rating: number, comment: string) => {
    if (!editingReview) return;

    try {
      await reviewService.updateReview(editingReview.id, rating, comment);
      await fetchReviews();
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette critique ?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Erreur lors de la suppression de la critique');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement du film...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Film non trouvé'}</p>
        </div>
      </div>
    );
  }

  const backdropUrl = TMDbService.getBackdropUrl(movie.backdrop_path);
  const posterUrl = TMDbService.getPosterUrl(movie.poster_path);
  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {backdropUrl && (
          <div
            className="h-[60vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
          </div>
        )}

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-gray-400" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center space-x-2">
                      <Clock size={20} className="text-gray-400" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                    <span className="text-gray-400">({movie.vote_count} votes)</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                  {movie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users size={24} className="mr-2" />
                  Distribution
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      {actor.profile_path ? (
                        <img
                          src={TMDbService.getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                          <Users size={32} className="text-gray-500" />
                        </div>
                      )}
                      <h4 className="text-white font-medium text-sm">{actor.name}</h4>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MessageSquare size={24} className="mr-2" />
                  Critiques ({reviews.length})
                </h2>

                {/* Community Rating */}
                {reviews.length > 0 && (
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating rating={Math.round(averageRating)} />
                      <span className="text-white font-semibold">
                        {averageRating.toFixed(1)}/5
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Note communauté</p>
                  </div>
                )}
              </div>

              {/* Add Review Button */}
              {user && !userReview && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full mb-8 p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                >
                  + Ajouter ma critique
                </button>
              )}

              {/* User's Review */}
              {userReview && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Ma critique</h3>
                  <ReviewCard
                    review={userReview}
                    onEdit={setEditingReview}
                    onDelete={handleDeleteReview}
                  />
                </div>
              )}

              {/* Other Reviews */}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews
                    .filter(review => String(review.user_id) !== String(user?.id)) // CORRECTION ICI
                    .map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  
                  {reviews.filter(review => String(review.user_id) !== String(user?.id)).length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Aucune autre critique pour le moment</p>
                      {!user && (
                        <p className="text-gray-500 text-sm mt-2">
                          Connectez-vous pour ajouter la première critique
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date de sortie</span>
                  <span className="text-white">
                    {new Date(movie.release_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {movie.runtime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Durée</span>
                    <span className="text-white">{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Note TMDb</span>
                  <span className="text-white">{movie.vote_average.toFixed(1)}/10</span>
                </div>
                {averageRating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Note communauté</span>
                    <span className="text-white">{averageRating.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Forms */}
      {showReviewForm && (
        <ReviewForm
          movieId={movie.id}
          movieTitle={movie.title}
          moviePoster={movie.poster_path}
          onSubmit={handleAddReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {editingReview && (
        <ReviewForm
          movieId={movie.id}
          movieTitle={movie.title}
          moviePoster={movie.poster_path}
          onSubmit={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
          initialReview={editingReview}
        />
      )}
    </div>
  );
}