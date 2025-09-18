import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, PlayCircle } from 'lucide-react';
import { Movie } from '../../types';
import { TMDbService } from '../../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  showYear?: boolean;
  className?: string;
}

export function MovieCard({ movie, showYear = true, className = '' }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const posterUrl = TMDbService.getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real application, you would fetch the trailer URL here
    // For this example, we'll just open a placeholder YouTube search link
    const placeholderTrailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}+bande-annonce`;
    window.open(placeholderTrailerUrl, '_blank');
  };

  return (
    <div
      className={`relative group block bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`}>
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Pas d'affiche</span>
            </div>
          )}
          
          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-80 rounded-full p-2">
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span className="text-xs text-white font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Trailer Button Overlay */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleTrailerClick}
              className="p-4 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"
              aria-label="Regarder la bande-annonce"
            >
              <PlayCircle size={48} className="text-gray-900" />
            </button>
            <span className="text-white text-sm font-semibold mt-2 text-center">
              Cliquez pour regarder la bande-annonce
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
            {movie.title}
          </h3>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            {showYear && releaseYear && (
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{releaseYear}</span>
              </div>
            )}
            
            {movie.runtime && (
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{movie.runtime} min</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}