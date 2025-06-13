"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClaimById, updateClaimStatus, type Claim } from "@/api/claims"
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
import toast from "react-hot-toast"

export function SinistreDetail() {
  const { id } = useParams<{ id: string }>()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClaim = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getClaimById(id)
        setClaim(data)
      } catch (error) {
        toast.error("Impossible de charger le sinistre. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchClaim()
  }, [id])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return
    try {
      await updateClaimStatus(id, newStatus)
      toast.success(`Statut mis à jour: ${newStatus}`)
      if (claim) {
        setClaim({ ...claim, status: newStatus as any })
      }
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Sinistre non trouvé</h2>
        <Button onClick={() => navigate("/gestionnaire/sinistres")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux sinistres
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, React.ReactNode> = {
      SUBMITTED: (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
        >
          En attente
        </Badge>
      ),
      IN_PROGRESS: (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          En cours
        </Badge>
      ),
      RESOLVED: (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          Traité
        </Badge>
      ),
      REJECTED: (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
        >
          Rejeté
        </Badge>
      ),
    }
    return statusMap[status] || claim.status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/gestionnaire/sinistre")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Sinistre N° {claim.id}</h2>
        {getStatusBadge(claim.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du sinistre</CardTitle>
            <CardDescription>Détails de la déclaration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Numéro de contrat</p>
                <p>{claim.contractNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type de sinistre</p>
                <p>{claim.claimType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de l'incident</p>
                <p>{new Date(claim.incidentDate).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de déclaration</p>
                <p>{new Date(claim.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="mt-1">{claim.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Informations du déclarant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>{claim.contactName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{claim.contactEmail}</p>
              </div>
              {claim.contactPhone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p>{claim.contactPhone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Mettre en cours
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mettre le sinistre en cours de traitement ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le statut du sinistre sera mis à jour et le client en sera informé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleStatusUpdate("IN_PROGRESS")}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rejeter ce sinistre ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action marquera le sinistre comme rejeté. Le client en sera informé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusUpdate("REJECTED")}
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
              Traiter
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Marquer comme traité ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le sinistre sera marqué comme traité et le client en sera informé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleStatusUpdate("RESOLVED")}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
