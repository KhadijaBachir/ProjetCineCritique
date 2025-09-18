
CineCritique est une plateforme web communautaire pour les cinéphiles permettant de :

Découvrir et rechercher des films via l’API TMDb

Consulter les détails d’un film (affiche, synopsis, casting, durée, genres)

Publier, modifier et supprimer ses critiques

Consulter les critiques d’autres utilisateurs

Voir les films les mieux notés par la communautéCineCritique 

CineCritique est une plateforme web communautaire pour les cinéphiles permettant de :

Découvrir et rechercher des films via l’API TMDb

Consulter les détails d’un film (affiche, synopsis, casting, durée, genres)

Publier, modifier et supprimer ses critiques

Consulter les critiques d’autres utilisateurs

Voir les films les mieux notés par la communauté


Stack technique

Frontend : React.js + TypeScript + Tailwind CSS

Backend / Services : Mongo DB, Mongoose, Express js, Node js 

API externe : TMDb API


src/
 ├─ components/      # Composants réutilisables (ex: MovieCard, ReviewForm)
 ├─ context/         # AuthContext pour gérer l'authentification
 ├─ pages/           # Pages principales de l'application
 │    ├─ Home.tsx    # Accueil avec films populaires
 │    ├─ Login.tsx
 │    ├─ Register.tsx
 │    ├─ Search.tsx
 │    ├─ MovieDetails.tsx
 │    ├─ TopRated.tsx
 │    ├─ Profile.tsx
 │    └─ MyReviews.tsx
 ├─ services/        # authService et reviewService (mock ou API)
 └─ App.tsx