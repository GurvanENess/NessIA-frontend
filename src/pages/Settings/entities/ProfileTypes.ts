export type EntityType = "personne" | "entreprise" | "agence";

export type CompanySize = "1-10" | "10-100" | "+100";

export interface ProfileFormData {
  // INFORMATIONS
  companyName: string;
  role: string;
  website: string;

  // ORGANISATION
  entityType: EntityType;
  activitySector: string;
  companySize: CompanySize;

  // CIBLES & PILIERS ÉDITORIAUX
  targetAudience: string;

  // LEGAL & CONFORMITÉ
  mandatoryMentions: {
    type: "file" | "link";
    value: string; // URL du fichier ou lien texte
    fileName?: string; // Nom du fichier si type = "file"
  } | null;
  forbiddenWords: string;
}

export const ENTITY_TYPE_OPTIONS: Array<{
  value: EntityType;
  label: string;
}> = [
  { value: "personne", label: "Personne" },
  { value: "entreprise", label: "Entreprise" },
  { value: "agence", label: "Agence" },
];

export const COMPANY_SIZE_OPTIONS: Array<{
  value: CompanySize;
  label: string;
}> = [
  { value: "1-10", label: "1-10 employés" },
  { value: "10-100", label: "10-100 employés" },
  { value: "+100", label: "+100 employés" },
];
