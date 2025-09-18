import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

          {/* Search Bar - Desktop */}
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

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/top-rated" 
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Top Films
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/my-reviews" 
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Mes Critiques
                </Link>
                <Link 
                  to={`/profile/${user.user_metadata?.username || user.id}`}
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <User size={20} />
                  <span>{user.user_metadata?.username || 'Profil'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                >
                  Inscription
                </Link>
              </div>
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
            {/* Mobile Search */}
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

            {/* Mobile Navigation */}
            <nav className="space-y-4">
              <Link 
                to="/top-rated" 
                className="block text-gray-300 hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Top Films
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/my-reviews" 
                    className="block text-gray-300 hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes Critiques
                  </Link>
                  <Link 
                    to={`/profile/${user.user_metadata?.username || user.id}`}
                    className="block text-gray-300 hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-300 hover:text-red-400 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-gray-300 hover:text-blue-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
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