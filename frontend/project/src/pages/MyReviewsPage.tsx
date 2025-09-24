import { useEffect, useState } from 'react';
import { MessageSquare, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Review } from '../types';
import { reviewService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ReviewCard } from '../components/Reviews/ReviewCard';
import { ReviewForm } from '../components/Reviews/ReviewForm';

export function MyReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  useEffect(() => {
    if (user) fetchUserReviews();
  }, [user]);

  const fetchUserReviews = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userReviews = await reviewService.getUserReviews(user.id);
      setReviews(userReviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err);
      setError('Erreur lors du chargement de vos critiques');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (rating: number, comment: string) => {
    if (!editingReview) return;
    try {
      await reviewService.updateReview(editingReview.id, rating, comment);
      await fetchUserReviews();
      setEditingReview(null);
    } catch (err) {
      console.error('Error updating review:', err);
      throw err;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette critique ?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      await fetchUserReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Erreur lors de la suppression de la critique');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return sortBy === 'rating'
      ? b.rating - a.rating
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare size={64} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès requis</h1>
          <p className="text-gray-400 mb-6">
            Vous devez être connecté pour voir vos critiques
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center relative">
          <img
            src="/images/my-reviews-banner.jpg"
            alt="Cinéma"
            className="mx-auto w-48 h-auto rounded-lg mb-4 shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex items-center space-x-3 mb-4 justify-center">
            <MessageSquare size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Mes Critiques</h1>
          </div>
          <p className="text-gray-400">
            Gérez toutes vos critiques de films en un seul endroit
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-18 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">{reviews.length}</div>
                <div className="text-gray-400">
                  Critique{reviews.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {getAverageRating().toFixed(1)}
                </div>
                <div className="text-gray-400">Note moyenne</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {new Set(reviews.map(r => r.movie_id)).size}
                </div>
                <div className="text-gray-400">Films notés</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Vos critiques ({reviews.length})
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="date">Trier par date</option>
                <option value="rating">Trier par note</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showMovieInfo
                  onEdit={setEditingReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Film size={64} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">
              Aucune critique pour le moment
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Commencez à explorer notre catalogue de films et partagez vos premières impressions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
              >
                Rechercher des films
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Films populaires
              </Link>
            </div>
          </div>
        )}

        {/* Edit Review Form */}
        {editingReview && (
          <ReviewForm
            movieId={editingReview.movie_id}
            movieTitle={editingReview.movie_title || 'Film'}
            moviePoster={editingReview.movie_poster || ''}
            onSubmit={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
            initialReview={editingReview}
          />
        )}
      </div>
    </div>
  );
}
