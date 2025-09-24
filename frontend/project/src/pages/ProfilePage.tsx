import React, { useEffect, useState } from "react";
import { Edit3, User, Camera, Heart } from "lucide-react";
import { authService, User as UserType } from "../services/authService";
import { reviewService } from "../services/supabase";

interface LikedMovie {
  id: string | number;
  title: string;
  year?: number;
  likedAt: string; // date de la critique
}

export function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchProfileAndLikes() {
      try {
        const profile = await authService.getProfile();
        setUser(profile);

        const reviews = await reviewService.getUserReviews(profile.id);

        // Filtrer critiques positives et supprimer doublons en gardant la plus récente
        const movieMap = new Map<string | number, LikedMovie>();
        reviews
          .filter(r => r.rating >= 3)
          .forEach(r => {
            const existing = movieMap.get(r.movie_id);
            const likedAt = r.created_at;
            if (!existing || new Date(likedAt) > new Date(existing.likedAt)) {
              movieMap.set(r.movie_id, {
                id: r.movie_id,
                title: r.movie_title,
                year: r.movie_year,
                likedAt,
              });
            }
          });

        const uniqueMovies = Array.from(movieMap.values()).sort(
          (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
        );

        setLikedMovies(uniqueMovies);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfileAndLikes();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setUser(prev =>
        prev ? { ...prev, photo: URL.createObjectURL(file) } : prev
      );
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await authService.updateProfile({
        pseudo: user.pseudo,
        bio: user.bio,
        photo: photoFile || undefined,
      });
      setIsEditing(false);
      setPhotoFile(null);
      const updatedProfile = await authService.getProfile();
      setUser(updatedProfile);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Chargement...</div>;

  // Afficher seulement les 5 premiers si showAll=false
  const moviesToShow = showAll ? likedMovies : likedMovies.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div
        className="relative h-64 w-full"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/19972739/pexels-photo-19972739.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Photo de profil */}
        <div className="relative -mt-20 flex flex-col items-center">
          <div className="relative group">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profil"
                className="w-36 h-36 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-700 border-4 border-yellow-400 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full cursor-pointer hover:bg-yellow-300 transition">
              <Camera size={18} className="text-gray-900" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Pseudo */}
          {isEditing ? (
            <input
              type="text"
              value={user.pseudo}
              onChange={(e) =>
                setUser(prev => (prev ? { ...prev, pseudo: e.target.value } : prev))
              }
              className="mt-4 px-3 py-2 rounded-lg bg-gray-800 text-white text-center border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          ) : (
            <h1 className="mt-4 text-3xl font-bold text-white">{user.pseudo}</h1>
          )}
        </div>

        {/* Bio */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Ma bio</h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition font-medium"
            >
              <Edit3 size={18} />
              <span>{isEditing ? "Enregistrer" : "Modifier"}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={user.bio || ""}
              onChange={(e) =>
                setUser(prev => (prev ? { ...prev, bio: e.target.value } : prev))
              }
              className="w-full h-28 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          ) : (
            <p className="text-gray-300">{user.bio}</p>
          )}
        </div>

        {/* Films aimés */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="text-red-400" size={22} />
            <h2 className="text-xl font-semibold text-white">
              Films que j'ai aimés
            </h2>
          </div>

          {likedMovies.length > 0 ? (
            <>
              <ul className="space-y-3">
                {moviesToShow.map(movie => (
                  <li
                    key={movie.id}
                    className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-md hover:bg-gray-600 transition"
                  >
                    <span className="text-white font-medium">{movie.title}</span>
                    {movie.year && <span className="text-gray-400 text-sm">({movie.year})</span>}
                  </li>
                ))}
              </ul>
              {likedMovies.length > 5 && (
                <button
                  className="mt-3 text-yellow-400 font-medium hover:underline"
                  onClick={() => setShowAll(prev => !prev)}
                >
                  {showAll ? "Voir moins" : `Voir plus (${likedMovies.length - 5})`}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-400">Vous n'avez pas encore posté de critiques positives.</p>
          )}
        </div>
      </div>
    </div>
  );
}
