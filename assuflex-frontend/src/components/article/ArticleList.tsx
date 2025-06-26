"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArticleCard } from "./ArticleCard"
import { Pagination } from "./Pagination"
import { articleService } from "@/api/articleService"
import { ArticleDTO } from "@/types/Article"

export const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const articlesPerPage = 6
  const categories = ["Santé", "Assurance", "Finance", "Conseils", "Actualités"]

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await articleService.getAllArticles()
      setArticles(data)
    } catch (err) {
      setError("Impossible de charger les articles. Veuillez réessayer plus tard.")
      console.error("Erreur lors du chargement des articles:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.contenu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || article.categorie === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchArticles}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Articles</h1>
            <p className="text-gray-600">Découvrez nos dernières actualités et conseils</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Rechercher par titre ou contenu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Affichage de {currentArticles.length} sur {filteredArticles.length} articles
            </p>
            {filteredArticles.length > articlesPerPage && (
              <p className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </p>
            )}
          </div>

          {/* Articles Grid */}
          {currentArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600">Essayez d'ajuster vos critères de recherche ou revenez plus tard.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
