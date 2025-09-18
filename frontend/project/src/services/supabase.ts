// src/services/supabase.ts
// Version mock sans Supabase

export const authService = {
  async signUp(email: string, password: string, username: string) {
    const newUser = { id: Date.now().toString(), email, username };
    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  },

  async signIn(email: string, password: string) {
    const stored = localStorage.getItem("user");
    if (stored) {
      return JSON.parse(stored);
    }
    throw new Error("Utilisateur non trouvé");
  },

  async signOut() {
    localStorage.removeItem("user");
  },

  async getCurrentUser() {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }
};

export const reviewService = {
  async addReview(
    movieId: number,
    movieTitle: string,
    moviePoster: string | null,
    rating: number,
    comment: string
  ) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const review = {
      id: Date.now().toString(),
      user_id: user.id,
      movie_id: movieId,
      movie_title: movieTitle,
      movie_poster: moviePoster,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.push(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    return review;
  },

  async getMovieReviews(movieId: number) {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    return reviews.filter((r: any) => r.movie_id === movieId);
  },

  async getUserReviews(userId: string) {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    return reviews.filter((r: any) => r.user_id === userId);
  },

  async updateReview(reviewId: string, rating: number, comment: string) {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const index = reviews.findIndex((r: any) => r.id === reviewId);
    if (index === -1) throw new Error("Critique introuvable");

    reviews[index] = { ...reviews[index], rating, comment };
    localStorage.setItem("reviews", JSON.stringify(reviews));
    return reviews[index];
  },

  async deleteReview(reviewId: string) {
    let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews = reviews.filter((r: any) => r.id !== reviewId);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }
};
