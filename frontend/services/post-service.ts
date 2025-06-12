import { api } from "./api"
import type { Post, PostUpdateDTO, PostWithDetails } from "@/types/post"

export interface PostCreateDTO {
  title: string
  content: string
  category_id: string
  tags: string[]
  is_visible: boolean
  author_id: string
  created_at: string
  updated_at: string
  slug: string
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

interface GetPostsParams {
  page?: number
  limit?: number
  categoryId?: string
  tagId?: string
  authorId?: string
  search?: string
  includeInvisible?: boolean
}

export const postService = {
  /**
   * Get paginated list of posts with optional filters
   */
  async getPosts({
    page = 1,
    limit = 10,
    categoryId,
    tagId,
    authorId,
    search,
    includeInvisible = false,
  }: GetPostsParams = {}): Promise<PaginatedResponse<PostWithDetails>> {
    const params = new URLSearchParams({
      skip: String((page - 1) * limit),
      limit: String(limit),
      include_invisible: String(includeInvisible),
    })

    if (categoryId) params.append('category_id', categoryId)
    if (tagId) params.append('tag_id', tagId)
    if (authorId) params.append('author_id', authorId)
    if (search) params.append('search', search)

    try {
      const response = await api.get<PostWithDetails[]>("/posts/")
      
      // Transform the response to match our pagination interface
      // Note: In a real app, the backend should return pagination metadata
      return {
        items: response.data,
        total: response.data.length,
        page,
        pages: Math.ceil(response.data.length / limit),
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      // Return empty paginated response on error
      return {
        items: [],
        total: 0,
        page,
        pages: 0,
      }
    }
  },

  /**
   * Get a single post by ID
   */
  async getPostById(id: string): Promise<PostWithDetails> {
    const response = await api.get<PostWithDetails>(`/posts/${id}`)
    return response.data
  },

  /**
   * Create a new post
   */
  async createPost(data: PostCreateDTO): Promise<PostWithDetails> {
    const response = await api.post<PostWithDetails>("/posts/", data)
    return response.data
  },

  /**
   * Update an existing post
   */
  async updatePost(id: string, data: PostUpdateDTO): Promise<PostWithDetails> {
    const response = await api.put<PostWithDetails>(`/posts/${id}`, data)
    return response.data
  },

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`)
  },

  /**
   * Toggle post visibility
   */
  async toggleVisibility(id: string, isVisible: boolean): Promise<PostWithDetails> {
    const response = await api.patch<PostWithDetails>(`/posts/${id}/visibility`, { is_visible: isVisible })
    return response.data
  },
}
