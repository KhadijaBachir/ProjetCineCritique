import React, { useEffect, useState } from "react";
import { Edit3, User, Camera, Heart, Save, X } from "lucide-react";
import { authService, User as UserType } from "../services/authService";
import { reviewService } from "../services/supabase";

interface LikedMovie {
  id: string | number;
  title: string;
  year?: number;
  likedAt: string;
}

type EditMode = 'none' | 'info' | 'photo';

export function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [tempBio, setTempBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setUser(profile);
      setTempBio(profile.bio || "");

      // RÉCUPÉRATION DES FILMS NOTÉS POSITIVEMENT
      const reviews = await reviewService.getUserReviews(profile.id);
      processLikedMovies(reviews);
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
    } finally {
      setLoading(false);
    }
  };

  const processLikedMovies = (reviews: any[]) => {
    const movieMap = new Map<string | number, LikedMovie>();
    
    // Filtrer seulement les critiques avec rating >= 3
    reviews
      .filter(review => review.rating >= 3) // ✅ CRITIQUE POSITIVE
      .forEach(review => {
        const existing = movieMap.get(review.movie_id);
        const likedAt = review.created_at;
        
        // Garder la critique la plus récente pour chaque film
        if (!existing || new Date(likedAt) > new Date(existing.likedAt)) {
          movieMap.set(review.movie_id, {
            id: review.movie_id,
            title: review.movie_title,
            year: review.movie_year,
            likedAt: likedAt,
          });
        }
      });

    // Trier par date (plus récent en premier)
    const uniqueMovies = Array.from(movieMap.values()).sort(
      (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
    );

    setLikedMovies(uniqueMovies);
    console.log('Films aimés:', uniqueMovies); // Debug
  };

  const startEditInfo = () => {
    setEditMode('info');
  };

  const startEditPhoto = () => {
    setEditMode('photo');
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const cancelEdit = () => {
    setEditMode('none');
    setTempBio(user?.bio || "");
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image doit faire moins de 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const saveProfileInfo = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile({
        bio: tempBio
      });
      
      setUser(updatedUser);
      setEditMode('none');
    } catch (error) {
      console.error('Erreur sauvegarde bio:', error);
      alert('Erreur lors de la sauvegarde de la bio');
    } finally {
      setLoading(false);
    }
  };

  const saveProfilePhoto = async () => {
    if (!photoFile || !user) return;

    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile({
        photo: photoFile
      });
      
      setUser(updatedUser);
      setEditMode('none');
      setPhotoFile(null);
      setPhotoPreview(null);
      
      await loadProfileData();
    } catch (error) {
      console.error('Erreur upload photo:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Erreur lors du chargement du profil</div>
      </div>
    );
  }

  const moviesToShow = showAll ? likedMovies : likedMovies.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 pb-12">
      {/* PHOTO DE COUVERTURE RÉTABLIE */}
      <div
        className="relative h-64 w-full"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/19972739/pexels-photo-19972739.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32">
        {/* Carte profil principale */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Section photo + infos */}
          <div className="md:flex">
            {/* Photo de profil */}
            <div className="md:w-1/3 p-8 bg-gray-900 flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full border-4 border-yellow-400 bg-gray-800 overflow-hidden shadow-lg flex items-center justify-center">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={`Profil de ${user.pseudo}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Erreur chargement photo:', user.photo);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <User size={64} />
                      <span className="text-sm mt-2 text-center">Aucune photo</span>
                    </div>
                  )}
                </div>
                
                {/* Bouton photo simplifié */}
                {editMode === 'photo' ? (
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <button
                      onClick={saveProfilePhoto}
                      disabled={!photoFile || loading}
                      className="p-3 bg-green-500 rounded-full hover:bg-green-400 transition disabled:opacity-50 shadow-lg"
                      title="Sauvegarder la photo"
                    >
                      <Save size={20} className="text-white" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-3 bg-red-500 rounded-full hover:bg-red-400 transition shadow-lg"
                      title="Annuler"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startEditPhoto}
                    className="absolute bottom-2 right-2 p-3 bg-yellow-400 rounded-full hover:bg-yellow-300 transition shadow-lg"
                    title="Changer la photo"
                  >
                    <Camera size={20} className="text-gray-900" />
                  </button>
                )}
              </div>

              {/* Zone upload photo */}
              {editMode === 'photo' && (
                <div className="mt-6 w-full bg-gray-800 p-4 rounded-lg border-2 border-yellow-400">
                  <p className="text-yellow-400 font-semibold text-center mb-3">Changer la photo de profil</p>
                  
                  <label className="flex flex-col items-center justify-center space-y-2 p-4 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition cursor-pointer border-2 border-dashed border-yellow-500">
                    <Camera size={24} />
                    <span className="font-medium">Choisir une photo</span>
                    <span className="text-sm opacity-80">JPG, PNG - Max 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>
                  
                  {photoPreview && (
                    <div className="mt-4 text-center">
                      <p className="text-green-400 font-medium mb-2">✅ Aperçu de la nouvelle photo :</p>
                      <img 
                        src={photoPreview} 
                        alt="Aperçu" 
                        className="mx-auto w-32 h-32 rounded-full object-cover border-2 border-green-400 shadow-lg" 
                      />
                      <p className="text-gray-300 text-sm mt-2">Cliquez sur ✓ pour sauvegarder</p>
                    </div>
                  )}
                  
                  {!photoPreview && (
                    <p className="text-gray-400 text-sm mt-3 text-center">
                      Sélectionnez une image pour voir l'aperçu
                    </p>
                  )}
                </div>
              )}

              <h1 className="mt-6 text-2xl font-bold text-white text-center">
                {user.pseudo}
              </h1>
              
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
              <p className="text-gray-500 text-xs mt-2">
                Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Bio et actions */}
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Ma bio</h2>
                
                {editMode === 'info' ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveProfileInfo}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Sauvegarder</span>
                    </button>
                  </div>
                ) : editMode === 'none' ? (
                  <button
                    onClick={startEditInfo}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition"
                  >
                    <Edit3 size={16} />
                    <span>Modifier la bio</span>
                  </button>
                ) : null}
              </div>

              {editMode === 'info' ? (
                <div className="space-y-3">
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Parlez un peu de vous..."
                    className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 resize-none"
                    maxLength={500}
                  />
                  <p className="text-gray-400 text-sm">
                    {tempBio.length}/500 caractères
                  </p>
                </div>
              ) : (
                <div className="min-h-[120px] bg-gray-700 p-4 rounded-lg">
                  {user.bio ? (
                    <p className="text-gray-300 whitespace-pre-wrap">{user.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">
                      Aucune bio pour le moment... Cliquez sur "Modifier la bio" pour en ajouter une.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Films aimés - SECTION CORRIGÉE */}
          <div className="border-t border-gray-700 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="text-red-400" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Films que j'ai aimés ({likedMovies.length})
              </h2>
            </div>

            {likedMovies.length > 0 ? (
              <>
                <div className="grid gap-3">
                  {moviesToShow.map(movie => (
                    <div
                      key={movie.id}
                      className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg hover:bg-gray-600 transition group"
                    >
                      <div>
                        <span className="text-white font-medium">{movie.title}</span>
                        {movie.year && (
                          <span className="text-gray-400 text-sm ml-2">({movie.year})</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">
                        Ajouté le {new Date(movie.likedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
                
                {likedMovies.length > 5 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setShowAll(prev => !prev)}
                      className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-medium"
                    >
                      {showAll ? "Voir moins" : `Voir les ${likedMovies.length - 5} autres`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Heart className="text-gray-600 mx-auto mb-3" size={48} />
                <p className="text-gray-400">Vous n'avez pas encore posté de critiques positives.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Les films que vous notez 3 étoiles ou plus apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}