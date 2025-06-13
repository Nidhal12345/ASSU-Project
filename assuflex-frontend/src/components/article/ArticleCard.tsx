import { ArticleDTO } from "@/types/Article"
import { stripHtml, truncateText } from "@/utils/helpers"
import type React from "react"
import { Link } from "react-router-dom"

interface ArticleCardProps {
  article: ArticleDTO
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  if (!article) {
    return null
  }

  const plainTextContent = stripHtml(article.contenu || "")
  const truncatedContent = truncateText(plainTextContent, 150)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {article.categorie || "Non classé"}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors">
          <Link to={`/articles/${article.id}`}>{article.titre || "Sans titre"}</Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{truncatedContent}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {article.datePublication}
          </div>

          <Link
            to={`/articles/${article.id}`}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Lire la suite →
          </Link>
        </div>

        {article.status && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span
              className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {article.status === "published" ? "Publié" : "Brouillon"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
