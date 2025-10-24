import { db } from "../../../shared/services/db";
import { ProfileFormData } from "../entities/ProfileTypes";
import {
  formatFormDataToSupabase,
  formatSupabaseToFormData,
} from "../utils/profileFormatters";

export class AccountService {
  static async getCompanyData(companyId: string) {
    const data = await db.getCompanyData(companyId);
    if (!data) return null;
    const result = formatSupabaseToFormData(data);
    return result;
  }

  static async updateCompanyData(companyId: string, data: ProfileFormData) {
    const supabaseData = formatFormDataToSupabase(data);
    const result = await db.updateCompanyData(companyId, supabaseData);
    return result;
  }
}
