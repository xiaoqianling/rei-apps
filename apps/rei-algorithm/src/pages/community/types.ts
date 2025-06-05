export interface CommunityUser {
  id: string;
  name: string;
  avatarUrl?: string; // Placeholder for avatar
}

export interface CommunityTag {
  id: string;
  name: string;
}

export interface PostPreview {
  id: string;
  title: string;
  author: CommunityUser;
  excerpt: string; // Short preview of the content
  tags: CommunityTag[];
  // category?: string; // Optional category
  createdAt: string; // ISO string format
  likes: number;
  commentsCount: number;
  // Optional: Placeholder for embedded visualization preview?
  // visualizationPreview?: string;
}

export interface UserProfileData extends CommunityUser {
  bio?: string;
  joinDate?: string;
  posts: PostPreview[];
  // Add other stats placeholders if needed
  postCount: number;
}

export interface ArticleData extends Omit<PostPreview, "excerpt"> {
  content: string; // Placeholder for Slate-rendered HTML or structured data
  // Potentially add other fields like read time, detailed stats etc.
  views?: number; // 阅读量
  dislikes?: number; // 点踩数
}

export interface CommentData {
  id: string;
  author: CommunityUser;
  content: string; // Simple text content for now
  createdAt: string; // ISO string format
  parentId?: string; // Optional: for nested comments
  // replies?: CommentData[]; // Optional: for nested comments later
}
