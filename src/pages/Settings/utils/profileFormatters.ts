import { ProfileFormData, SupabaseProfile } from "../entities/ProfileTypes";

/**
 * Convertit les données Supabase en format de formulaire
 * @param supabaseData - Données au format SupabaseProfile
 * @returns Données au format ProfileFormData pour affichage dans le formulaire
 */
export const formatSupabaseToFormData = (
  supabaseData: SupabaseProfile
): ProfileFormData => {
  return {
    // INFORMATIONS
    companyName: supabaseData.name || "",
    website: supabaseData.website || "",

    // ORGANISATION
    entityType: supabaseData.entity_type || ("" as any),
    activitySector: supabaseData.industry || "",
    companySize: supabaseData.company_size || ("" as any),

    // PERSONNALISATION NESSIA
    targetAudience: supabaseData.reccommandation || "",
    role: supabaseData.speaker_role || "",

    // LEGAL & CONFORMITÉ
    mandatoryMentions: supabaseData.required_mentions || [],
    forbiddenWords: supabaseData.banned_terms || [],
  };
};

/**
 * Convertit les données du formulaire en format Supabase
 * @param formData - Données au format ProfileFormData depuis le formulaire
 * @returns Données au format SupabaseProfile pour envoi à la base de données
 */
export const formatFormDataToSupabase = (
  formData: ProfileFormData
): SupabaseProfile => {
  return {
    // INFORMATIONS
    name: formData.companyName || undefined,
    website: formData.website || undefined,

    // ORGANISATION
    entity_type: formData.entityType || undefined,
    industry: formData.activitySector || undefined,
    company_size: formData.companySize || undefined,

    // PERSONNALISATION NESSIA
    speaker_role: formData.role || undefined,
    reccommandation: formData.targetAudience || undefined,

    // LEGAL & CONFORMITÉ
    required_mentions:
      formData.mandatoryMentions.length > 0 ? formData.mandatoryMentions : [],
    banned_terms:
      formData.forbiddenWords.length > 0 ? formData.forbiddenWords : [],
  };
};
