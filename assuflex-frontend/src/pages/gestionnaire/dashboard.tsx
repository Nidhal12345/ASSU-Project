"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  FileText,
  Users,
  ClipboardCheck,
  FileCodeIcon as FileContract,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
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
  LineChart,
  Line,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Dans un environnement réel, nous utiliserions getStats()
        // Simulons des données pour la démonstration
        const mockStats = {
          totalDevis: 156,
          totalDemandes: 42,
          totalContratsActifs: 98,
          totalClients: 124,
          totalPaiements: 203,
          tauxValidation: 78,
          devisParMois: [
            { mois: "Jan", nombre: 12 },
            { mois: "Fév", nombre: 15 },
            { mois: "Mar", nombre: 18 },
            { mois: "Avr", nombre: 14 },
            { mois: "Mai", nombre: 22 },
            { mois: "Juin", nombre: 19 },
            { mois: "Juil", nombre: 23 },
            { mois: "Août", nombre: 25 },
            { mois: "Sept", nombre: 8 },
          ],
          demandesParStatut: [
            { statut: "Validées", nombre: 28 },
            { statut: "En attente", nombre: 10 },
            { statut: "Rejetées", nombre: 4 },
          ],
          performanceMensuelle: [
            { mois: "Jan", contrats: 8, revenus: 12000 },
            { mois: "Fév", contrats: 12, revenus: 15000 },
            { mois: "Mar", contrats: 15, revenus: 18000 },
            { mois: "Avr", contrats: 10, revenus: 14000 },
            { mois: "Mai", contrats: 18, revenus: 22000 },
            { mois: "Juin", contrats: 14, revenus: 19000 },
            { mois: "Juil", contrats: 20, revenus: 23000 },
            { mois: "Août", contrats: 22, revenus: 25000 },
            { mois: "Sept", contrats: 6, revenus: 8000 },
          ],
        }
        setStats(mockStats)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les statistiques",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Exporter les rapports
          </Button>
          <Button size="sm">Actualiser</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Devis"
          value={stats.totalDevis}
          description="Ce mois-ci"
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
        <StatCard
          title="Demandes en attente"
          value={stats.totalDemandes}
          description="À traiter"
          icon={<ClipboardCheck className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
        />
        <StatCard
          title="Contrats actifs"
          value={stats.totalContratsActifs}
          description="Total"
          icon={<FileContract className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <StatCard
          title="Clients"
          value={stats.totalClients}
          description="Total"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <StatCard
          title="Paiements"
          value={`${stats.totalPaiements}`}
          description="Ce mois-ci"
          icon={<CreditCard className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900"
        />
        <StatCard
          title="Taux de validation"
          value={`${stats.tauxValidation}%`}
          description="Demandes validées"
          icon={<BarChart className="h-4 w-4" />}
          trend={{ value: 2, isPositive: true }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
            <CardDescription>Évolution des contrats et revenus</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.performanceMensuelle}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="contrats"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  name="Contrats"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenus"
                  stroke="hsl(var(--accent))"
                  name="Revenus (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Évolution des devis</CardTitle>
            <CardDescription>Nombre de devis générés par mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={stats.devisParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="nombre" fill="hsl(var(--primary))" />
              </ReBarChart>
            </ResponsiveContainer>
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
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/validation/${i}`)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Client {i}</span>
                    <span className="text-sm text-muted-foreground">Demande de contrat santé</span>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    >
                      En attente
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/validation")}>
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
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex flex-col">
                    <span className="font-medium">Client {i}</span>
                    <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{120 + i * 50}€</span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Payé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/paiements")}>
              Voir tous les paiements
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
