"use client"

import { articleService } from "@/api/articleService"
import { Article } from "@/types/Article"
import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchArticle(Number.parseInt(id))
    }
  }, [id])

  const fetchArticle = async (articleId: number) => {
    try {
      setLoading(true)
      const data = await articleService.getArticleById(articleId)
      setArticle(data)
    } catch (err) {
      setError("Impossible de charger l'article. Veuillez réessayer plus tard.")
      console.error("Erreur lors du chargement de l'article:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
              <p className="text-red-600">{error || "Article introuvable"}</p>
              <div className="mt-4 space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Retour
                </button>
                <Link
                  to="/article"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block"
                >
                  Tous les articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Link
              to="/article"
              className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux articles
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                {article.categorie || "Non classé"}
              </span>
              {article.status && (
                <span
                  className={`ml-2 inline-block text-sm font-medium px-3 py-1 rounded-full ${
                    article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {article.status === "published" ? "Publié" : "Brouillon"}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.titre || "Sans titre"}</h1>

            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Publié le {article.datePublication}</span>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-500 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.contenu || "" }}
            />
          </article>

          {/* Article Actions */}
          <div className="mt-8 flex justify-between items-center">
            <Link
              to="/article"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Retour aux articles
            </Link>

            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Imprimer
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: article.titre || "Article",
                        url: window.location.href,
                      })
                      .catch(console.error)
                  } else {
                    navigator.clipboard.writeText(window.location.href).catch(console.error)
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
