"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter } from "lucide-react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { getDemandes, type Demande } from "@/api/gestionnaire"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function Validation() {
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true)
         setDemandes(await getDemandes())
         console.log(demandes)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les demandes",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDemandes()
  }, [toast])

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Demande,
    },
    {
      header: "Client",
      accessorKey: "clientName" as keyof Demande,
    },
    {
      header: "Date",
      accessorKey: "createDate" as keyof Demande,
cell: (demande: Demande) => {
  const date = demande.createDate;

  const parsedDate = date ? new Date(date) : null;
  console.log(date)

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return "Date invalide";
  }

  return parsedDate.toLocaleDateString('fr-FR');
}    },
    {
      header: "numéro de contrat",
      accessorKey: "phoneNumber" as keyof Demande,
    },
    {
      header: "Documents",
      accessorKey: "documents" as keyof Demande,
      cell: (demande: Demande) => demande.documentNumber,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Demande,
      cell: (demande: Demande) => {
        const statusMap = {
          en_attente: (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              En attente
            </Badge>
          ),
          validée: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Validée
            </Badge>
          ),
          Rejetée: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Rejetée
            </Badge>
          ),
        }
        console.log(demande.status)
        return statusMap[demande.status]
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Validation</h2>
          <p className="text-muted-foreground">Gérez les demandes clients en attente de validation</p>
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
              <DropdownMenuItem>Validées</DropdownMenuItem>
              <DropdownMenuItem>Rejetées</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        data={demandes}
        columns={columns}
        searchKey="clientName"
        onRowClick={(demande) => navigate(`/gestionnaire/validation/${demande.id}`)}
      />
    </div>
  )
}
