import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../shared/store/authStore";
import { useRegisterStore } from "../store/store";
import validateForm from "../validator";
import RegisterForm from "./RegisterForm";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setErrors, setLoading, errors, isLoading } = useRegisterStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const validationErrors = validateForm({
      email,
      password,
      confirmPassword,
      username,
    });

    if (validationErrors) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { success } = await signup({
        email,
        password,
        confirmPassword,
        username,
      });

      if (success) {
        navigate("/login");
      } else {
        setErrors({
          email: "Une erreur est survenue lors de l'inscription",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        email: "Une erreur est survenue lors de l'inscription",
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
                  Bienvenue !
                </h1>
                <p className="text-gray-300 text-md font-sans font-light md:mt-2 md:text-lg">
                  Créez votre compte Nessia
                </p>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <RegisterForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            username={username}
            setUsername={setUsername}
            handleSubmit={handleSubmit}
            errors={errors}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
