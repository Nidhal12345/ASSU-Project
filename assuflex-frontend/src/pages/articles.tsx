import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Header } from "../components/home/header"
import Footer from "../components/shared/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Calendar, ArrowRight, Filter } from "lucide-react"

interface Article {
  id: string
  title: string
  content: string
  category: string
  image?: string
  author: string
  date: string
  readTime: string
}

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [currentPage, selectedCategory, searchTerm])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "9")

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (selectedCategory) {
        params.append("category", selectedCategory)
      }

      const response = await axios.get(`/api/articles`)

      setArticles(response.data.articles)
      setTotalPages(response.data.totalPages || 1)
      setError(null)
    } catch (err) {
      console.error("Error fetching articles:", err)
      setError("Impossible de charger les articles. Veuillez réessayer plus tard.")

      setArticles([
        {
          id: "1",
          title: "Les bienfaits d'une alimentation équilibrée",
          content: "Une alimentation équilibrée est essentielle pour maintenir une bonne santé...",
          category: "nutrition",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Sophie Martin",
          date: "2023-05-15",
          readTime: "5 min",
        },
        {
          id: "2",
          title: "Comment améliorer votre sommeil naturellement",
          content: "Un bon sommeil est crucial pour votre santé physique et mentale...",
          category: "bien-etre",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Thomas Dubois",
          date: "2023-05-10",
          readTime: "7 min",
        },
        {
          id: "3",
          title: "Prévention des maladies cardiovasculaires",
          content: "Les maladies cardiovasculaires sont la première cause de mortalité...",
          category: "prevention",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Marie Lefevre",
          date: "2023-05-05",
          readTime: "8 min",
        },
        {
          id: "4",
          title: "L'importance de l'activité physique régulière",
          content: "L'exercice régulier est essentiel pour maintenir une bonne santé...",
          category: "bien-etre",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Jean Dupont",
          date: "2023-04-28",
          readTime: "6 min",
        },
        {
          id: "5",
          title: "Gérer le stress au quotidien",
          content: "Le stress chronique peut avoir des effets néfastes sur votre santé...",
          category: "bien-etre",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Claire Bernard",
          date: "2023-04-20",
          readTime: "5 min",
        },
        {
          id: "6",
          title: "Les vaccins essentiels pour les adultes",
          content: "La vaccination n'est pas seulement pour les enfants...",
          category: "prevention",
          image: "/placeholder.svg?height=200&width=400",
          author: "Dr. Philippe Moreau",
          date: "2023-04-15",
          readTime: "7 min",
        },
      ])
      setTotalPages(3)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchArticles()
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "nutrition":
        return "Nutrition"
      case "bien-etre":
        return "Bien-être"
      case "prevention":
        return "Prévention"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "nutrition":
        return "bg-green-100 text-green-800"
      case "bien-etre":
        return "bg-blue-100 text-blue-800"
      case "prevention":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Articles Santé</h1>
            <p className="text-xl max-w-2xl">
              Découvrez nos articles rédigés par des professionnels de la santé pour vous aider à prendre soin de votre
              bien-être.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <form onSubmit={handleSearch} className="w-full md:w-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter size={18} className="text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="bien-etre">Bien-être</SelectItem>
                    <SelectItem value="prevention">Prévention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchArticles}>Réessayer</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <img
                          src={article.image || "/placeholder.svg?height=200&width=400"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded ${getCategoryColor(article.category)}`}
                          >
                            {getCategoryLabel(article.category)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(article.date)}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold hover:text-blue-600 transition-colors">
                          <Link to={`/articles/${article.id}`}>{article.title}</Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-600 line-clamp-3">{article.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div className="text-sm text-gray-500">{article.readTime} de lecture</div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/articles/${article.id}`}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            Lire plus <ArrowRight size={16} className="ml-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ArticlesPage
