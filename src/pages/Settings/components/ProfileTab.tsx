import {
  Briefcase,
  Building2,
  FileText,
  Save,
  Scale,
  Target,
} from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import TextAreaField from "../../../shared/components/TextAreaField";
import { useApp } from "../../../shared/contexts/AppContext";
import {
  COMPANY_SIZE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  ProfileFormData,
} from "../entities/ProfileTypes";
import { AccountService } from "../services/accountService";
import ForbiddenWordsField from "./ForbiddenWordsField";
import MandatoryMentionsField from "./MandatoryMentionsField";

const ProfileTab: React.FC = () => {
  const {
    state: { currentCompany },
    updateCurrentCompany,
    updateCompanyInList,
  } = useApp();

  const [formData, setFormData] = useState<ProfileFormData>({
    // INFORMATIONS
    companyName: "",
    role: "",
    website: "",

    // ORGANISATION
    entityType: "" as any,
    activitySector: "",
    companySize: "" as any,

    // CIBLES & PILIERS ÉDITORIAUX
    targetAudience: "",

    // LEGAL & CONFORMITÉ
    mandatoryMentions: [],
    forbiddenWords: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentCompany) {
      setIsLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const data = await AccountService.getCompanyData(currentCompany.id);
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du profil :",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [currentCompany]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Profile Tab - formData", formData);
    if (!currentCompany) {
      console.error("Aucune entreprise sélectionnée");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await AccountService.updateCompanyData(currentCompany.id, formData);

      // Mettre à jour le store global immédiatement
      updateCurrentCompany({
        name: formData.companyName,
      });

      // Mettre à jour la company dans la liste
      updateCompanyInList(currentCompany.id, {
        name: formData.companyName,
      });

      setSaveSuccess(true);

      // Réinitialiser le succès après 3 secondes
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du profil :", error);
      alert(
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h2 className="text-2xl font-coolvetica text-gray-900">
              Profil de l'entreprise
            </h2>
          </div>
          <p className="text-gray-600 text-sm ml-13">
            Configurez les informations de votre entreprise et vos préférences
            éditoriales
          </p>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">
              Chargement des données du profil...
            </p>
          </div>
        </div>
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
            Profil de l'entreprise
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-13">
          Configurez les informations de votre entreprise et vos préférences
          éditoriales
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INFORMATIONS */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            Informations
          </h3>

          <div className="space-y-4">
            <InputField
              label="Entreprise ou marque"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Nom de votre entreprise ou marque"
              className="bg-white"
            />

            <InputField
              label="Site web"
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.votre-site.com"
              className="bg-white"
            />
          </div>
        </div>

        {/* ORGANISATION */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-600" />
            Organisation
          </h3>

          <div className="space-y-4">
            <SelectField
              label="Type d'entité"
              value={formData.entityType}
              onChange={(value) => handleChange("entityType", value)}
              options={ENTITY_TYPE_OPTIONS}
              placeholder="Sélectionner le type d'entité"
              className="bg-white"
            />

            <InputField
              label="Secteur d'activité"
              type="text"
              value={formData.activitySector}
              onChange={(e) => handleChange("activitySector", e.target.value)}
              placeholder="Ex: E-commerce, SaaS, Conseil..."
              className="bg-white"
            />

            <SelectField
              label="Taille de l'entreprise"
              value={formData.companySize}
              onChange={(value) => handleChange("companySize", value)}
              options={COMPANY_SIZE_OPTIONS}
              placeholder="Sélectionner la taille"
              className="bg-white"
            />
          </div>
        </div>

        {/* PERSONNALISATION NESSIA */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-600" />
            Personnalisation NessIA
          </h3>

          <div className="space-y-4">
            <InputField
              label="Rôle/fonction"
              type="text"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="Ex: Community Manager, Directeur Marketing..."
              className="bg-white"
            />

            <TextAreaField
              label="Audience cible"
              value={formData.targetAudience}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              placeholder="Décrivez votre audience cible : démographie, centres d'intérêt, besoins..."
              rows={4}
              className="bg-white"
            />
          </div>
        </div>

        {/* LEGAL & CONFORMITÉ */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-gray-600" />
            Legal & Conformité
          </h3>

          <div className="space-y-4">
            <MandatoryMentionsField
              value={formData.mandatoryMentions}
              onChange={(mentions) =>
                handleChange("mandatoryMentions", mentions)
              }
            />

            <div className="pt-2">
              <ForbiddenWordsField
                value={formData.forbiddenWords}
                onChange={(words) => handleChange("forbiddenWords", words)}
              />
            </div>
          </div>
        </div>

        {/* Info supplémentaire */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                À propos de ce formulaire
              </h4>
              <p className="text-sm text-blue-700">
                Ces informations permettent de personnaliser votre expérience et
                d'optimiser la génération de contenu selon vos besoins et votre
                contexte professionnel.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm ${
              saveSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#7C3AED] hover:bg-[#6D28D9]"
            } text-white ${
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : saveSuccess ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Enregistré !
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer le profil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
