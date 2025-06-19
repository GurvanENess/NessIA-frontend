import { testSupabase, testUtils, TestPost } from '../setup';

// Tests pour les opérations CRUD sur les posts
export class PostsDbTest {
  private testUserId: string = '';

  async setup() {
    console.log('🚀 Setting up Posts DB tests...');
    
    // Créer un utilisateur de test
    const { user } = await testUtils.createTestUser();
    this.testUserId = user?.id || '';
    
    console.log(`✅ Test user created: ${this.testUserId}`);
  }

  async cleanup() {
    console.log('🧹 Cleaning up Posts DB tests...');
    
    // Nettoyer les données de test
    await testUtils.cleanupTestData(this.testUserId);
    
    // Se déconnecter
    await testUtils.logoutTestUser();
    
    console.log('✅ Cleanup completed');
  }

  async testCreatePost() {
    console.log('📝 Testing post creation...');
    
    const testPost: TestPost = {
      title: 'TEST_Post Creation',
      description: 'Test post for database operations',
      status: 'draft',
      platform: 'instagram',
      user_id: this.testUserId
    };

    try {
      const { data, error } = await testSupabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Post created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw error;
    }
  }

  async testReadPosts() {
    console.log('📖 Testing posts retrieval...');
    
    try {
      const { data, error } = await testSupabase
        .from('posts')
        .select('*')
        .eq('user_id', this.testUserId)
        .like('title', 'TEST_%');

      if (error) throw error;

      console.log(`✅ Retrieved ${data.length} test posts`);
      return data;
    } catch (error) {
      console.error('❌ Error reading posts:', error);
      throw error;
    }
  }

  async testUpdatePost(postId: string) {
    console.log('✏️ Testing post update...');
    
    const updates = {
      title: 'TEST_Updated Post Title',
      status: 'published' as const,
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await testSupabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .eq('user_id', this.testUserId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Post updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating post:', error);
      throw error;
    }
  }

  async testDeletePost(postId: string) {
    console.log('🗑️ Testing post deletion...');
    
    try {
      const { error } = await testSupabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', this.testUserId);

      if (error) throw error;

      console.log('✅ Post deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      throw error;
    }
  }

  async testPostFiltering() {
    console.log('🔍 Testing post filtering...');
    
    // Créer plusieurs posts de test avec différents statuts
    const testPosts: TestPost[] = [
      {
        title: 'TEST_Draft Post',
        description: 'Draft post',
        status: 'draft',
        platform: 'instagram',
        user_id: this.testUserId
      },
      {
        title: 'TEST_Published Post',
        description: 'Published post',
        status: 'published',
        platform: 'facebook',
        user_id: this.testUserId
      }
    ];

    try {
      // Insérer les posts
      const { data: insertedPosts, error: insertError } = await testSupabase
        .from('posts')
        .insert(testPosts)
        .select();

      if (insertError) throw insertError;

      // Tester le filtrage par statut
      const { data: draftPosts, error: filterError } = await testSupabase
        .from('posts')
        .select('*')
        .eq('user_id', this.testUserId)
        .eq('status', 'draft')
        .like('title', 'TEST_%');

      if (filterError) throw filterError;

      console.log(`✅ Filtering test passed: found ${draftPosts.length} draft posts`);
      return { insertedPosts, draftPosts };
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
      const createdPost = await this.testCreatePost();
      
      // Test de lecture
      await this.testReadPosts();
      
      // Test de mise à jour
      await this.testUpdatePost(createdPost.id);
      
      // Test de filtrage
      await this.testPostFiltering();
      
      // Test de suppression
      await this.testDeletePost(createdPost.id);
      
      console.log('🎉 All Posts DB tests passed!');
    } catch (error) {
      console.error('💥 Posts DB tests failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}