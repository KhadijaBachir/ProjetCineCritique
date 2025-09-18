import React, { useState } from "react";
import { Edit3, User, Camera, Heart } from "lucide-react";

export function ProfilePage() {
  const [username, setUsername] = useState("MonPseudo");
  const [bio, setBio] = useState(
    "Cinéphile passionné 🎬 | Toujours à la recherche du prochain chef-d'œuvre."
  );
  const [photo, setPhoto] = useState<string | null>(
    "https://i.pravatar.cc/150?img=3" // Avatar par défaut
  );

  const [isEditing, setIsEditing] = useState(false);

  // Historique fictif de films aimés (plus tard tu pourras remplacer par Firestore ou API)
  const [likedMovies] = useState([
    { id: 1, title: "Inception", year: 2010 },
    { id: 2, title: "Interstellar", year: 2014 },
    { id: 3, title: "The Dark Knight", year: 2008 },
    { id: 4, title: "Avatar", year: 2009 },
  ]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Ici tu pourrais sauvegarder dans Firebase ou ton backend
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header qui prend toute la largeur */}
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
        {/* Photo de profil en overlap */}
        <div className="relative -mt-20 flex flex-col items-center">
          <div className="relative group">
            {photo ? (
              <img
                src={photo}
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

          {/* Nom utilisateur */}
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-4 px-3 py-2 rounded-lg bg-gray-800 text-white text-center border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          ) : (
            <h1 className="mt-4 text-3xl font-bold text-white">{username}</h1>
          )}
        </div>

        {/* Section Bio */}
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-28 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          ) : (
            <p className="text-gray-300">{bio}</p>
          )}
        </div>

        {/* Historique des films aimés */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="text-red-400" size={22} />
            <h2 className="text-xl font-semibold text-white">
              Films que j'ai aimés
            </h2>
          </div>
          <ul className="space-y-3">
            {likedMovies.map((movie) => (
              <li
                key={movie.id}
                className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-md hover:bg-gray-600 transition"
              >
                <span className="text-white font-medium">{movie.title}</span>
                <span className="text-gray-400 text-sm">({movie.year})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
