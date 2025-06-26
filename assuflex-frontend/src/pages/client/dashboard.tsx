import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  FileCodeIcon as FileContract,
  ClipboardCheck,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchClientProfile } from "@/api/api"
import { StatCard } from "../../components/client/stat-card"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

interface ClientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  pendingQuotes: number
  activeContracts: number
  totalPaid: string
}

export function ClientDashboard() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const data = (await fetchClientProfile()) as ClientProfile
        setProfile(data)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
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
          <h2 className="text-3xl font-bold tracking-tight">Bienvenue, {profile?.firstName}</h2>
          <p className="text-muted-foreground">Voici un aperçu de votre espace santé</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Voir mes rapports
          </Button>
          <Button size="sm">Actualiser</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Contrats actifs"
          value={profile?.activeContracts || 0}
          description="En cours"
          icon={<FileContract className="h-4 w-4" />}
          trend={{ value: 0, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <StatCard
          title="Demandes en attente"
          value={profile?.pendingQuotes || 0}
          description="À suivre"
          icon={<ClipboardCheck className="h-4 w-4" />}
          trend={{ value: 1, isPositive: true }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
        />
        <StatCard
          title="Total payé"
          value={profile?.totalPaid || "0,00 €"}
          description="Cette année"
          icon={<CreditCard className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mes contrats</CardTitle>
            <CardDescription>Vos contrats d'assurance santé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                <div className="flex flex-col">
                  <span className="font-medium">Santé Famille Premium</span>
                  <span className="text-sm text-muted-foreground">CONT2025-012</span>
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Actif
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/client/contrats">
                Voir tous mes contrats
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements récents</CardTitle>
            <CardDescription>Vos derniers paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex flex-col">
                  <span className="font-medium">Santé Famille Premium</span>
                  <span className="text-sm text-muted-foreground">01/05/2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">125,00 €</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Payé
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex flex-col">
                  <span className="font-medium">Santé Famille Premium</span>
                  <span className="text-sm text-muted-foreground">01/04/2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">125,00 €</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Payé
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/client/paiements">
                Voir tous mes paiements
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
