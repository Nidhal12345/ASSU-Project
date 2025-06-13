import type { Article, ArticleDTO } from "../types/Article"

const API_BASE_URL = "http://localhost:8080/api/v1/articles"

class ArticleService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getAllArticles(): Promise<ArticleDTO[]> {
    return this.fetchWithErrorHandling<ArticleDTO[]>(API_BASE_URL)
  }

  async getArticleById(id: number): Promise<Article> {
    return this.fetchWithErrorHandling<Article>(`${API_BASE_URL}/${id}`)
  }

  async createArticle(article: Omit<ArticleDTO, "id" | "createdAt">): Promise<Article> {
    return this.fetchWithErrorHandling<Article>(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(article),
    })
  }

  async updateArticle(id: number, article: Omit<ArticleDTO, "id" | "createdAt">): Promise<Article> {
    return this.fetchWithErrorHandling<Article>(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(article),
    })
  }

  async deleteArticle(id: number): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
  }
}

export const articleService = new ArticleService()
