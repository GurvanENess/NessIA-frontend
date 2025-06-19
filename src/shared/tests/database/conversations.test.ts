import { testSupabase, testUtils, TestConversation } from '../setup';

describe('Conversations Database Tests', () => {
  let testUserId: string;
  let testUser: any;

  beforeAll(async () => {
    // Créer un utilisateur de test pour tous les tests
    const userData = await testUtils.createTestUser();
    testUser = userData;
    testUserId = userData.user?.id || '';
  });

  afterAll(async () => {
    // Nettoyer toutes les données de test
    await testUtils.cleanupTestData(testUserId);
    await testUtils.logoutTestUser();
  });

  beforeEach(async () => {
    // S'assurer que l'utilisateur est connecté pour chaque test
    await testUtils.loginTestUser(testUser.email, testUser.password);
  });

  describe('Conversation Creation', () => {
    it('should create a new conversation successfully', async () => {
      const testConversation: TestConversation = {
        title: 'TEST_New Conversation',
        last_message: 'Hello, this is a test conversation',
        user_id: testUserId,
        is_active: true,
        message_count: 1
      };

      const { data, error } = await testSupabase
        .from('conversations')
        .insert([testConversation])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.title).toBe(testConversation.title);
      expect(data.user_id).toBe(testUserId);
      expect(data.is_active).toBe(true);
      expect(data.id).toBeDefined();
    });

    it('should create conversation with default values', async () => {
      const minimalConversation = {
        title: 'TEST_Minimal Conversation',
        last_message: 'Minimal test message',
        user_id: testUserId
      };

      const { data, error } = await testSupabase
        .from('conversations')
        .insert([minimalConversation])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.is_active).toBe(true); // Valeur par défaut
      expect(data.message_count).toBe(0); // Valeur par défaut
    });

    it('should reject conversation creation without required fields', async () => {
      const invalidConversation = {
        last_message: 'Message without title',
        user_id: testUserId
      };

      const { data, error } = await testSupabase
        .from('conversations')
        .insert([invalidConversation])
        .select();

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Conversation Reading', () => {
    let createdConversationId: string;

    beforeEach(async () => {
      // Créer une conversation pour les tests de lecture
      const testConversation: TestConversation = {
        title: 'TEST_Read Conversation',
        last_message: 'Conversation for reading tests',
        user_id: testUserId,
        is_active: true,
        message_count: 5
      };

      const { data } = await testSupabase
        .from('conversations')
        .insert([testConversation])
        .select()
        .single();

      createdConversationId = data.id;
    });

    it('should retrieve conversations by user ID', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', testUserId)
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should retrieve a specific conversation by ID', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('id', createdConversationId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.id).toBe(createdConversationId);
      expect(data.title).toBe('TEST_Read Conversation');
    });

    it('should filter conversations by active status', async () => {
      // Créer des conversations avec différents statuts
      const conversations: TestConversation[] = [
        {
          title: 'TEST_Active Conversation',
          last_message: 'Active conversation',
          user_id: testUserId,
          is_active: true,
          message_count: 3
        },
        {
          title: 'TEST_Archived Conversation',
          last_message: 'Archived conversation',
          user_id: testUserId,
          is_active: false,
          message_count: 10
        }
      ];

      await testSupabase.from('conversations').insert(conversations);

      // Tester le filtrage par statut actif
      const { data: activeConversations, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', testUserId)
        .eq('is_active', true)
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(activeConversations.length).toBeGreaterThanOrEqual(2);
      activeConversations.forEach(conversation => {
        expect(conversation.is_active).toBe(true);
      });
    });

    it('should sort conversations by creation date', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', testUserId)
        .like('title', 'TEST_%')
        .order('created_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      // Vérifier que les conversations sont triées par date décroissante
      for (let i = 1; i < data.length; i++) {
        const currentDate = new Date(data[i].created_at);
        const previousDate = new Date(data[i - 1].created_at);
        expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
      }
    });

    it('should sort conversations by message count', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', testUserId)
        .like('title', 'TEST_%')
        .order('message_count', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      // Vérifier que les conversations sont triées par nombre de messages décroissant
      for (let i = 1; i < data.length; i++) {
        expect(data[i].message_count).toBeLessThanOrEqual(data[i - 1].message_count);
      }
    });
  });

  describe('Conversation Updates', () => {
    let conversationToUpdate: any;

    beforeEach(async () => {
      // Créer une conversation pour les tests de mise à jour
      const testConversation: TestConversation = {
        title: 'TEST_Update Conversation',
        last_message: 'Conversation for update tests',
        user_id: testUserId,
        is_active: true,
        message_count: 2
      };

      const { data } = await testSupabase
        .from('conversations')
        .insert([testConversation])
        .select()
        .single();

      conversationToUpdate = data;
    });

    it('should update conversation title and message', async () => {
      const updates = {
        title: 'TEST_Updated Conversation',
        last_message: 'Updated last message',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await testSupabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.title).toBe(updates.title);
      expect(data.last_message).toBe(updates.last_message);
      expect(data.id).toBe(conversationToUpdate.id);
    });

    it('should update message count', async () => {
      const newMessageCount = 10;

      const { data, error } = await testSupabase
        .from('conversations')
        .update({ message_count: newMessageCount })
        .eq('id', conversationToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.message_count).toBe(newMessageCount);
    });

    it('should archive conversation', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.is_active).toBe(false);
    });

    it('should reactivate archived conversation', async () => {
      // D'abord archiver
      await testSupabase
        .from('conversations')
        .update({ is_active: false })
        .eq('id', conversationToUpdate.id)
        .eq('user_id', testUserId);

      // Puis réactiver
      const { data, error } = await testSupabase
        .from('conversations')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.is_active).toBe(true);
    });

    it('should not update conversation from different user', async () => {
      // Créer un autre utilisateur
      const otherUser = await testUtils.createTestUser();
      
      const updates = {
        title: 'Unauthorized Update'
      };

      const { data, error } = await testSupabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationToUpdate.id)
        .eq('user_id', otherUser.user?.id) // Mauvais user_id
        .select();

      expect(data).toEqual([]); // Aucune ligne mise à jour
      
      // Nettoyer l'autre utilisateur
      await testUtils.cleanupTestData(otherUser.user?.id || '');
    });
  });

  describe('Conversation Deletion', () => {
    let conversationToDelete: any;

    beforeEach(async () => {
      // Créer une conversation pour les tests de suppression
      const testConversation: TestConversation = {
        title: 'TEST_Delete Conversation',
        last_message: 'Conversation for deletion tests',
        user_id: testUserId,
        is_active: true,
        message_count: 1
      };

      const { data } = await testSupabase
        .from('conversations')
        .insert([testConversation])
        .select()
        .single();

      conversationToDelete = data;
    });

    it('should delete a conversation successfully', async () => {
      const { error } = await testSupabase
        .from('conversations')
        .delete()
        .eq('id', conversationToDelete.id)
        .eq('user_id', testUserId);

      expect(error).toBeNull();

      // Vérifier que la conversation a été supprimée
      const { data, error: selectError } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('id', conversationToDelete.id);

      expect(selectError).toBeNull();
      expect(data).toEqual([]);
    });

    it('should not delete conversation from different user', async () => {
      // Créer un autre utilisateur
      const otherUser = await testUtils.createTestUser();
      
      const { error } = await testSupabase
        .from('conversations')
        .delete()
        .eq('id', conversationToDelete.id)
        .eq('user_id', otherUser.user?.id); // Mauvais user_id

      expect(error).toBeNull(); // Pas d'erreur, mais aucune suppression

      // Vérifier que la conversation existe toujours
      const { data } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('id', conversationToDelete.id);

      expect(data.length).toBe(1);
      
      // Nettoyer l'autre utilisateur
      await testUtils.cleanupTestData(otherUser.user?.id || '');
    });
  });

  describe('Conversation Statistics', () => {
    beforeEach(async () => {
      // Créer plusieurs conversations pour les tests de statistiques
      const conversations: TestConversation[] = [
        {
          title: 'TEST_Stats Conversation 1',
          last_message: 'Message 1',
          user_id: testUserId,
          is_active: true,
          message_count: 5
        },
        {
          title: 'TEST_Stats Conversation 2',
          last_message: 'Message 2',
          user_id: testUserId,
          is_active: true,
          message_count: 10
        },
        {
          title: 'TEST_Stats Conversation 3',
          last_message: 'Message 3',
          user_id: testUserId,
          is_active: false,
          message_count: 3
        }
      ];

      await testSupabase.from('conversations').insert(conversations);
    });

    it('should count total conversations for user', async () => {
      const { count, error } = await testSupabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', testUserId)
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    it('should count active conversations', async () => {
      const { count, error } = await testSupabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', testUserId)
        .eq('is_active', true)
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('should calculate total message count', async () => {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('message_count')
        .eq('user_id', testUserId)
        .like('title', 'TEST_Stats%');

      expect(error).toBeNull();
      
      const totalMessages = data.reduce((sum, conv) => sum + conv.message_count, 0);
      expect(totalMessages).toBe(18); // 5 + 10 + 3
    });
  });
});