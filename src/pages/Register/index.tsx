import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";

// TODO: Améliorer l'UI, faire les TODOS présents dedans lol.

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
  }>({});

  // A exporter dans un dossier api/validation
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      username?: string;
    } = {};

    if (!username) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // TODO: Implement registration logic
    // Voir si créer un hook useLoading serait pas adéquat
    // Voir si créer un hook useMockApiCall serait pas adéquat

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        email: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2E3047] relative overflow-hidden flex flex-col">
      {/* Decorative elements */}
      <img
        src="/assets/green_star.svg"
        alt=""
        className="absolute translate-x-[-50%] translate-y-[-50%] top-0 w-48 h-48 md:w-60 md:h-60"
        aria-hidden="true"
      />
      <img
        src="/assets/green_star.svg"
        alt=""
        className="absolute right-4 top-[25%] w-20 h-20 md:w-32 md:h-32"
        aria-hidden="true"
      />
      <img
        src="/assets/pink_star.svg"
        alt=""
        className="absolute right-[-30px] top-10 w-32 h-32 md:w-48 md:h-48"
        aria-hidden="true"
      />

      <div className="flex-1 flex flex-col md:container md:mx-auto md:px-4 md:py-8 md:items-center md:min-h-screen md:justify-center">
        <div className="flex-1 flex flex-col md:flex-none md:max-w-md md:w-full">
          {/* Logo and Welcome text */}
          <div className="px-8 pt-36 pb-14 md:py-12 ">
            <div className="flex gap-2 md:gap-3 mb-1">
              <img
                src="/assets/nessia_logo.svg"
                alt="Nessia"
                className="w-10 self-start mt-2 md:w-14"
              />
              <div className="flex flex-col mb-1 justify-between">
                <h1 className="text-white text-3xl tracking-wide font-coolvetica !font-coolvetica sm:text-6xl md:text-6xl lg:text-7xl">
                  Bienvenue !
                </h1>
                <p className="text-gray-300 text-md font-sans font-light md:mt-2 md:text-lg">
                  Créez votre compte Nessia
                </p>
              </div>
            </div>
          </div>

          {/* Register Form */}
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
                    href="#"
                    className="text-[#7C3AED] font-coolvetica hover:text-[#6D28D9] transition-colors"
                  >
                    Se connecter
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
