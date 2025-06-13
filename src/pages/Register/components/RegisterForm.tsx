import React from "react";
import { Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  username: string;
  setUsername: (username: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: { 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    username?: string; 
  };
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
  handleSubmit,
  errors,
  isLoading,
}: RegisterFormProps) => {
  return (
    <div className="bg-[#E7E9F2] rounded-t-3xl flex-1 md:flex-initial md:rounded-3xl md:shadow-xl">
      <div className="px-12 pt-10 pb-8 flex flex-col h-full">
        <h2 className="text-[2rem] font-coolvetica text-gray-900 mb-8">
          S'inscrire
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex-1 flex flex-col font-sans"
        >
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur"
                  className={`text-sm w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors bg-white ${
                    errors.username
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`text-sm w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors bg-white ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className={`text-sm w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors bg-white ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  className={`text-sm w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors bg-white ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7C3AED] text-white py-2 rounded-md font-sans font-light hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center gap-4 pt-10">
            <div className="flex-grow h-[1px] bg-[#1A201B]"></div>
            <span className="text-sm text-[#1A201B] font-normal whitespace-nowrap">
              Ou continuer avec
            </span>
            <div className="flex-grow h-[1px] bg-[#1A201B]"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={isLoading}
              className="flex flex-col items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/google.svg" alt="Google" className="w-6" />
              <span className="text-[#1A201B]">Google</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="flex flex-col items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/microsoft.svg" alt="Microsoft" className="w-6" />
              <span className="text-[#1A201B]">Microsoft</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              className="text-[#7C3AED] font-coolvetica hover:text-[#6D28D9] transition-colors"
            >
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;