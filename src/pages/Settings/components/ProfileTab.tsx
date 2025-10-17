import { AlertCircle, Building2, Save } from "lucide-react";
import React, { FormEvent, useState } from "react";
import InputField from "../../../shared/components/InputField";
import { useApp } from "../../../shared/contexts/AppContext";

const ProfileTab: React.FC = () => {
  const { state } = useApp();
  const { currentCompany } = state;

  const [formData, setFormData] = useState({
    companyName: currentCompany?.name || "",
    companyEmail: currentCompany?.email || "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logique de soumission à implémenter plus tard
    console.log("Formulaire soumis (pas encore implémenté):", formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!currentCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucune compagnie sélectionnée
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Veuillez sélectionner une compagnie pour gérer son profil.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h2 className="text-2xl font-coolvetica text-gray-900">
            Profil de la compagnie
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-13">
          Gérez les informations de votre compagnie
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de la compagnie */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            Informations de la compagnie
          </h3>

          <div className="space-y-4">
            <InputField
              label="Nom de la compagnie"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Nom de votre compagnie"
              className="bg-white"
            />

            <InputField
              label="Email de la compagnie"
              type="email"
              value={formData.companyEmail}
              onChange={(e) => handleChange("companyEmail", e.target.value)}
              placeholder="contact@compagnie.com"
              className="bg-white"
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Informations actuelles
              </h4>
              <p className="text-sm text-blue-700">
                Compagnie :{" "}
                <span className="font-medium">{currentCompany.name}</span>
              </p>
              {currentCompany.email && (
                <p className="text-sm text-blue-700">
                  Email :{" "}
                  <span className="font-medium">{currentCompany.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
