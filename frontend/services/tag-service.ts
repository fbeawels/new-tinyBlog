import { api } from "./api"

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export const tagService = {
  async getTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>("/tags/")
    return response.data
  },

  async getTagById(id: string): Promise<Tag> {
    const response = await api.get<Tag>(`/tags/${id}`)
    return response.data
  },

  async createTag(data: Omit<Tag, 'id' | 'created_at' | 'updated_at'>): Promise<Tag> {
    const response = await api.post<Tag>("/tags/", data)
    return response.data
  },

  async updateTag(id: string, data: Partial<Tag>): Promise<Tag> {
    const response = await api.put<Tag>(`/tags/${id}`, data)
    return response.data
  },

  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`)
  }
}
