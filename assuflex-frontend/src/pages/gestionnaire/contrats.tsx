"use client"

import { useEffect, useState } from "react"
import { Filter } from "lucide-react"
import axios from "axios"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { fetchAllContracts } from "@/api/api"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

interface Contrat {
  id: string
  type: string
  startDate: string
  endDate: string
  status: string
  price: number
  coverage: string
  documents: string
  clientName: string
  clotureRequested: boolean
}

export function Contrats() {
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [loading, setLoading] = useState(true)
  const [validatingCloture, setValidatingCloture] = useState<string | null>(null)
  const [rejectingCloture, setRejectingCloture] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContrats = async () => {
      try {
        setLoading(true)
        const Contracts = (await fetchAllContracts()) as Contrat[]
        setContrats(Contracts)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les contrats",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContrats()
  }, [toast])

  const handleValiderCloture = async (contractId: string) => {
    try {
      setValidatingCloture(contractId)
      await axios.post(
        `http://localhost:8080/api/v1/contracts/${contractId}/valider-cloture`,
        {}, // corps de la requête vide ici
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        },
      )

      setContrats((prevContrats) =>
        prevContrats.map((contrat) =>
          contrat.id === contractId ? { ...contrat, status: "CLOTURE", clotureRequested: false } : contrat,
        ),
      )

      toast({
        title: "Clôture validée",
        description: "Le contrat a été clôturé avec succès",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de valider la clôture du contrat",
      })
    } finally {
      setValidatingCloture(null)
    }
  }

  const handleRejeterCloture = async (contractId: string) => {
    try {
      setRejectingCloture(contractId)
      await axios.post(
        `http://localhost:8080/api/v1/contracts/${contractId}/rejeter-cloture`,
        {}, // corps de la requête vide ici
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        },
      )

      setContrats((prevContrats) =>
        prevContrats.map((contrat) => (contrat.id === contractId ? { ...contrat, clotureRequested: false } : contrat)),
      )

      toast({
        title: "Demande rejetée",
        description: "La demande de clôture a été rejetée",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejeter la demande de clôture",
      })
    } finally {
      setRejectingCloture(null)
    }
  }

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Contrat,
    },
    {
      header: "Client",
      accessorKey: "clientName" as keyof Contrat,
    },
    {
      header: "Type",
      accessorKey: "type" as keyof Contrat,
    },
    {
      header: "Date début",
      accessorKey: "dateDebut" as keyof Contrat,
      cell: (contrat: Contrat) => new Date(contrat.startDate).toLocaleDateString("fr-FR"),
    },
    {
      header: "Date fin",
      accessorKey: "dateFin" as keyof Contrat,
      cell: (contrat: Contrat) => new Date(contrat.endDate).toLocaleDateString("fr-FR"),
    },
    {
      header: "Montant",
      accessorKey: "montant" as keyof Contrat,
      cell: (contrat: Contrat) => `${Number(contrat.price).toFixed(2)} €`,
    },
    {
      header: "Statut",
      accessorKey: "statut" as keyof Contrat,
      cell: (contrat: Contrat) => {
        const statusMap = {
          EN_COURS: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Actif
            </Badge>
          ),
          CLOTURE: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Résilié
            </Badge>
          ),
        }
        return statusMap[contrat.status as keyof typeof statusMap]
      },
    },
    {
      header: "État de clôture",
      accessorKey: "clotureRequested" as keyof Contrat,
      cell: (contrat: Contrat) => {
        if (contrat.status === "CLOTURE") {
          return (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
            >
              Clôturé
            </Badge>
          )
        }

        if (contrat.clotureRequested && contrat.status === "EN_COURS") {
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleValiderCloture(contrat.id)}
                disabled={validatingCloture === contrat.id || rejectingCloture === contrat.id}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {validatingCloture === contrat.id ? "Validation..." : "Valider"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRejeterCloture(contrat.id)}
                disabled={validatingCloture === contrat.id || rejectingCloture === contrat.id}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                {rejectingCloture === contrat.id ? "Rejet..." : "Rejeter"}
              </Button>
            </div>
          )
        }

        return <span className="text-sm text-muted-foreground">Aucune demande</span>
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
          <h2 className="text-2xl font-bold tracking-tight">Contrats</h2>
          <p className="text-muted-foreground">Gérez tous les contrats clients en cours</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tous</DropdownMenuItem>
              <DropdownMenuItem>Actifs</DropdownMenuItem>
              <DropdownMenuItem>Résiliés</DropdownMenuItem>
              <DropdownMenuItem>En attente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        data={contrats}
        columns={columns}
        searchKey="clientName"
        onRowClick={(contrat) => {
          toast({
            title: "Contrat sélectionné",
            description: `Référence: ${contrat.id}`,
          })
        }}
      />
    </div>
  )
}
