"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Filter } from "lucide-react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { getClaims, type Claim } from "../../api/claims"
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

export function ClientSinistres() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true)
        setClaims(await getClaims())
      } catch (error) {
        toast.error("Impossible de charger vos sinistres. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [toast])

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Claim,
    },
    {
      header: "Date incident",
      accessorKey: "incidentDate" as keyof Claim,
      cell: (claim: Claim) => {
        const date = new Date(claim.incidentDate)
        return date.toLocaleDateString("fr-FR")
      },
    },
    {
      header: "Type",
      accessorKey: "claimType" as keyof Claim,
    },
    {
      header: "Contrat",
      accessorKey: "contractNumber" as keyof Claim,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Claim,
      cell: (claim: Claim) => {
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
          <h2 className="text-2xl font-bold tracking-tight">Mes sinistres</h2>
          <p className="text-muted-foreground">Consultez et gérez vos déclarations de sinistres</p>
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
          <Button onClick={() => navigate("/client/sinistre/nouveau")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau sinistre
          </Button>
        </div>
      </div>

      <DataTable
        data={claims}
        columns={columns}
        searchKey="contractNumber"
      />
    </div>
  )
}
