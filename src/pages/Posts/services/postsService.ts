import { Post } from '../entities/PostTypes';

// Mock data for demonstration
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always return mock data regardless of userId
    // In real app, this would filter by actual userId
    return mockPosts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async deletePost(postId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Post ${postId} deleted`);
  }

  static async updatePostStatus(postId: string, status: Post['status']): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Post ${postId} status updated to ${status}`);
  }
}