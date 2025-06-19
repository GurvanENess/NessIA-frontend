import { createClient } from '@supabase/supabase-js';

// Configuration Jest
beforeAll(() => {
  console.log('🧪 Setting up Jest tests for Supabase...');
});

afterAll(() => {
  console.log('✅ Jest tests completed');
});

// Configuration de test pour Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL_PROD || 'http://localhost:54321';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY_PROD || 'test-key';

// Client Supabase pour les tests
export const testSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Utilitaires de test
export const testUtils = {
  // Générer un email de test unique
  generateTestEmail: () => `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
  
  // Générer un ID utilisateur de test
  generateTestUserId: () => `test-user-${Date.now()}-${Math.random().toString(36).substring(7)}`,

  // Nettoyer les données de test
  async cleanupTestData(userId: string) {
    try {
      // Supprimer les posts de test
      await testSupabase
        .from('posts')
        .delete()
        .eq('user_id', userId)
        .like('title', 'TEST_%');

      // Supprimer les conversations de test
      await testSupabase
        .from('conversations')
        .delete()
        .eq('user_id', userId)
        .like('title', 'TEST_%');

      console.log(`✅ Test data cleaned up for user: ${userId}`);
    } catch (error) {
      console.error('❌ Error cleaning up test data:', error);
    }
  },

  // Créer un utilisateur de test
  async createTestUser() {
    const testEmail = this.generateTestEmail();
    const testPassword = 'testpassword123';

    try {
      const { data, error } = await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { display_name: 'Test User' }
        }
      });

      if (error) throw error;
      return { user: data.user, email: testEmail, password: testPassword };
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      throw error;
    }
  },

  // Se connecter avec un utilisateur de test
  async loginTestUser(email: string, password: string) {
    try {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error logging in test user:', error);
      throw error;
    }
  },

  // Se déconnecter
  async logoutTestUser() {
    try {
      await testSupabase.auth.signOut();
    } catch (error) {
      console.error('❌ Error logging out test user:', error);
    }
  },

  // Attendre un délai
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
};

// Types pour les tests
export interface TestPost {
  id?: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'scheduled';
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TestConversation {
  id?: string;
  title: string;
  last_message: string;
  user_id: string;
  is_active: boolean;
  message_count: number;
  created_at?: string;
  updated_at?: string;
}