import React from 'react';
import { Film, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Film size={24} />
              <span className="text-lg font-bold">CinéCritique</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme communautaire pour découvrir, critiquer et noter vos films préférés. 
              Rejoignez une communauté passionnée de cinéphiles.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/top-rated" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Films les mieux notés
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Connexion
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Inscription
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">À propos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              CinéCritique utilise l'API TMDb pour vous offrir les informations les plus complètes 
              sur vos films favoris.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Fait avec</span>
              <Heart size={16} className="text-red-500" />
              <span>pour les cinéphiles</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 CinéCritique. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            Données fournies par The Movie Database (TMDb)
          </p>
        </div>
      </div>
    </footer>
  );
}