// src/services/supabase.ts
// Version mock avec localStorage

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    id: string;
    pseudo: string;
    photo: string;
  };
}

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
  // Ajouter une critique
  async addReview(
    movieId: number,
    movieTitle: string,
    moviePoster: string | null,
    rating: number,
    comment: string
  ): Promise<Review> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const review: Review = {
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

  // Récupérer TOUTES les critiques (NOUVELLE MÉTHODE)
  async getAllReviews(): Promise<Review[]> {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    return reviews;
  },

  // Récupérer les critiques d'un film
  async getMovieReviews(movieId: number): Promise<Review[]> {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    return reviews.filter((r: Review) => r.movie_id === movieId);
  },

  // Récupérer les critiques d'un utilisateur
  async getUserReviews(userId: string): Promise<Review[]> {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    return reviews.filter((r: Review) => r.user_id === userId);
  },

  // Mettre à jour une critique
  async updateReview(reviewId: string, rating: number, comment: string): Promise<Review> {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const index = reviews.findIndex((r: Review) => r.id === reviewId);
    if (index === -1) throw new Error("Critique introuvable");

    reviews[index] = { ...reviews[index], rating, comment };
    localStorage.setItem("reviews", JSON.stringify(reviews));
    return reviews[index];
  },

  // Supprimer une critique
  async deleteReview(reviewId: string): Promise<void> {
    let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews = reviews.filter((r: Review) => r.id !== reviewId);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }
};