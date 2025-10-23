export type EntityType = "person" | "company" | "agency";

export type CompanySize = "1_10" | "10_100" | "100_plus";

export interface ProfileFormData {
  // INFORMATIONS
  companyName: string;
  website: string;

  // ORGANISATION
  entityType: EntityType;
  activitySector: string;
  companySize: CompanySize;

  // PERSONNALISATION NESSIA
  targetAudience: string;
  role: string;

  // LEGAL & CONFORMITÉ
  mandatoryMentions: string[]; // Liste des mentions obligatoires
  forbiddenWords: string[]; // Liste des mots interdits
}

export interface SupabaseProfile {
  // INFORMATIONS
  name?: string;
  website?: string;

  // ORGANISATION
  entity_type?: EntityType;
  industry?: string;
  company_size?: CompanySize;

  // PERSONNALISATION NESSIA
  speaker_role?: string;
  reccommandation?: string;

  // LEGAL & CONFORMITÉ
  banned_terms?: string[];
  required_mentions?: string[];
}

export const ENTITY_TYPE_OPTIONS: Array<{
  value: EntityType;
  label: string;
}> = [
  { value: "person", label: "Personne" },
  { value: "company", label: "Entreprise" },
  { value: "agency", label: "Agence" },
];

export const COMPANY_SIZE_OPTIONS: Array<{
  value: CompanySize;
  label: string;
}> = [
  { value: "1_10", label: "1-10 employés" },
  { value: "10_100", label: "10-100 employés" },
  { value: "100_plus", label: "+100 employés" },
];
