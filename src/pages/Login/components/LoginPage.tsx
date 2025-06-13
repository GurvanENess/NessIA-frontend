import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useLoginStore } from "../store/store";
import validateForm from "../validator";
import LoginForm from "./LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setErrors, setLoading, errors, isLoading } = useLoginStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const errors = validateForm({ email, password });

    if (errors) {
      setErrors(errors);
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        password: "Email ou mot de passe incorrect",
      });
    } finally {
      setLoading(false);
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
                  Bonjour !
                </h1>
                <p className="text-gray-300 text-md font-sans font-light md:mt-2 md:text-lg">
                  Bienvenue sur Nessia
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            errors={errors}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
