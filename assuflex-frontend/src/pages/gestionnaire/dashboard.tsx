import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import {
  BarChart,
  Users,
  ClipboardCheck,
  FileCodeIcon as FileContract,
  CreditCard,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { StatCard } from "../../components/gestionnaire/stat-card"
import { useToast } from "../../hooks/use-toast"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"
import { Alert, AlertDescription } from "@/components/ui/alert"

const QuoteSchema = z.object({
  quoteId: z.string().or(z.number()),
  username: z.string(),
  status: z.string(),
})

const TransactionSchema = z.object({
  client: z.string(),
  date: z.string(),
  amount: z.string(),
  status: z.string(),
})

const MoisDevisSchema = z.object({
  mois: z.string(),
  nombre: z.number(),
})

const DashboardStatsSchema = z.object({
  totalQuotes: z.number().default(0),
  totalContracts: z.number().default(0),
  totalClients: z.number().default(0),
  totalRevenue: z.number().default(0),
  totalTransactions: z.number().default(0),
  quotes: z.array(QuoteSchema).default([]),
  transactions: z.array(TransactionSchema).default([]),
  moisDevisDTOS: z.array(MoisDevisSchema).default([]),
})

type DashboardStats = z.infer<typeof DashboardStatsSchema>

const defaultStats: DashboardStats = {
  totalQuotes: 0,
  totalContracts: 0,
  totalClients: 0,
  totalRevenue: 0,
  totalTransactions: 0,
  quotes: [],
  transactions: [],
  moisDevisDTOS: [],
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      const response = await fetch('http://localhost:8080/api/v1/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée, veuillez vous reconnecter')
        }
        if (response.status === 403) {
          throw new Error('Accès non autorisé')
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const rawData = await response.json()
      
      const validatedData = DashboardStatsSchema.parse(rawData)
      
      setStats(validatedData)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      
      let errorMessage = 'Impossible de charger les statistiques'
      
      if (error instanceof z.ZodError) {
        errorMessage = 'Données invalides reçues du serveur'
        console.error('Validation errors:', error.errors)
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      setStats(defaultStats)
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleRefresh = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }, [])

  const getStatusBadgeColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'en_attente':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case 'completed':
      case 'termine':
      case 'paid':
      case 'paye':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case 'rejected':
      case 'refuse':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }, [])

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
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">Bienvenue sur votre espace de gestion AssurSanté Pro</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Demandes en attente"
          value={stats.totalQuotes}
          description="À traiter"
          icon={<ClipboardCheck className="h-4 w-4" />}
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
        />
        <StatCard
          title="Contrats actifs"
          value={stats.totalContracts}
          description="Total"
          icon={<FileContract className="h-4 w-4" />}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <StatCard
          title="Clients"
          value={stats.totalClients}
          description="Total"
          icon={<Users className="h-4 w-4" />}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <StatCard
          title="Revenus"
          value={formatCurrency(stats.totalRevenue / 100)}
          description="Ce mois-ci"
          icon={<CreditCard className="h-4 w-4" />}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Évolution des devis</CardTitle>
            <CardDescription>Nombre de devis générés par mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats.moisDevisDTOS.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={stats.moisDevisDTOS}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="nombre" fill="hsl(var(--primary))" />
                </ReBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Demandes récentes</CardTitle>
            <CardDescription>Les dernières demandes à traiter</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.quotes.length > 0 ? (
              <div className="space-y-4">
                {stats.quotes.slice(0, 5).map((quote) => (
                  <div
                    key={quote.quoteId}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/gestionnaire/validation/${quote.quoteId}`)}
                  >
                    <div className="flex flex-col"> 
                      <span className="font-medium">Client {quote.username}</span>
                      <span className="text-sm text-muted-foreground">Demande de contrat santé</span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(quote.status)}
                      >
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune demande récente</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/gestionnaire/validation")}>
              Voir toutes les demandes
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements récents</CardTitle>
            <CardDescription>Les derniers paiements reçus</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.transactions.length > 0 ? (
              <div className="space-y-4">
                {stats.transactions.slice(0, 5).map((transaction, index) => (
                  <div key={`${transaction.client}-${index}`} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex flex-col">
                      <span className="font-medium">Client {transaction.client}</span>
                      <span className="text-sm text-muted-foreground">{transaction.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(Number(transaction.amount) / 100)}</span>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun paiement récent</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/gestionnaire/paiements")}>
              Voir tous les paiements
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}