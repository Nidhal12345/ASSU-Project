import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { Editor } from "@tinymce/tinymce-react"
import toast from "react-hot-toast"
import { ClickLimitButton } from "@/components/ui/click-limit-button"

interface ArticleFormData {
id?: String
  titre: string
  contenu: string
  categorie: string
}

export function AdminArticleEditPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ArticleFormData>({
    titre: "",
    contenu: "",
    categorie: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
      fetchArticle()
      setLoading(false)
  }, [id])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await axios.get(`http://localhost:8080/api/v1/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const article = response.data
      setFormData({
        titre: article.titre,
        contenu: article.contenu,
        categorie: article.categorie,
      })
    } catch (error) {
      toast.error("Impossible de charger l'article")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titre.trim()) {
      newErrors.title = "Le titre est obligatoire"
    }

    if (!formData.contenu.trim() || formData.contenu === "<p></p>") {
      newErrors.content = "Le contenu est obligatoire"
    }

    if (!formData.categorie) {
      newErrors.category = "La catégorie est obligatoire"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published" = "draft") => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('jwtToken')
      const payload = {
        titre: formData.titre,
        contenu: formData.contenu,
        categorie: formData.categorie,
        status,
      }

      if (id === "new") {
        await axios.post("http://localhost:8080/api/v1/articles", payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        toast.success(`L'article a été ${status === "published" ? "publié" : "sauvegardé en brouillon"}`)
      } else {
        await axios.put(`http://localhost:8080/api/v1/articles/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        toast.success("L'article a été modifié avec succès")
      }
    } catch (error) {
      toast.error("Impossible de sauvegarder l'article")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, contenu: content })
    if (errors.content && content.trim() && content !== "<p></p>") {
      setErrors({ ...errors, content: "" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {id === "new" ? "Nouvel Article" : "Modifier l'Article"}
          </h2>
          <p className="text-muted-foreground">
            {id === "new" ? "Créez un nouvel article de santé" : "Modifiez les informations de l'article"}
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
        <Card className="rounded-2xl shadow-md border-0">
          <CardHeader>
            <CardTitle>Informations de l'article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'article *</Label>
              <Input
                id="title"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Les bienfaits d'une alimentation équilibrée"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prevention">Prévention</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="bien-etre">Bien-être</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-0">
          <CardHeader>
            <CardTitle>Contenu de l'article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contenu *</Label>
              <div className={errors.content ? "border border-red-500 rounded-lg" : "rounded-lg overflow-hidden"}>
                <Editor
                  apiKey="7gcj6t2qugemkm9assm3qha3xlo33okor59hqh7ve3igsimx"
                  value={formData.contenu}
                  onEditorChange={handleContentChange}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style: `
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                        font-size: 14px;
                        line-height: 1.6;
                        color: #374151;
                      }
                    `,
                    placeholder: "Rédigez votre article ici...",
                    branding: false,
                    resize: false,
                    statusbar: false,
                  }}
                />
              </div>
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <ClickLimitButton
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              maxClicks={3}
              limitMessage="Veuillez patienter avant de sauvegarder à nouveau"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder en brouillon
            </ClickLimitButton>
            <ClickLimitButton
              type="button"
              variant="outline"
              maxClicks={2}
              limitMessage="Veuillez patienter avant de prévisualiser à nouveau"
            >
              <Eye className="mr-2 h-4 w-4" />
              Aperçu
            </ClickLimitButton>
          </div>
          <ClickLimitButton
            type="button"
            onClick={(e) => handleSubmit(e, "published")}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600"
            maxClicks={2}
            limitMessage="Veuillez patienter avant de publier à nouveau"
          >
            {isSubmitting ? "Publication..." : "Publier l'article"}
          </ClickLimitButton>
        </div>
      </form>
    </div>
  )
}

export default AdminArticleEditPage
