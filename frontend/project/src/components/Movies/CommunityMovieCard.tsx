// src/components/Movies/CommunityMovieCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../../types';

interface CommunityMovieCardProps {
  movie: Movie & {
    communityRating?: number;
    reviewCount?: number;
  };
  rank: number;
}

export function CommunityMovieCard({ movie, rank }: CommunityMovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  return (
    <div className="relative group">
      {/* Badge de classement */}
      <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
        {rank}
      </div>
      
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden mb-3 relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
        </div>
      </Link>

      <div className="space-y-2">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
        </Link>
        
        {/* Note communautaire */}
        {movie.communityRating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold text-sm">
                {movie.communityRating}/5
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              ({movie.reviewCount} critique{movie.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}