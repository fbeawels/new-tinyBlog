import { api } from "./api"
import type { User, RegisterDTO } from "@/types"

interface TokenResponse {
  access_token: string
  token_type: string
}

export const authService = {
  /**
   * Login with username and password using OAuth2 password flow
   */
  async login(username: string, password: string): Promise<string> {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('grant_type', 'password')
    formData.append('scope', '')

    const response = await api.post<TokenResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
      }
    )
    
    const { access_token } = response.data
    localStorage.setItem("access_token", access_token)
    return access_token
  },

  /**
   * Register a new user
   */
  async register(data: RegisterDTO): Promise<void> {
    await api.post("/auth/register", data, {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
    })
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/users/me", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
    })
    return response.data
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem("access_token")
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    return !!localStorage.getItem("access_token");
  }
}
