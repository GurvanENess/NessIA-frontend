import { Lock, Save, User } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import InputField from "../../../shared/components/InputField";
import { useAuth } from "../../../shared/contexts/AuthContext";

const AccountTab: React.FC = () => {
  const { user, updateUserName, updateUserEmail } = useAuth();
  console.log("user", user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUserName(formData.name);
      if (formData.email !== user?.email) {
        await updateUserEmail(formData.email);
      }
      toast.success("Informations du compte mises à jour avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des informations du compte :",
        error
      );
      toast.error(
        "Une erreur est survenue lors de la mise à jour du nom d'utilisateur. Veuillez réessayer."
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h2 className="text-2xl font-coolvetica text-gray-900">
            Informations du compte
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-13">
          Gérez vos informations personnelles et préférences de sécurité
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            Informations personnelles
          </h3>

          <div className="space-y-4">
            <InputField
              label="Nom d'utilisateur"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Votre nom"
              className="bg-white"
            />

            <InputField
              label="Adresse email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="votre@email.com"
              className="bg-white"
            />
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            Sécurité
          </h3>

          <div className="space-y-4">
            <InputField
              label="Mot de passe actuel"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />

            <InputField
              label="Nouveau mot de passe"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />

            <InputField
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />
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

export default AccountTab;
