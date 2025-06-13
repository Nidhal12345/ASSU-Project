import { useEffect, useState } from "react"
import { Filter, UserPlus } from "lucide-react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { getClients, type Client } from "@/api/gestionnaire"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setClients(await getClients())
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les clients",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [toast])

  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof Client,
    },
    {
      header: "Nom",
      accessorKey: "nom" as keyof Client,
    },
    {
      header: "Prénom",
      accessorKey: "prenom" as keyof Client,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Client,
    },
    {
      header: "Téléphone",
      accessorKey: "telephone" as keyof Client,
    },
    {
      header: "Date d'inscription",
      accessorKey: "dateInscription" as keyof Client,
      cell: (client: Client) => new Date(client.dateInscription).toLocaleDateString("fr-FR"),
    },
    {
      header: "Contrats",
      accessorKey: "contrats" as keyof Client,
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
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">Gérez votre base de clients</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tous</DropdownMenuItem>
              <DropdownMenuItem>Avec contrats</DropdownMenuItem>
              <DropdownMenuItem>Sans contrat</DropdownMenuItem>
              <DropdownMenuItem>Nouveaux (30 jours)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        searchKey="email"
        onRowClick={(client) => {
          toast({
            title: "Client sélectionné",
            description: `${client.prenom} ${client.nom}`,
          })
        }}
      />
    </div>
  )
}
