import { ChevronDown, ChevronUp, Lock, Mail, Save, User } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmEmailChangeModal from "../../../shared/components/ConfirmEmailChangeModal";
import InputField from "../../../shared/components/InputField";
import { useAuth } from "../../../shared/contexts/AuthContext";

const AccountTab: React.FC = () => {
  const { user, updateUserName, updateUserEmail } = useAuth();

  const [nameFormData, setNameFormData] = useState({
    name: user?.name || "",
  });

  const [emailFormData, setEmailFormData] = useState({
    email: user?.email || "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUserName(nameFormData.name);
      toast.success("Nom d'utilisateur mis à jour avec succès");
      setIsNameFormOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du nom d'utilisateur :",
        error
      );
      toast.error(
        "Une erreur est survenue lors de la mise à jour du nom d'utilisateur. Veuillez réessayer."
      );
    }
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Ouvrir la modale de confirmation au lieu de soumettre directement
    setIsEmailModalOpen(true);
  };

  const handleEmailConfirm = async () => {
    setIsEmailLoading(true);
    try {
      await updateUserEmail(emailFormData.email);
      toast.success(
        "Un email de confirmation a été envoyé à votre nouvelle adresse"
      );
      setIsEmailModalOpen(false);
      setIsEmailFormOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'adresse email :",
        error
      );
      toast.error(
        "Une erreur est survenue lors de la mise à jour de l'adresse email. Veuillez réessayer."
      );
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error(
        "Le nouveau mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    try {
      // TODO: Implémenter la logique de changement de mot de passe
      toast.success("Mot de passe mis à jour avec succès");
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordFormOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer."
      );
    }
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

      {/* Formulaire nom d'utilisateur */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            Nom d'utilisateur
          </h3>
          <button
            type="button"
            onClick={() => setIsNameFormOpen(!isNameFormOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200"
          >
            {isNameFormOpen ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Masquer
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Modifier le nom
              </>
            )}
          </button>
        </div>

        {!isNameFormOpen && (
          <p className="text-gray-600 text-sm">
            Nom actuel :{" "}
            <span className="font-medium text-gray-900">{user?.name}</span>
          </p>
        )}

        {isNameFormOpen && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <InputField
                label="Nouveau nom d'utilisateur"
                type="text"
                value={nameFormData.name}
                onChange={(e) => setNameFormData({ name: e.target.value })}
                placeholder="Votre nom"
                className="bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsNameFormOpen(false);
                  setNameFormData({ name: user?.name || "" });
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Formulaire adresse email */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            Adresse email
          </h3>
          <button
            type="button"
            onClick={() => setIsEmailFormOpen(!isEmailFormOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200"
          >
            {isEmailFormOpen ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Masquer
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Modifier l'email
              </>
            )}
          </button>
        </div>

        {!isEmailFormOpen && (
          <p className="text-gray-600 text-sm">
            Email actuel :{" "}
            <span className="font-medium text-gray-900">{user?.email}</span>
          </p>
        )}

        {isEmailFormOpen && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <InputField
                label="Nouvelle adresse email"
                type="email"
                value={emailFormData.email}
                onChange={(e) => setEmailFormData({ email: e.target.value })}
                placeholder="votre@email.com"
                className="bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEmailFormOpen(false);
                  setEmailFormData({ email: user?.email || "" });
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Mail className="w-4 h-4" />
                Changer d'email
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Formulaire changement de mot de passe (séparé) */}
      <div className="mt-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              Sécurité
            </h3>
            <button
              type="button"
              onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200"
            >
              {isPasswordFormOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Masquer
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Modifier le mot de passe
                </>
              )}
            </button>
          </div>

          {!isPasswordFormOpen && (
            <p className="text-gray-600 text-sm">
              Changez votre mot de passe pour sécuriser votre compte
            </p>
          )}

          {isPasswordFormOpen && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <InputField
                  label="Mot de passe actuel"
                  type="password"
                  value={passwordFormData.currentPassword}
                  onChange={(e) =>
                    setPasswordFormData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="bg-white"
                />

                <InputField
                  label="Nouveau mot de passe"
                  type="password"
                  value={passwordFormData.newPassword}
                  onChange={(e) =>
                    setPasswordFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="bg-white"
                />

                <InputField
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  value={passwordFormData.confirmPassword}
                  onChange={(e) =>
                    setPasswordFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordFormOpen(false);
                    setPasswordFormData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modale de confirmation pour le changement d'email */}
      <ConfirmEmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={user?.email || ""}
        newEmail={emailFormData.email}
        onConfirm={handleEmailConfirm}
        isLoading={isEmailLoading}
      />
    </div>
  );
};

export default AccountTab;
