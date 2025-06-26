import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, FileText, Download, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDemandeById, rejeterDemande, ValidationDetailsDTO, validerDemande } from "@/api/gestionnaire"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"
import toast from 'react-hot-toast';
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"


export function ValidationDetail() {
  const { id } = useParams<{ id: string }>()
  const [demande, setDemande] = useState<ValidationDetailsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDemande = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getDemandeById(id)
        console.log(data)
        setDemande(data)
      } catch (error) {
        toast.error("Impossible de charger la demande. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchDemande()
  }, [id, toast])

  const handleValider = async () => {
    if (!id) return
    try {
      await validerDemande(id)
      toast.success("Demande validée avec succès.")
      navigate("/gestionnaire/validation")
    } catch (error) {
      toast.error("Impossible de valider la demande. Veuillez réessayer plus tard.")
    }
  }

  const handleRejeter = async () => {
    if (!id) return
    try {
     await rejeterDemande(id)
      toast.success("Demande rejetée avec succès.")
      navigate("/gestionnaire/validation")
    } catch (error) {
      toast.error("Impossible de rejeter la demande. Veuillez réessayer plus tard.")
    }
  }

 if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <DataTableSkeleton rows={5} columns={7} />
      </div>
    )
  }

  if (!demande) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Demande non trouvée</h2>
        <Button onClick={() => navigate("/gestionnaire/validation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux demandes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/gestionnaire/validation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Demande N° {demande.quoteId}</h2>
        <Badge
          variant="outline"
          className={
            demande.status === "en_attente"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
              : demande.status === "validée"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
          }
        >
          {demande.status === "en_attente" ? "En attente" : demande.status === "validée" ? "Validée" : "Rejetée"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
            <CardDescription>Détails du client ayant soumis la demande</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>{demande.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prénom</p>
                <p>{demande.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{demande.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p>{demande.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                <p>{new Date(demande.birthDate).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                <p>{demande.postalCode || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profession</p>
                <p>{demande.profession || "Non renseigné"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails de la demande */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la demande</CardTitle>
            <CardDescription>Informations sur la demande soumise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p>{demande.coverageOption || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de soumission</p>
                <p>{new Date(demande.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>Demande de contrat santé pour un adulte et deux enfants.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents fournis</CardTitle>
              <CardDescription>Documents téléversés par le client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demande.setDocuments && demande.setDocuments.length > 0 ? (
                  demande.setDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span>{doc.fileName}</span>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`http://localhost:8080/uploads/quotes/${demande.quoteId}/${doc.fileNameServer}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Télécharger</span>
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>Aucun document trouvé.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>Suivi des actions effectuées sur cette demande</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">Création de la demande</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(demande.createdAt).toLocaleDateString("fr-FR")} à{" "}
                      {new Date(demande.createdAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    Système
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir rejeter cette demande ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La demande sera marquée comme rejetée et le client en sera informé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRejeter}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Rejeter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Valider cette demande ?</AlertDialogTitle>
              <AlertDialogDescription>
                La demande sera marquée comme validée et le client en sera informé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleValider}>Valider</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}