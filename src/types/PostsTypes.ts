interface InstagramPost {
  id: string;
  medias: string[];
  caption: string;
  hashtags: string[];
  status: "draft" | "scheduled" | "published";
  createdAt: Date;
  updatedAt: Date;
  scheduledAt: Date;
  scheduledTime: Date;
}
