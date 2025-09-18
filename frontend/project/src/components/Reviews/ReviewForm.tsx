import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { StarRating } from '../Movies/StarRating';
import { Review } from '../../types';

interface ReviewFormProps {
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  initialReview?: Review;
  isLoading?: boolean;
}

export function ReviewForm({
  movieId,
  movieTitle,
  moviePoster,
  onSubmit,
  onCancel,
  initialReview,
  isLoading = false
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la soumission de la critique');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {initialReview ? 'Modifier la critique' : 'Écrire une critique'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Movie Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            {moviePoster && (
              <img
                src={`https://image.tmdb.org/t/p/w92${moviePoster}`}
                alt={movieTitle}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-white">{movieTitle}</h3>
              <p className="text-gray-400">Votre critique pour ce film</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">
              Note <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                interactive={true}
                size={32}
                showRatingText={true}
              />
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-white font-medium mb-3">
              Commentaire (optionnel)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre avis sur ce film..."
              rows={6}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-vertical"
              disabled={isSubmitting}
            />
            <p className="text-gray-400 text-sm mt-2">
              {comment.length} caractères
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting || isLoading}
              className="flex items-center space-x-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>En cours...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>
                    {initialReview ? 'Mettre à jour' : 'Publier la critique'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}