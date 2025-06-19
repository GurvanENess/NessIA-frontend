import { Post, PostStatus, PostPlatform } from '../entities/PostTypes';
import { supabaseClient } from '../../../shared/services/supabase';

// Interface representing the raw data structure returned by Supabase
interface RawSupabasePostData {
  id: string;
  title: string;
  content_text: string;
  created_at: string;
  status: string;
  platform: {
    name: string;
  };
  updated_at?: string;
  scheduled_at?: string;
  published_at?: string;
  image_url?: string;
  user_id?: string;
  associated_chat_id?: string;
}

// Mapping function to convert Supabase data to Post entity
const mapSupabasePostToPostEntity = (rawPost: RawSupabasePostData): Post => {
  // Map platform name to PostPlatform enum
  const mapPlatformName = (platformName: string): PostPlatform => {
    const normalizedName = platformName.toLowerCase();
    switch (normalizedName) {
      case 'instagram':
        return 'instagram';
      case 'facebook':
        return 'facebook';
      case 'tiktok':
        return 'tiktok';
      case 'twitter':
        return 'twitter';
      default:
        return 'instagram'; // Default fallback
    }
  };

  // Map status string to PostStatus enum
  const mapStatus = (status: string): PostStatus => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'published':
        return 'published';
      case 'scheduled':
        return 'scheduled';
      case 'draft':
        return 'draft';
      default:
        return 'draft'; // Default fallback
    }
  };

  return {
    id: rawPost.id,
    title: rawPost.title,
    description: rawPost.content_text,
    status: mapStatus(rawPost.status),
    platform: mapPlatformName(rawPost.platform.name),
    associatedChatId: rawPost.associated_chat_id,
    createdAt: new Date(rawPost.created_at),
    updatedAt: rawPost.updated_at ? new Date(rawPost.updated_at) : undefined,
    scheduledAt: rawPost.scheduled_at ? new Date(rawPost.scheduled_at) : undefined,
    publishedAt: rawPost.published_at ? new Date(rawPost.published_at) : undefined,
    imageUrl: rawPost.image_url,
    userId: rawPost.user_id || 'unknown'
  };
};

// Mock data for demonstration (keeping as fallback)
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Collection Été 2024',
    description: 'Découvrez notre nouvelle collection estivale avec des couleurs vibrantes et des matières légères.',
    status: 'published',
    platform: 'instagram',
    associatedChatId: 'chat-001',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
    publishedAt: new Date('2024-01-15T14:20:00Z'),
    imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    userId: 'user-123'
  },
  {
    id: '2',
    title: 'Promotion Flash Weekend',
    description: 'Profitez de -30% sur tous nos articles ce weekend seulement !',
    status: 'scheduled',
    platform: 'facebook',
    associatedChatId: 'chat-002',
    createdAt: new Date('2024-01-14T09:15:00Z'),
    updatedAt: new Date('2024-01-14T16:45:00Z'),
    scheduledAt: new Date('2024-01-20T08:00:00Z'),
    imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    userId: 'user-123'
  },
  {
    id: '3',
    title: 'Tendances Mode Automne',
    description: 'Les couleurs chaudes et les textures douillettes sont à l\'honneur cette saison.',
    status: 'draft',
    platform: 'tiktok',
    associatedChatId: 'chat-003',
    createdAt: new Date('2024-01-13T11:20:00Z'),
    updatedAt: new Date('2024-01-16T13:10:00Z'),
    imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    userId: 'user-123'
  },
  {
    id: '4',
    title: 'Behind the Scenes',
    description: 'Découvrez les coulisses de notre dernière séance photo en studio.',
    status: 'published',
    platform: 'instagram',
    associatedChatId: 'chat-004',
    createdAt: new Date('2024-01-12T14:30:00Z'),
    updatedAt: new Date('2024-01-12T16:15:00Z'),
    publishedAt: new Date('2024-01-12T16:15:00Z'),
    imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
    userId: 'user-123'
  },
  {
    id: '5',
    title: 'Conseils Styling',
    description: 'Comment porter les imprimés cette saison ? Nos stylistes vous donnent leurs meilleurs conseils.',
    status: 'draft',
    platform: 'twitter',
    associatedChatId: 'chat-005',
    createdAt: new Date('2024-01-11T08:45:00Z'),
    updatedAt: new Date('2024-01-17T10:30:00Z'),
    imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    userId: 'user-123'
  }
];

export class PostsService {
  static async fetchUserPosts(userId: string): Promise<Post[]> {
    try {
      // Fetch posts from Supabase
      const { data, error } = await supabaseClient
        .from('post')
        .select(`
          id,
          title,
          content_text,
          created_at,
          status,
          updated_at,
          scheduled_at,
          published_at,
          image_url,
          user_id,
          associated_chat_id,
          platform(
            name
          )
        `)
        .eq('company_id', 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No posts found in Supabase, returning mock data');
        return mockPosts;
      }

      // Map the raw Supabase data to Post entities
      const mappedPosts = data.map(mapSupabasePostToPostEntity);
      return mappedPosts;

    } catch (error) {
      console.error('Error fetching posts from Supabase:', error);
      // Fallback to mock data in case of error
      console.log('Falling back to mock data');
      return mockPosts;
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      const { error } = await supabaseClient
        .from('post')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Post ${postId} deleted (mock)`);
    }
  }

  static async updatePostStatus(postId: string, status: Post['status']): Promise<void> {
    try {
      const { error } = await supabaseClient
        .from('post')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Post ${postId} status updated to ${status} (mock)`);
    }
  }
}