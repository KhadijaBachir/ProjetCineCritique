import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('User dans Header:', user);
    console.log('Token dans localStorage:', localStorage.getItem('authToken'));
    console.log('User dans localStorage:', localStorage.getItem('user'));
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  if (authLoading) {
    return (
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <span className="text-gray-400">Chargement...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Film size={28} />
            <span className="text-xl font-bold">CinéCritique</span>
          </Link>

          {/* Search Bar Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/top-rated"
              className={`relative px-3 py-2 transition-colors ${
                isActiveLink('/top-rated')
                  ? 'text-white font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Top Films
              {isActiveLink('/top-rated') && <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t"></span>}
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-reviews"
                  className={`relative px-3 py-2 transition-colors ${
                    isActiveLink('/my-reviews')
                      ? 'text-white font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Mes Critiques
                  {isActiveLink('/my-reviews') && <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t"></span>}
                </Link>
                <Link
                  to={`/profile/${user.pseudo || user.id}`}
                  className={`flex items-center space-x-2 px-3 py-2 relative transition-colors ${
                    isActiveLink(`/profile/${user.pseudo || user.id}`)
                      ? 'text-white font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <User size={20} />
                  <span>{user.pseudo || 'Profil'}</span>
                  {isActiveLink(`/profile/${user.pseudo || user.id}`) && <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t"></span>}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors px-3 py-2"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 transition-colors ${
                    isActiveLink('/login') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un film..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <nav className="space-y-4">
              <Link
                to="/top-rated"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 px-3 rounded transition-colors ${
                  isActiveLink('/top-rated')
                    ? 'bg-yellow-400 text-gray-900 font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Top Films
              </Link>

              {user ? (
                <>
                  <Link
                    to="/my-reviews"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-3 rounded transition-colors ${
                      isActiveLink('/my-reviews')
                        ? 'bg-yellow-400 text-gray-900 font-medium'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Mes Critiques
                  </Link>
                  <Link
                    to={`/profile/${user.pseudo || user.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-3 rounded transition-colors ${
                      isActiveLink(`/profile/${user.pseudo || user.id}`)
                        ? 'bg-yellow-400 text-gray-900 font-medium'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {user.pseudo || 'Profil'}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 px-3 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-3 rounded transition-colors ${
                      isActiveLink('/login')
                        ? 'bg-yellow-400 text-gray-900 font-medium'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-center bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-medium transition-colors"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
