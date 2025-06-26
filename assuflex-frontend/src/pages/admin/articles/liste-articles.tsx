"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable } from "../../../components/gestionnaire/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components";

interface Article {
  id: string;
  titre: string;
  categorie: "prevention" | "nutrition" | "bien-etre";
  datePublication: string;
  statut: "publié" | "brouillon";
}

export function ListeArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getJwtToken = (): string | null => {
    return localStorage.getItem("jwtToken");
  };

  const mapStatusToStatut = (statusFromApi: string): "publié" | "brouillon" => {
    if (!statusFromApi) return "brouillon";
    const normalized = statusFromApi.toLowerCase();
    if (normalized === "published" || normalized === "publié") {
      return "publié";
    }
    return "brouillon";
  };

  const getCategorieLabel = (categorie: string) => {
    const labels: Record<string, string> = {
      prevention: "Prévention",
      nutrition: "Nutrition",
      "bien-etre": "Bien-être",
    };
    return labels[categorie] || categorie;
  };

  const getCategorieColor = (categorie: string) => {
    const colors: Record<string, string> = {
      prevention:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      nutrition:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "bien-etre":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[categorie] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const token = getJwtToken();

      if (!token) {
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Aucun jeton JWT trouvé. Vous devez être connecté.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8080/api/v1/articles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const dataFromApi = response.data as Array<{
          id: string;
          categorie: string;
          titre: string;
          status: string;
          datePublication: string;
        }>;

        const mapped: Article[] = dataFromApi.map((item) => ({
          id: item.id,
          titre: item.titre,
          categorie: item.categorie as
            | "prevention"
            | "nutrition"
            | "bien-etre",
          datePublication: item.datePublication.split("T")[0],
          statut: mapStatusToStatut(item.status),
        }));

        setArticles(mapped);
        console.log("Articles récupérés:", mapped);
      } catch (error: any) {
        console.error("Erreur fetchArticles:", error);
        toast({
          variant: "destructive",
          title: "Erreur lors du chargement",
          description:
            "Impossible de récupérer les articles depuis le serveur.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  const handleDelete = async (id: string) => {
    const token = getJwtToken();

    if (!token) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Aucun jeton JWT trouvé. Vous devez être connecté.",
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setArticles((prev) => prev.filter((article) => article.id !== id));

      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur handleDelete:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors de la suppression",
        description: "Impossible de supprimer cet article.",
      });
    }
  };

  const columns = [
    {
      header: "Titre",
      accessorKey: "titre" as keyof Article,
      cell: (article: Article) => (
        <div>
          <div className="font-medium">{article.titre}</div>
        </div>
      ),
    },
    {
      header: "Catégorie",
      accessorKey: "categorie" as keyof Article,
      cell: (article: Article) => (
        <Badge
          variant="outline"
          className={getCategorieColor(article.categorie)}
        >
          {getCategorieLabel(article.categorie)}
        </Badge>
      ),
    },
    {
      header: "Date de publication",
      accessorKey: "datePublication" as keyof Article,
      cell: (article: Article) =>
        new Date(article.datePublication).toLocaleDateString("fr-FR"),
    },
    {
      header: "Statut",
      accessorKey: "statut" as keyof Article,
      cell: (article: Article) => (
        <Badge
          variant="outline"
          className={
            article.statut === "publié"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          }
        >
          {article.statut === "publié" ? "Publié" : "Brouillon"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof Article,
      cell: (article: Article) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/admin/articles/${article.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cet article ? Cette action
                  est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(article.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <DataTableSkeleton rows={5} columns={7} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Articles Santé</h2>
          <p className="text-muted-foreground">
            Gérez tous vos articles informatifs
          </p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link to="/admin/articles/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Article
          </Link>
        </Button>
      </div>

      <DataTable data={articles} columns={columns} searchKey="titre" />
    </div>
  );
}
