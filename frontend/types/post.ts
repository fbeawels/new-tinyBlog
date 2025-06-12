export interface PostCreateDTO {
  title: string;
  content: string;
  category_id: string;
  tags: string[];
  is_visible: boolean;
}

export interface PostUpdateDTO extends Partial<PostCreateDTO> {}

export interface Post extends PostCreateDTO {
  id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
}

export interface PostWithDetails extends Post {
  author_name: string;
  category_name: string;
  comment_count: number;
  tags_info: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}
