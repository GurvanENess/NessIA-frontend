import { ChatConversation } from "../entities/ChatTypes";

// Mock data for demonstration
const mockChats: ChatConversation[] = [
  {
    id: "chat-001",
    title: "Création post Collection Été 2024",
    lastMessage:
      "Parfait ! J'ai généré un post Instagram pour votre collection estivale avec des couleurs vibrantes. Le contenu met l'accent sur la fraîcheur et l'élégance de vos nouvelles pièces.",
    lastMessageDate: new Date("2024-01-17T14:30:00Z"),
    associatedPostId: "1",
    userId: "user-123",
    isActive: true,
    messageCount: 12,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-17T14:30:00Z"),
  },
  {
    id: "chat-002",
    title: "Stratégie promotion weekend",
    lastMessage:
      "J'ai préparé une campagne de promotion flash pour ce weekend. Le post Facebook est programmé avec un visuel accrocheur et un call-to-action efficace pour maximiser les conversions.",
    lastMessageDate: new Date("2024-01-16T16:45:00Z"),
    associatedPostId: "2",
    userId: "user-123",
    isActive: true,
    messageCount: 8,
    createdAt: new Date("2024-01-14T09:00:00Z"),
    updatedAt: new Date("2024-01-16T16:45:00Z"),
  },
  {
    id: "chat-003",
    title: "Tendances mode automne",
    lastMessage:
      "Nous avons exploré les tendances automne ensemble. Le brouillon TikTok capture parfaitement l'esprit cocooning de la saison avec des couleurs chaudes et des textures douillettes.",
    lastMessageDate: new Date("2024-01-16T11:20:00Z"),
    associatedPostId: "3",
    userId: "user-123",
    isActive: false,
    messageCount: 15,
    createdAt: new Date("2024-01-13T11:00:00Z"),
    updatedAt: new Date("2024-01-16T11:20:00Z"),
  },
  {
    id: "chat-004",
    title: "Behind the scenes studio",
    lastMessage:
      "Excellent ! Le post Instagram behind-the-scenes est maintenant publié. Les coulisses de votre séance photo vont captiver votre audience et renforcer l'authenticité de votre marque.",
    lastMessageDate: new Date("2024-01-15T16:15:00Z"),
    associatedPostId: "4",
    userId: "user-123",
    isActive: true,
    messageCount: 6,
    createdAt: new Date("2024-01-12T14:00:00Z"),
    updatedAt: new Date("2024-01-15T16:15:00Z"),
  },
  {
    id: "chat-005",
    title: "Conseils styling imprimés",
    lastMessage:
      "J'ai créé un guide complet sur le port des imprimés cette saison. Le contenu Twitter est prêt avec des conseils pratiques de vos stylistes pour engager votre communauté.",
    lastMessageDate: new Date("2024-01-14T10:30:00Z"),
    associatedPostId: "5",
    userId: "user-123",
    isActive: false,
    messageCount: 9,
    createdAt: new Date("2024-01-11T08:00:00Z"),
    updatedAt: new Date("2024-01-14T10:30:00Z"),
  },
  {
    id: "chat-006",
    title: "Brainstorming campagne printemps",
    lastMessage:
      "Nous avons exploré plusieurs concepts pour votre campagne printemps. J'ai quelques idées créatives à vous proposer pour des posts qui marqueront les esprits.",
    lastMessageDate: new Date("2024-01-13T09:15:00Z"),
    userId: "user-123",
    isActive: true,
    messageCount: 18,
    createdAt: new Date("2024-01-10T15:30:00Z"),
    updatedAt: new Date("2024-01-13T09:15:00Z"),
  },
  {
    id: "chat-007",
    title: "Optimisation engagement Instagram",
    lastMessage:
      "Analysons ensemble vos métriques Instagram. Je peux vous aider à créer du contenu plus engageant basé sur les préférences de votre audience.",
    lastMessageDate: new Date("2024-01-12T13:45:00Z"),
    userId: "user-123",
    isActive: false,
    messageCount: 11,
    createdAt: new Date("2024-01-09T11:20:00Z"),
    updatedAt: new Date("2024-01-12T13:45:00Z"),
  },
];

export class ChatsService {
  static async fetchUserChats(userId: string): Promise<ChatConversation[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, always return mock data regardless of userId
    // In real app, this would filter by actual userId
    return mockChats.sort(
      (a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime()
    );
  }

  static async deleteChat(chatId: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  static async archiveChat(chatId: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  static async fetchChatById(chatId: string): Promise<ChatConversation | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find chat in mock data
    const chat = mockChats.find((c) => c.id === chatId);
    return chat || null;
  }
}
