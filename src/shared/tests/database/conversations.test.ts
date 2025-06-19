import { testSupabase, testUtils, TestConversation } from '../setup';

// Tests pour les opérations CRUD sur les conversations
export class ConversationsDbTest {
  private testUserId: string = '';

  async setup() {
    console.log('🚀 Setting up Conversations DB tests...');
    
    // Créer un utilisateur de test
    const { user } = await testUtils.createTestUser();
    this.testUserId = user?.id || '';
    
    console.log(`✅ Test user created: ${this.testUserId}`);
  }

  async cleanup() {
    console.log('🧹 Cleaning up Conversations DB tests...');
    
    // Nettoyer les données de test
    await testUtils.cleanupTestData(this.testUserId);
    
    // Se déconnecter
    await testUtils.logoutTestUser();
    
    console.log('✅ Cleanup completed');
  }

  async testCreateConversation() {
    console.log('💬 Testing conversation creation...');
    
    const testConversation: TestConversation = {
      title: 'TEST_New Conversation',
      last_message: 'Hello, this is a test conversation',
      user_id: this.testUserId,
      is_active: true,
      message_count: 1
    };

    try {
      const { data, error } = await testSupabase
        .from('conversations')
        .insert([testConversation])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Conversation created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      throw error;
    }
  }

  async testReadConversations() {
    console.log('📖 Testing conversations retrieval...');
    
    try {
      const { data, error } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.testUserId)
        .like('title', 'TEST_%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Retrieved ${data.length} test conversations`);
      return data;
    } catch (error) {
      console.error('❌ Error reading conversations:', error);
      throw error;
    }
  }

  async testUpdateConversation(conversationId: string) {
    console.log('✏️ Testing conversation update...');
    
    const updates = {
      title: 'TEST_Updated Conversation',
      last_message: 'This message has been updated',
      message_count: 5,
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await testSupabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId)
        .eq('user_id', this.testUserId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Conversation updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
      throw error;
    }
  }

  async testArchiveConversation(conversationId: string) {
    console.log('📦 Testing conversation archiving...');
    
    try {
      const { data, error } = await testSupabase
        .from('conversations')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .eq('user_id', this.testUserId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Conversation archived successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error archiving conversation:', error);
      throw error;
    }
  }

  async testDeleteConversation(conversationId: string) {
    console.log('🗑️ Testing conversation deletion...');
    
    try {
      const { error } = await testSupabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', this.testUserId);

      if (error) throw error;

      console.log('✅ Conversation deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      throw error;
    }
  }

  async testConversationFiltering() {
    console.log('🔍 Testing conversation filtering...');
    
    // Créer plusieurs conversations de test
    const testConversations: TestConversation[] = [
      {
        title: 'TEST_Active Conversation',
        last_message: 'Active conversation message',
        user_id: this.testUserId,
        is_active: true,
        message_count: 3
      },
      {
        title: 'TEST_Archived Conversation',
        last_message: 'Archived conversation message',
        user_id: this.testUserId,
        is_active: false,
        message_count: 10
      }
    ];

    try {
      // Insérer les conversations
      const { data: insertedConversations, error: insertError } = await testSupabase
        .from('conversations')
        .insert(testConversations)
        .select();

      if (insertError) throw insertError;

      // Tester le filtrage par statut actif
      const { data: activeConversations, error: filterError } = await testSupabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.testUserId)
        .eq('is_active', true)
        .like('title', 'TEST_%');

      if (filterError) throw filterError;

      console.log(`✅ Filtering test passed: found ${activeConversations.length} active conversations`);
      return { insertedConversations, activeConversations };
    } catch (error) {
      console.error('❌ Error in filtering test:', error);
      throw error;
    }
  }

  // Exécuter tous les tests
  async runAllTests() {
    try {
      await this.setup();
      
      // Test de création
      const createdConversation = await this.testCreateConversation();
      
      // Test de lecture
      await this.testReadConversations();
      
      // Test de mise à jour
      await this.testUpdateConversation(createdConversation.id);
      
      // Test d'archivage
      await this.testArchiveConversation(createdConversation.id);
      
      // Test de filtrage
      await this.testConversationFiltering();
      
      // Test de suppression
      await this.testDeleteConversation(createdConversation.id);
      
      console.log('🎉 All Conversations DB tests passed!');
    } catch (error) {
      console.error('💥 Conversations DB tests failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}