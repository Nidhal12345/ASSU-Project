import { useEffect, useState } from "react"
import { DataTable } from "../../components/gestionnaire/data-table"
import { useToast } from "../../hooks/use-toast"
import { getDevis, type Devis as DevisType } from "@/api/gestionnaire"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

export function Devis() {
  const [devis, setDevis] = useState<DevisType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        setLoading(true)
        setDevis(await getDevis())
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les devis",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDevis()
  }, [toast])

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof DevisType,
    },
    {
      header: "Client",
      accessorKey: "client" as keyof DevisType,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof DevisType,
      cell: (devis: DevisType) => new Date(devis.date).toLocaleDateString("fr-FR"),
    },
    {
      header: "Montant Anuelle",
      accessorKey: "amount" as keyof DevisType,
      cell: (devis: DevisType) => `${devis.amount.toFixed(2)} €`,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof DevisType,
      cell: (devis: DevisType) => {
        const statusMap = {
          en_attente: (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              En attente
            </Badge>
          ),
          accepté: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Accepté
            </Badge>
          ),
          refusé: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Refusé
            </Badge>
          ),
        }
        return statusMap[devis.status]
      },
    },
    // {
    //   header: "Actions",
    //   accessorKey: "actions",
    //   cell: (devis: DevisType) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" size="icon">
    //           <FileText className="h-4 w-4" />
    //           <span className="sr-only">Actions</span>
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end" className="bg-background">
    //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //           <Download className="mr-2 h-4 w-4" />
    //           <span>Télécharger</span>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem>
    //           <FileText className="mr-2 h-4 w-4" />
    //           <span>Voir les détails</span>
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <DataTableSkeleton rows={5} columns={7} />
      </div>
    )
  }

  const totalDevis = devis.length
  const devisEnAttente = devis.filter((d) => d.status === "en_attente").length
  const devisAcceptes = devis.filter((d) => d.status === "accepté").length
  const devisRefuses = devis.filter((d) => d.status === "refusé").length
  const montantTotal = devis.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Devis</h2>
          <p className="text-muted-foreground">Gérez tous vos devis clients en un seul endroit</p>
        </div>
        {/* <div className="flex gap-2">
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
              <DropdownMenuItem>Acceptés</DropdownMenuItem>
              <DropdownMenuItem>Refusés</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevis}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{devisEnAttente}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{devisAcceptes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{montantTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tous" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tous">Tous les devis</TabsTrigger>
          <TabsTrigger value="en_attente">En attente</TabsTrigger>
          <TabsTrigger value="acceptes">Acceptés</TabsTrigger>
          <TabsTrigger value="refuses">Refusés</TabsTrigger>
        </TabsList>
        <TabsContent value="tous">
          <DataTable
            data={devis}
            columns={columns}
            searchKey="client"
            onRowClick={(devis) => {
              toast({
                title: "Devis sélectionné",
                description: `Référence: ${devis.id}`,
              })
            }}
          />
        </TabsContent>
        <TabsContent value="en_attente">
          <DataTable
            data={devis.filter((d) => d.status === "en_attente")}
            columns={columns}
            searchKey="client"
            onRowClick={(devis) => {
              toast({
                title: "Devis sélectionné",
                description: `Référence: ${devis.id}`,
              })
            }}
          />
        </TabsContent>
        <TabsContent value="acceptes">
          <DataTable
            data={devis.filter((d) => d.status === "accepté")}
            columns={columns}
            searchKey="client"
            onRowClick={(devis) => {
              toast({
                title: "Devis sélectionné",
                description: `Référence: ${devis.id}`,
              })
            }}
          />
        </TabsContent>
        <TabsContent value="refuses">
          <DataTable
            data={devis.filter((d) => d.status === "refusé")}
            columns={columns}
            searchKey="client"
            onRowClick={(devis) => {
              toast({
                title: "Devis sélectionné",
                description: `Référence: ${devis.id}`,
              })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
