import { useEffect, useState } from "react"
import { Filter } from "lucide-react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { getPaiements, type Paiement } from "@/api/paiment"
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

export function Paiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        setLoading(true)
        setPaiements(await getPaiements())
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les paiements",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPaiements()
  }, [toast])

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Paiement,
    },
    {
      header: "ID Client",
      accessorKey: "clientId" as keyof Paiement,
    },
    {
      header: "Nom de Client",
      accessorKey: "client" as keyof Paiement,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof Paiement,
    },
    {
      header: "Montant",
      accessorKey: "montant" as keyof Paiement,
      cell: (paiement: Paiement) => `${paiement.montant.toFixed(2)} €`,
    },
    {
      header: "Méthode",
      accessorKey: "methode" as keyof Paiement,
    },
    {
      header: "Statut",
      accessorKey: "statut" as keyof Paiement,
      cell: (paiement: Paiement) => {
        const statusMap = {
          payé: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Payé
            </Badge>
          ),
          en_attente: (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              En attente
            </Badge>
          ),
          échoué: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Échoué
            </Badge>
          ),
        }
        return statusMap[paiement.statut]
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
          <h2 className="text-2xl font-bold tracking-tight">Paiements</h2>
          <p className="text-muted-foreground">Suivez tous les paiements clients</p>
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
              <DropdownMenuItem>Payés</DropdownMenuItem>
              <DropdownMenuItem>En attente</DropdownMenuItem>
              <DropdownMenuItem>Échoués</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        data={paiements}
        columns={columns}
        searchKey="client"
        onRowClick={(paiement) => {
          toast({
            title: "Paiement sélectionné",
            description: `Référence: ${paiement.id}`,
          })
        }}
      />
    </div>
  )
}
