
export const communityMovieService = {
  // Récupérer les films les mieux notés par la communauté
  getTopRatedCommunityMovies: async (): Promise<any[]> => {
    try {
      // Récupérer toutes les reviews depuis localStorage
      const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      
      if (reviews.length === 0) {
        return [];
      }

      // Calculer les moyennes par film
      const movieRatings: { [key: number]: { 
        total: number; 
        count: number; 
        title: string; 
        poster: string | null;
        average: number;
      } } = {};
      
      reviews.forEach((review: any) => {
        if (!movieRatings[review.movie_id]) {
          movieRatings[review.movie_id] = {
            total: 0,
            count: 0,
            title: review.movie_title || 'Titre inconnu',
            poster: review.movie_poster || null,
            average: 0
          };
        }
        movieRatings[review.movie_id].total += review.rating;
        movieRatings[review.movie_id].count += 1;
      });
      
      // Calculer les moyennes et convertir en tableau
      const communityMovies = Object.entries(movieRatings)
        .map(([movieId, data]) => {
          const averageRating = data.total / data.count;
          return {
            id: parseInt(movieId),
            title: data.title,
            poster_path: data.poster,
            backdrop_path: null,
            overview: '',
            release_date: '',
            vote_average: 0,
            vote_count: 0,
            genre_ids: [],
            communityRating: parseFloat(averageRating.toFixed(1)),
            reviewCount: data.count
          };
        })
        .filter(movie => movie.communityRating >= 3) // Seulement les films avec note ≥ 3/5
        .sort((a, b) => b.communityRating - a.communityRating) // Trier par note décroissante
        .slice(0, 10); // Top 10

      return communityMovies;
      
    } catch (error) {
      console.error('Error fetching community top rated movies:', error);
      return [];
    }
  }
};