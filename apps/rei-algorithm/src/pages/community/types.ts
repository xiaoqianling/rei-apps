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