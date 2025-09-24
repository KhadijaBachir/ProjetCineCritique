import { Link } from 'react-router-dom';
import { User, Calendar, Edit3, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { StarRating } from '../Movies/StarRating';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  showMovieInfo?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({ 
  review, 
  showMovieInfo = false, 
  onEdit, 
  onDelete,
  className = '' 
}: ReviewCardProps) {
  const { user } = useAuth();
  
  // Conversion EXPLICITE en string pour éviter les erreurs de type
  const isOwner = Boolean(
    user?.id !== undefined &&
    review.user_id !== undefined &&
    String(user.id) === String(review.user_id)
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {review.user_profile?.avatar_url ? (
              <img
                src={review.user_profile.avatar_url}
                alt={review.user_profile.username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="text-white font-medium">
              {review.user_profile?.username || 'Utilisateur'}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwner && (onEdit || onDelete) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-700"
                title="Modifier"
              >
                <Edit3 size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Movie Info (if showing) */}
      {showMovieInfo && (
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
          {review.movie_poster && (
            <img
              src={`https://image.tmdb.org/t/p/w92${review.movie_poster}`}
              alt={review.movie_title}
              className="w-12 h-18 object-cover rounded"
            />
          )}
          <Link
            to={`/movie/${review.movie_id}`}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {review.movie_title}
          </Link>
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={review.rating} size={18} />
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>
      )}
    </div>
  );
}