import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/home/header"

interface ArticleDTO {
  id: number
  categorie: string
  titre: string
  contenu: string
  status: string
  datePublication: string
}

interface PaginationResponse {
  content: ArticleDTO[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

const ArticleCardSkeleton = () => (
  <Card className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 animate-pulse">
    <div className="aspect-[4/3] bg-gray-200">
      <Skeleton className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <Skeleton className="h-5 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <Skeleton className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  </Card>
)

const ArticlesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
)

const HeroSkeleton = () => (
  <div className="bg-gradient-to-r from-orange-300 to-green-300 text-white py-16 animate-pulse">
    <div className="container mx-auto px-4 text-center">
      <Skeleton className="h-10 w-96 mx-auto bg-white/20" />
    </div>
  </div>
)

const BreadcrumbSkeleton = () => (
  <div className="container mx-auto px-4 py-4 animate-pulse">
    <div className="flex items-center space-x-2">
      <Skeleton className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <span className="text-gray-300">›</span>
      <Skeleton className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  </div>
)

const SubtitleSkeleton = () => (
  <div className="container mx-auto px-4 mb-8 animate-pulse">
    <Skeleton className="h-6 w-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
  </div>
)

const PaginationSkeleton = () => (
  <div className="flex justify-center items-center space-x-4 animate-pulse">
    <Skeleton className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    <div className="flex space-x-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      ))}
    </div>
    <Skeleton className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
  </div>
)

export default function ArticlesPage() {
  const [articles, setArticles] = useState<PaginationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`http://localhost:8080/api/v1/articles/pagination?page=${page}&size=9`)
      setArticles(response.data)
    } catch (err) {
      setError("Erreur lors du chargement des articles")
      console.error("Error fetching articles:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getUnsplashImage = (index: number) => {
    const imageIds = [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop", // Healthcare
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
    ]
    return imageIds[index % imageIds.length]
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Les actualités de l'assurance</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchArticles(currentPage)} className="bg-orange-500 hover:bg-orange-600 text-white">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <HeroSkeleton />
      ) : (
        <>
                  <Header></Header>
        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16 pt-2">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Les actualités de l'assurance</h1>
          </div>
        </div>
        </>
      )}

      {loading ? (
        <BreadcrumbSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="text-orange-600 hover:underline">
              Comparateur assurance
            </Link>
            <span className="mx-2">›</span>
            <span>Actualités</span>
          </nav>
        </div>
      )}

      {loading ? (
        <SubtitleSkeleton />
      ) : (
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-xl text-gray-700">Les actualités analysées par un expert</h2>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16">
        {loading ? (
          <ArticlesSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {articles?.content.map((article, index) => (
                <Card
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group"
                >
                  <Link to={`/articles/${article.id}`}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                      <img
                        src={getUnsplashImage(index) || "/placeholder.svg"}
                        alt={article.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500 mb-2 font-medium">
                        {formatDate(article.datePublication)}
                      </div>
                      <h3 className="text-green-700 font-semibold text-base leading-tight group-hover:text-green-800 transition-colors duration-200 line-clamp-2">
                        {article.titre}
                      </h3>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {articles && articles.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Button>

                <div className="flex space-x-2">
                  {[...Array(Math.min(articles.totalPages, 5))].map((_, index) => {
                    let pageIndex = index
                    if (articles.totalPages > 5) {
                      if (currentPage < 3) {
                        pageIndex = index
                      } else if (currentPage > articles.totalPages - 3) {
                        pageIndex = articles.totalPages - 5 + index
                      } else {
                        pageIndex = currentPage - 2 + index
                      }
                    }

                    return (
                      <Button
                        key={pageIndex}
                        variant={currentPage === pageIndex ? "default" : "outline"}
                        onClick={() => handlePageChange(pageIndex)}
                        className={
                          currentPage === pageIndex
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-10 h-10 shadow-lg"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 w-10 h-10 transition-all duration-200"
                        }
                      >
                        {pageIndex + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={articles.last}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="mt-12">
            <PaginationSkeleton />
          </div>
        )}
      </div>
    </div>
  )
}
