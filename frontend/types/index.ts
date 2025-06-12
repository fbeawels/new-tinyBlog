// Base user interface
export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  avatar?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

// Post interfaces
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  is_visible: boolean
  created_at: string
  updated_at: string
  published_at?: string
  author_id: string
  category_id?: string
  tags: string[]
}

export interface PostWithDetails extends Omit<Post, 'author_id' | 'category_id' | 'tags'> {
  // Include the required fields from Post that were omitted
  author_id: string
  category_id?: string
  
  // Extended fields
  author: User
  category?: Category
  tags: Tag[]
  comments_count: number
}

// Category interfaces
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

// Tag interfaces
export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

// Comment interfaces
export interface Comment {
  id: string
  content: string
  is_visible: boolean
  created_at: string
  updated_at: string
  author_id: string
  post_id: string
  parent_id?: string
}

export interface CommentWithAuthor extends Omit<Comment, 'author_id'> {
  author: User
}

// DTOs
export interface LoginDTO {
  username: string
  password: string
}

export interface RegisterDTO {
  username: string
  email: string
  password: string
  full_name?: string
}

export interface PostCreateDTO {
  title: string
  content: string
  excerpt?: string
  featured_image?: string
  is_visible: boolean
  category_id?: string
  tags?: string[]
}

export interface PostUpdateDTO extends Partial<PostCreateDTO> {}

export interface CommentCreateDTO {
  content: string
  is_visible?: boolean
  post_id: string
  parent_id?: string
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

// Auth response
export interface AuthResponse {
  access_token: string
  token_type: string
}
