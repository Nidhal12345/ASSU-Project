import type React from "react"

import { useEffect, useState } from "react"
import { Download, Filter } from "lucide-react"
import { DataTable } from "../../components/client/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchClientPayments } from "@/api/paiment"

interface Payment { 
  id: string
  date: string
  amount: string
  status: string
  method: string
  contractId: string
}

export function ClientPaiements() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true)
        const data = (await fetchClientPayments()) as Payment[]
        setPayments(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos paiements",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [toast])

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Payment,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof Payment,
      cell: (payment: Payment) => new Date(payment.date).toLocaleDateString("fr-FR"),
    },
    {
      header: "Montant",
      accessorKey: "amount" as keyof Payment,
    },
    {
      header: "Méthode",
      accessorKey: "method" as keyof Payment,
    },
    {
      header: "Contrat",
      accessorKey: "contractId" as keyof Payment,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Payment,
      cell: (payment: Payment) => {
        const statusMap: Record<string, React.ReactNode> = {
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
          refusé: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Refusé
            </Badge>
          ),
        }
        return statusMap[payment.status] || payment.status
      },
    },

    // {
    //   header: "Actions",
    //   accessorKey: "actions",
    //   cell: (payment: Payment) => (
    //     <Button variant="ghost" size="icon">
    //       <Download className="h-4 w-4" />
    //       <span className="sr-only">Télécharger</span>
    //     </Button>
    //   ),
    // },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculer les statistiques
  const totalPayments = payments.length
  const paidPayments = payments.filter((p) => p.status === "payé").length
  const pendingPayments = payments.filter((p) => p.status === "en_attente").length
  const totalAmount = payments
    .filter((p) => p.status === "payé")
    .reduce((sum, p) => sum + Number.parseFloat(p.amount.replace(" €", "").replace(",", ".")), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mes paiements</h2>
          <p className="text-muted-foreground">Consultez l'historique de vos paiements</p>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paiements effectués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{paidPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Montant total payé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tous" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tous">Tous les paiements</TabsTrigger>
          <TabsTrigger value="payes">Payés</TabsTrigger>
          <TabsTrigger value="en_attente">En attente</TabsTrigger>
        </TabsList>
        <TabsContent value="tous">
          <DataTable
            data={payments}
            columns={columns}
            searchKey="id"
            onRowClick={(payment) => {
              toast({
                title: "Paiement sélectionné",
                description: `Référence: ${payment.id}`,
              })
            }}
          />
        </TabsContent>
        <TabsContent value="payes">
          <DataTable
            data={payments.filter((p) => p.status === "payé")}
            columns={columns}
            searchKey="id"
            onRowClick={(payment) => {
              toast({
                title: "Paiement sélectionné",
                description: `Référence: ${payment.id}`,
              })
            }}
          />
        </TabsContent>
        <TabsContent value="en_attente">
          <DataTable
            data={payments.filter((p) => p.status === "en_attente")}
            columns={columns}
            searchKey="id"
            onRowClick={(payment) => {
              toast({
                title: "Paiement sélectionné",
                description: `Référence: ${payment.id}`,
              })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
