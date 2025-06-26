import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Editor } from "@tinymce/tinymce-react"
import toast from "react-hot-toast"

export function NouvelArticle() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    categorie: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire"
    }

    if (!formData.contenu.trim() || formData.contenu === "<p></p>") {
      newErrors.contenu = "Le contenu est obligatoire"
    }

    if (!formData.categorie) {
      newErrors.categorie = "La catégorie est obligatoire"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8080/api/v1/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          titre: formData.titre,
          contenu: formData.contenu,
          categorie: formData.categorie,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la publication")
      }

      toast.success("Article publié avec succès !")

      navigate("/admin/articles")
    } catch (error) {
      toast.error("Erreur lors de la publication de l'article")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, contenu: content })
    if (errors.contenu && content.trim() && content !== "<p></p>") {
      setErrors({ ...errors, contenu: "" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/integrateur/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nouvel Article Santé</h2>
          <p className="text-muted-foreground">Créez un nouvel article informatif pour vos clients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-2xl shadow-md border-0">
          <CardHeader>
            <CardTitle>Informations de l'article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de l'article *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Les bienfaits d'une alimentation équilibrée"
                className={errors.titre ? "border-red-500" : ""}
              />
              {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger className={errors.categorie ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="prevention">Prévention</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="bien-etre">Bien-être</SelectItem>
                </SelectContent>
              </Select>
              {errors.categorie && <p className="text-sm text-red-500">{errors.categorie}</p>}
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
              <div className={errors.contenu ? "border border-red-500 rounded-lg" : "rounded-lg overflow-hidden"}>
                <Editor
                  apiKey="70dpnm94z5s4n98l0s33zcvzrkgjt6ia3em73vgl75gyrs7g"
                  value={formData.contenu}
                  onEditorChange={handleContentChange}
                  init={{
                    height: 400,
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
                      .dark body {
                        color: #f3f4f6;
                        background-color: #1f2937;
                      }
                    `,
                    skin: "oxide",
                    content_css: "default",
                    placeholder: "Rédigez votre article ici...",
                    branding: false,
                    resize: false,
                    statusbar: false,
                    setup: (editor) => {
                      editor.on("init", () => {
                        const isDark = document.documentElement.classList.contains("dark")
                        if (isDark) {
                          editor.dom.setStyle(editor.getBody(), "background-color", "#1f2937")
                          editor.dom.setStyle(editor.getBody(), "color", "#f3f4f6")
                        }
                      })
                    },
                  }}
                />
              </div>
              {errors.contenu && <p className="text-sm text-red-500">{errors.contenu}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <div className="flex gap-2">
          </div>
          <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
            {isSubmitting ? "Publication..." : "Publier l'article"}
          </Button>
        </div>
      </form>
    </div>
  )
}
