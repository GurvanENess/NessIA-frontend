import { testSupabase, testUtils } from '../setup';

describe('Authentication Tests', () => {
  let testEmail: string;
  let testPassword: string;
  let testUserId: string;

  beforeEach(() => {
    testEmail = testUtils.generateTestEmail();
    testPassword = 'testpassword123';
  });

  afterEach(async () => {
    // Nettoyer après chaque test
    await testUtils.logoutTestUser();
    if (testUserId) {
      await testUtils.cleanupTestData(testUserId);
    }
  });

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const { data, error } = await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { display_name: 'Test User' }
        }
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
      expect(data.user?.user_metadata.display_name).toBe('Test User');
      
      testUserId = data.user?.id || '';
    });

    it('should reject registration with invalid email', async () => {
      const { data, error } = await testSupabase.auth.signUp({
        email: 'invalid-email',
        password: testPassword
      });

      expect(error).toBeDefined();
      expect(data.user).toBeNull();
    });

    it('should reject registration with weak password', async () => {
      const { data, error } = await testSupabase.auth.signUp({
        email: testEmail,
        password: '123' // Mot de passe trop faible
      });

      expect(error).toBeDefined();
      expect(data.user).toBeNull();
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de connexion
      const { data } = await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { display_name: 'Test User' }
        }
      });
      testUserId = data.user?.id || '';
      await testUtils.logoutTestUser(); // Se déconnecter après création
    });

    it('should successfully sign in with valid credentials', async () => {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
      expect(data.session).toBeDefined();
    });

    it('should reject sign in with invalid credentials', async () => {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email: testEmail,
        password: 'wrongpassword'
      });

      expect(error).toBeDefined();
      expect(data.user).toBeNull();
      expect(data.session).toBeNull();
    });

    it('should reject sign in with non-existent email', async () => {
      const { data, error } = await testSupabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: testPassword
      });

      expect(error).toBeDefined();
      expect(data.user).toBeNull();
    });
  });

  describe('User Session Management', () => {
    beforeEach(async () => {
      const { data } = await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });
      testUserId = data.user?.id || '';
    });

    it('should get current user when authenticated', async () => {
      const { data: { user }, error } = await testSupabase.auth.getUser();

      expect(error).toBeNull();
      expect(user).toBeDefined();
      expect(user?.email).toBe(testEmail);
    });

    it('should successfully sign out', async () => {
      const { error } = await testSupabase.auth.signOut();

      expect(error).toBeNull();

      // Vérifier que l'utilisateur n'est plus connecté
      const { data: { user } } = await testSupabase.auth.getUser();
      expect(user).toBeNull();
    });
  });

  describe('User Metadata', () => {
    beforeEach(async () => {
      const { data } = await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { display_name: 'Original Name' }
        }
      });
      testUserId = data.user?.id || '';
    });

    it('should update user metadata', async () => {
      const updates = {
        data: { 
          display_name: 'Updated Name',
          bio: 'Test bio'
        }
      };

      const { data, error } = await testSupabase.auth.updateUser(updates);

      expect(error).toBeNull();
      expect(data.user?.user_metadata.display_name).toBe('Updated Name');
      expect(data.user?.user_metadata.bio).toBe('Test bio');
    });
  });

  describe('Auth State Changes', () => {
    it('should trigger auth state change on sign in', async () => {
      // Créer un utilisateur d'abord
      await testSupabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });
      await testUtils.logoutTestUser();

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Auth state change test timed out'));
        }, 10000);

        const { data: { subscription } } = testSupabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN') {
            expect(session).toBeDefined();
            expect(session?.user?.email).toBe(testEmail);
            clearTimeout(timeout);
            subscription.unsubscribe();
            resolve();
          }
        });

        // Déclencher la connexion
        testSupabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
      });
    });
  });
});