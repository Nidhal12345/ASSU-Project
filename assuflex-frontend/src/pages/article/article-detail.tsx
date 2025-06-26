"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"

interface ArticleDTO {
  id: number
  categorie: string
  titre: string
  contenu: string
  status: string
  datePublication: string
}

const HeroSkeleton = () => (
  <div className="bg-gradient-to-r from-orange-300 to-green-300 text-white py-8 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="flex items-center space-x-2 mb-4 opacity-70">
        <Skeleton className="h-4 w-32 bg-white/20" />
        <span className="text-white/50">›</span>
        <Skeleton className="h-4 w-20 bg-white/20" />
        <span className="text-white/50">›</span>
        <Skeleton className="h-4 w-16 bg-white/20" />
      </div>
      <Skeleton className="h-8 w-96 bg-white/20" />
    </div>
  </div>
)

const ArticleDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-9 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <Skeleton className="h-6 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <Skeleton className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>

      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
    </div>

    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-4">
      {[...Array(15)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${i % 4 === 3 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>

    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
      <Skeleton className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <Skeleton className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  </div>
)

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<ArticleDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`http://localhost:8080/api/v1/articles/${id}`)
        setArticle(response.data)
      } catch (err) {
        setError("Article non trouvé")
        console.error("Error fetching article:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.titre,
          text: `Découvrez cet article: ${article?.titre}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatContent = (content: string) => {
    if (content.includes("<") && content.includes(">")) {
      return (
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    return content.split("\n").map(
      (paragraph, index) =>
        paragraph.trim() && (
          <p key={index} className="mb-6 leading-relaxed text-gray-700 text-lg">
            {paragraph}
          </p>
        ),
    )
  }

  const getArticleImage = () => {
    return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeroSkeleton />
        <div className="container mx-auto px-4 py-12">
          <ArticleDetailSkeleton />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Article non trouvé</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Link to="/articles">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Tous les articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-4 opacity-90">
            <Link to="/" className="hover:underline transition-all duration-200">
              Comparateur assurance
            </Link>
            <span className="mx-2">›</span>
            <Link to="/articles" className="hover:underline transition-all duration-200">
              Actualités
            </Link>
            <span className="mx-2">›</span>
            <span>Article</span>
          </nav>
          <h1 className="text-3xl font-bold">{article.titre}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-green-100 text-green-700 border-green-200 text-sm font-medium px-3 py-1 hover:bg-green-200 transition-colors duration-200">
                {article.categorie}
              </Badge>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(article.datePublication)}</span>
              </div>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>

            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8 group">
              <img
                src={getArticleImage() || "/placeholder.svg"}
                alt={article.titre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8 hover:shadow-md transition-shadow duration-300">
            <div className="prose prose-lg max-w-none">{formatContent(article.contenu)}</div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Link to="/articles">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Tous les articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
