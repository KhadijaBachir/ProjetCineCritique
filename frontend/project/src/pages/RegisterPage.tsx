import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Interface pour les erreurs de formulaire
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Interface pour les erreurs Firebase
interface FirebaseError extends Error {
  code?: string;
}

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validateField = (name: string, value: string): boolean => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Le nom d\'utilisateur est requis';
        } else if (value.length < 3) {
          newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        } else {
          delete newErrors.username;
        }
        break;
      
      case 'email':
        if (!value) {
          newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Format d\'email invalide';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'password':
        if (value.length < 6) {
          newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        } else {
          delete newErrors.password;
        }
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const validations = [
      validateField('username', formData.username),
      validateField('email', formData.email),
      validateField('password', formData.password),
      validateField('confirmPassword', formData.confirmPassword)
    ];

    return validations.every(valid => valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.username);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      const firebaseError = error as FirebaseError;
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
        setErrors({ email: errorMessage });
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'Format d\'email invalide';
        setErrors({ email: errorMessage });
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible';
        setErrors({ password: errorMessage });
      } else if (firebaseError.message && firebaseError.message.includes('already registered')) {
        errorMessage = 'Cet email est déjà utilisé';
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Film size={32} className="text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">
              Ciné<span className="text-yellow-400">Critique</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white">Inscription</h2>
          <p className="mt-2 text-gray-400">
            Créez votre compte et rejoignez la communauté
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.general && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Votre nom d'utilisateur"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Minimum 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Répétez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Inscription en cours...</span>
              </div>
            ) : (
              'Créer mon compte'
            )}
          </button>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}