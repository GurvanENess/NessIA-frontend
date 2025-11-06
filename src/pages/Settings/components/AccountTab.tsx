import { ChevronDown, ChevronUp, Lock, Mail, Save, User } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmEmailChangeModal from "../../../shared/components/ConfirmEmailChangeModal";
import ConfirmPasswordChangeModal from "../../../shared/components/ConfirmPasswordChangeModal";
import InputField from "../../../shared/components/InputField";
import { useAuth } from "../../../shared/contexts/AuthContext";

const AccountTab: React.FC = () => {
  const { user, updateUserName, updateUserEmail, updateUserPassword } =
    useAuth();

  const [nameFormData, setNameFormData] = useState({
    name: user?.name || "",
  });

  const [emailFormData, setEmailFormData] = useState({
    email: user?.email || "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

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

  const handlePasswordSubmit = (e: FormEvent) => {
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

    // Ouvrir la modale de confirmation au lieu de soumettre directement
    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = async () => {
    setIsPasswordLoading(true);
    try {
      await updateUserPassword(passwordFormData.newPassword);
      toast.success("Mot de passe mis à jour avec succès");
      setPasswordFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
      setIsPasswordFormOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);

      if (error.status === 401) {
        toast.error(
          "Impossible de changer le mot de passe. Votre session a expiré, veuillez vous reconnecter."
        );
      } else {
        toast.error(
          "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer."
        );
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-coolvetica text-gray-900">
            Informations du compte
          </h2>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm ml-10 sm:ml-13">
          Gérez vos informations personnelles et préférences de sécurité
        </p>
      </div>

      {/* Formulaire nom d'utilisateur */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
            <span className="truncate">Nom d'utilisateur</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsNameFormOpen(!isNameFormOpen)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            {isNameFormOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Masquer</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Modifier</span>
                <span className="sm:hidden">Modifier</span>
              </>
            )}
          </button>
        </div>

        {!isNameFormOpen && (
          <p className="text-gray-600 text-xs sm:text-sm break-words">
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

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsNameFormOpen(false);
                  setNameFormData({ name: user?.name || "" });
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 order-2 sm:order-1"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md order-1 sm:order-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Formulaire adresse email */}
      <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
            <span className="truncate">Adresse email</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsEmailFormOpen(!isEmailFormOpen)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            {isEmailFormOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Masquer</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Modifier</span>
                <span className="sm:hidden">Modifier</span>
              </>
            )}
          </button>
        </div>

        {!isEmailFormOpen && (
          <p className="text-gray-600 text-xs sm:text-sm break-all">
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

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEmailFormOpen(false);
                  setEmailFormData({ email: user?.email || "" });
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 order-2 sm:order-1"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md order-1 sm:order-2"
              >
                <Mail className="w-4 h-4" />
                Changer d'email
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Formulaire changement de mot de passe (séparé) */}
      <div className="mt-4 sm:mt-6">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
              <span className="truncate">Sécurité</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0"
            >
              {isPasswordFormOpen ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Masquer</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Modifier</span>
                  <span className="sm:hidden">Modifier</span>
                </>
              )}
            </button>
          </div>

          {!isPasswordFormOpen && (
            <p className="text-gray-600 text-xs sm:text-sm">
              Changez votre mot de passe pour sécuriser votre compte
            </p>
          )}

          {isPasswordFormOpen && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-4 pt-4 border-t border-gray-200">
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

                <div>
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
                  {passwordFormData.confirmPassword &&
                    passwordFormData.newPassword !==
                      passwordFormData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  {passwordFormData.confirmPassword &&
                    passwordFormData.newPassword ===
                      passwordFormData.confirmPassword && (
                      <p className="text-green-500 text-sm mt-1">
                        Les mots de passe correspondent ✓
                      </p>
                    )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordFormOpen(false);
                    setPasswordFormData({
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm hover:shadow-md order-1 sm:order-2"
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

      {/* Modale de confirmation pour le changement de mot de passe */}
      <ConfirmPasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordConfirm}
        isLoading={isPasswordLoading}
      />
    </div>
  );
};

export default AccountTab;
