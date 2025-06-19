import { testSupabase, testUtils, TestPost } from '../setup';

describe('Posts Database Tests', () => {
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

  describe('Post Creation', () => {
    it('should create a new post successfully', async () => {
      const testPost: TestPost = {
        title: 'TEST_New Post',
        description: 'This is a test post',
        status: 'draft',
        platform: 'instagram',
        user_id: testUserId
      };

      const { data, error } = await testSupabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.title).toBe(testPost.title);
      expect(data.user_id).toBe(testUserId);
      expect(data.id).toBeDefined();
    });

    it('should reject post creation without required fields', async () => {
      const invalidPost = {
        description: 'Post without title',
        user_id: testUserId
      };

      const { data, error } = await testSupabase
        .from('posts')
        .insert([invalidPost])
        .select();

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should create post with all valid statuses', async () => {
      const statuses: TestPost['status'][] = ['draft', 'published', 'scheduled'];
      
      for (const status of statuses) {
        const testPost: TestPost = {
          title: `TEST_Post ${status}`,
          description: `Test post with ${status} status`,
          status,
          platform: 'instagram',
          user_id: testUserId
        };

        const { data, error } = await testSupabase
          .from('posts')
          .insert([testPost])
          .select()
          .single();

        expect(error).toBeNull();
        expect(data.status).toBe(status);
      }
    });
  });

  describe('Post Reading', () => {
    let createdPostId: string;

    beforeEach(async () => {
      // Créer un post pour les tests de lecture
      const testPost: TestPost = {
        title: 'TEST_Read Post',
        description: 'Post for reading tests',
        status: 'draft',
        platform: 'instagram',
        user_id: testUserId
      };

      const { data } = await testSupabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      createdPostId = data.id;
    });

    it('should retrieve posts by user ID', async () => {
      const { data, error } = await testSupabase
        .from('posts')
        .select('*')
        .eq('user_id', testUserId)
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should retrieve a specific post by ID', async () => {
      const { data, error } = await testSupabase
        .from('posts')
        .select('*')
        .eq('id', createdPostId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.id).toBe(createdPostId);
      expect(data.title).toBe('TEST_Read Post');
    });

    it('should filter posts by status', async () => {
      // Créer des posts avec différents statuts
      const posts: TestPost[] = [
        {
          title: 'TEST_Draft Post',
          description: 'Draft post',
          status: 'draft',
          platform: 'instagram',
          user_id: testUserId
        },
        {
          title: 'TEST_Published Post',
          description: 'Published post',
          status: 'published',
          platform: 'facebook',
          user_id: testUserId
        }
      ];

      await testSupabase.from('posts').insert(posts);

      // Tester le filtrage par statut
      const { data: draftPosts, error } = await testSupabase
        .from('posts')
        .select('*')
        .eq('user_id', testUserId)
        .eq('status', 'draft')
        .like('title', 'TEST_%');

      expect(error).toBeNull();
      expect(draftPosts.length).toBeGreaterThanOrEqual(2); // Au moins les 2 posts draft créés
      draftPosts.forEach(post => {
        expect(post.status).toBe('draft');
      });
    });

    it('should sort posts by creation date', async () => {
      const { data, error } = await testSupabase
        .from('posts')
        .select('*')
        .eq('user_id', testUserId)
        .like('title', 'TEST_%')
        .order('created_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      // Vérifier que les posts sont triés par date décroissante
      for (let i = 1; i < data.length; i++) {
        const currentDate = new Date(data[i].created_at);
        const previousDate = new Date(data[i - 1].created_at);
        expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
      }
    });
  });

  describe('Post Updates', () => {
    let postToUpdate: any;

    beforeEach(async () => {
      // Créer un post pour les tests de mise à jour
      const testPost: TestPost = {
        title: 'TEST_Update Post',
        description: 'Post for update tests',
        status: 'draft',
        platform: 'instagram',
        user_id: testUserId
      };

      const { data } = await testSupabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      postToUpdate = data;
    });

    it('should update post title and description', async () => {
      const updates = {
        title: 'TEST_Updated Title',
        description: 'Updated description',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await testSupabase
        .from('posts')
        .update(updates)
        .eq('id', postToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.title).toBe(updates.title);
      expect(data.description).toBe(updates.description);
      expect(data.id).toBe(postToUpdate.id);
    });

    it('should update post status', async () => {
      const { data, error } = await testSupabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', postToUpdate.id)
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.status).toBe('published');
    });

    it('should not update post from different user', async () => {
      // Créer un autre utilisateur
      const otherUser = await testUtils.createTestUser();
      
      const updates = {
        title: 'Unauthorized Update'
      };

      const { data, error } = await testSupabase
        .from('posts')
        .update(updates)
        .eq('id', postToUpdate.id)
        .eq('user_id', otherUser.user?.id) // Mauvais user_id
        .select();

      expect(data).toEqual([]); // Aucune ligne mise à jour
      
      // Nettoyer l'autre utilisateur
      await testUtils.cleanupTestData(otherUser.user?.id || '');
    });
  });

  describe('Post Deletion', () => {
    let postToDelete: any;

    beforeEach(async () => {
      // Créer un post pour les tests de suppression
      const testPost: TestPost = {
        title: 'TEST_Delete Post',
        description: 'Post for deletion tests',
        status: 'draft',
        platform: 'instagram',
        user_id: testUserId
      };

      const { data } = await testSupabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      postToDelete = data;
    });

    it('should delete a post successfully', async () => {
      const { error } = await testSupabase
        .from('posts')
        .delete()
        .eq('id', postToDelete.id)
        .eq('user_id', testUserId);

      expect(error).toBeNull();

      // Vérifier que le post a été supprimé
      const { data, error: selectError } = await testSupabase
        .from('posts')
        .select('*')
        .eq('id', postToDelete.id);

      expect(selectError).toBeNull();
      expect(data).toEqual([]);
    });

    it('should not delete post from different user', async () => {
      // Créer un autre utilisateur
      const otherUser = await testUtils.createTestUser();
      
      const { error } = await testSupabase
        .from('posts')
        .delete()
        .eq('id', postToDelete.id)
        .eq('user_id', otherUser.user?.id); // Mauvais user_id

      expect(error).toBeNull(); // Pas d'erreur, mais aucune suppression

      // Vérifier que le post existe toujours
      const { data } = await testSupabase
        .from('posts')
        .select('*')
        .eq('id', postToDelete.id);

      expect(data.length).toBe(1);
      
      // Nettoyer l'autre utilisateur
      await testUtils.cleanupTestData(otherUser.user?.id || '');
    });
  });

  describe('Post Validation', () => {
    it('should validate platform values', async () => {
      const platforms: TestPost['platform'][] = ['instagram', 'facebook', 'tiktok', 'twitter'];
      
      for (const platform of platforms) {
        const testPost: TestPost = {
          title: `TEST_${platform} Post`,
          description: `Post for ${platform}`,
          status: 'draft',
          platform,
          user_id: testUserId
        };

        const { data, error } = await testSupabase
          .from('posts')
          .insert([testPost])
          .select()
          .single();

        expect(error).toBeNull();
        expect(data.platform).toBe(platform);
      }
    });

    it('should validate status values', async () => {
      const statuses: TestPost['status'][] = ['draft', 'published', 'scheduled'];
      
      for (const status of statuses) {
        const testPost: TestPost = {
          title: `TEST_${status} Post`,
          description: `Post with ${status} status`,
          status,
          platform: 'instagram',
          user_id: testUserId
        };

        const { data, error } = await testSupabase
          .from('posts')
          .insert([testPost])
          .select()
          .single();

        expect(error).toBeNull();
        expect(data.status).toBe(status);
      }
    });
  });
});