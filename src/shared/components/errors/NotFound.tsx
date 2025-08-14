import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E7E9F2] text-center p-4">
      <img src="/assets/nessia_logo.svg" alt="Nessia logo" className="w-24 mb-6" />
      <h1 className="text-3xl font-semibold text-[#1A201B] mb-2">Page introuvable</h1>
      <p className="text-gray-600 mb-6">
        La page que vous cherchez n'existe pas.
      </p>
      <Link
        to="/"
        className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D28D9] transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
