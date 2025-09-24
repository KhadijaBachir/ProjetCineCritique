export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  cast?: Cast[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  cast: Cast[];
}

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  rating: number;
  comment: string;
  created_at: string;
  user_profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}