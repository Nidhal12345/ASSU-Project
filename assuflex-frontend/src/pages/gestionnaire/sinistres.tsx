"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, Trash2 } from "lucide-react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { getAllClaims, type Claim } from "@/api/claims"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { deleteClaim } from "@/api/api"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

export function GestionnaireSinistres() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true)
        setClaims(await getAllClaims())
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les sinistres",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [toast])

  const handleDelete = async (claim: Claim) => {
    try {
      await deleteClaim(claim.id)
      setClaims(claims.filter(c => c.id !== claim.id))
      toast({
        title: "Succès",
        description: "Le sinistre a été supprimé avec succès",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le sinistre",
      })
    }
  }

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Claim,
    },
    {
      header: "Numéro de contrat",
      accessorKey: "contractNumber" as keyof Claim,
    },
    {
      header: "Date de l'incident",
      accessorKey: "incidentDate" as keyof Claim,
      cell: (claim: Claim) => {
        const date = new Date(claim.incidentDate)
        return date.toLocaleDateString("fr-FR")
      },
    },
    {
      header: "Type de sinistre",
      accessorKey: "claimType" as keyof Claim,
    },
    {
      header: "Nom du contact",
      accessorKey: "contactName" as keyof Claim,
    },
    {
      header: "Email",
      accessorKey: "contactEmail" as keyof Claim,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Claim,
      cell: (claim: Claim) => {
        const statusMap = {
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
        return statusMap[claim.status] || claim.status
      },
    },
    {
      header: "Date création",
      accessorKey: "createdAt" as keyof Claim,
      cell: (claim: Claim) => {
        const date = new Date(claim.createdAt)
        return date.toLocaleDateString("fr-FR")
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (claim: Claim) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce sinistre ? Cette action est irréversible.
                  <br />
                  <strong>Référence:</strong> {claim.id}
                  <br />
                  <strong>Contrat:</strong> {claim.contractNumber}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(claim)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

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
          <h2 className="text-2xl font-bold tracking-tight">Gestion des sinistres</h2>
          <p className="text-muted-foreground">Consultez et traitez les déclarations de sinistres clients</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tous</DropdownMenuItem>
              <DropdownMenuItem>En attente</DropdownMenuItem>
              <DropdownMenuItem>En cours</DropdownMenuItem>
              <DropdownMenuItem>Traités</DropdownMenuItem>
              <DropdownMenuItem>Rejetés</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        data={claims}
        columns={columns}
        searchKey="contractNumber"
        onRowClick={(claim) => navigate(`/gestionnaire/sinistre/${claim.id}`)}
      />
    </div>
  )
}