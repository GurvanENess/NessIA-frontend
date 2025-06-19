import { testSupabase, testUtils } from '../setup';

// Tests pour les opérations d'authentification
export class AuthDbTest {
  private testEmail: string = '';
  private testPassword: string = '';

  async testSignUp() {
    console.log('👤 Testing user sign up...');
    
    this.testEmail = `test-signup-${Date.now()}@example.com`;
    this.testPassword = 'testpassword123';

    try {
      const { data, error } = await testSupabase.auth.signUp({
        email: this.testEmail,
        password: this.testPassword,
        options: {
          data: { display_name: 'Test Signup User' }
        }
      });

      if (error) throw error;

      console.log('✅ User signed up successfully:', data.user?.email);
      return data;
    } catch (error) {
      console.error('❌ Error signing up user:', error);
      throw error;
    }
  }

  async testSignIn() {
    console.log('🔐 Testing user sign in...');
    
    try {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email: this.testEmail,
        password: this.testPassword
      });

      if (error) throw error;

      console.log('✅ User signed in successfully:', data.user?.email);
      return data;
    } catch (error) {
      console.error('❌ Error signing in user:', error);
      throw error;
    }
  }

  async testGetCurrentUser() {
    console.log('👥 Testing get current user...');
    
    try {
      const { data: { user }, error } = await testSupabase.auth.getUser();

      if (error) throw error;

      console.log('✅ Current user retrieved:', user?.email);
      return user;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      throw error;
    }
  }

  async testUpdateUserMetadata() {
    console.log('📝 Testing user metadata update...');
    
    const updates = {
      data: { 
        display_name: 'Updated Test User',
        bio: 'This is a test bio'
      }
    };

    try {
      const { data, error } = await testSupabase.auth.updateUser(updates);

      if (error) throw error;

      console.log('✅ User metadata updated successfully:', data.user?.user_metadata);
      return data;
    } catch (error) {
      console.error('❌ Error updating user metadata:', error);
      throw error;
    }
  }

  async testSignOut() {
    console.log('🚪 Testing user sign out...');
    
    try {
      const { error } = await testSupabase.auth.signOut();

      if (error) throw error;

      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out user:', error);
      throw error;
    }
  }

  async testAuthStateChange() {
    console.log('🔄 Testing auth state change listener...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Auth state change test timed out'));
      }, 5000);

      const { data: { subscription } } = testSupabase.auth.onAuthStateChange((event, session) => {
        console.log(`✅ Auth state changed: ${event}`, session?.user?.email);
        clearTimeout(timeout);
        subscription.unsubscribe();
        resolve(event);
      });

      // Déclencher un changement d'état en se connectant
      testSupabase.auth.signInWithPassword({
        email: this.testEmail,
        password: this.testPassword
      });
    });
  }

  async testInvalidCredentials() {
    console.log('❌ Testing invalid credentials...');
    
    try {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });

      if (error) {
        console.log('✅ Invalid credentials correctly rejected:', error.message);
        return true;
      } else {
        throw new Error('Invalid credentials should have been rejected');
      }
    } catch (error) {
      console.error('❌ Unexpected error with invalid credentials:', error);
      throw error;
    }
  }

  // Exécuter tous les tests
  async runAllTests() {
    try {
      console.log('🚀 Starting Auth DB tests...');
      
      // Test d'inscription
      await this.testSignUp();
      
      // Test de connexion
      await this.testSignIn();
      
      // Test de récupération de l'utilisateur actuel
      await this.testGetCurrentUser();
      
      // Test de mise à jour des métadonnées
      await this.testUpdateUserMetadata();
      
      // Test de changement d'état d'authentification
      await this.testAuthStateChange();
      
      // Test de déconnexion
      await this.testSignOut();
      
      // Test avec des identifiants invalides
      await this.testInvalidCredentials();
      
      console.log('🎉 All Auth DB tests passed!');
    } catch (error) {
      console.error('💥 Auth DB tests failed:', error);
    }
  }
}