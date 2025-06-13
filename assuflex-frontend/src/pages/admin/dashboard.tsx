"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Shield, Activity, TrendingUp, Clock, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AdminStats, getAdminStats, ActivityItem } from "@/components/admin/admin"

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getAdminStats()
        setStats(data)
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

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "inscription":
        return <Users className="h-4 w-4 text-green-600" />
      case "connexion":
        return <Activity className="h-4 w-4 text-blue-600" />
      case "modification":
        return <Shield className="h-4 w-4 text-orange-600" />
      case "suppression":
        return <Clock className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityBadgeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "inscription":
        return "bg-green-100 text-green-800 border-green-200"
      case "connexion":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "modification":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "suppression":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erreur lors du chargement des données</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord administrateur</h2>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme ASSUFLEX</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUtilisateurs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.nouvellesInscriptions}</span> ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilisateursActifs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.utilisateursActifs / stats.totalUtilisateurs) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalClients / stats.totalUtilisateurs) * 100).toFixed(1)}% des utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestionnaires</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGestionnaires}</div>
            <p className="text-xs text-muted-foreground">{stats.totalAdmins} administrateurs</p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par rôles */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par rôles</CardTitle>
            <CardDescription>Distribution des utilisateurs par type de compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Clients</span>
              </div>
              <div className="text-sm font-medium">{stats.totalClients}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Gestionnaires</span>
              </div>
              <div className="text-sm font-medium">{stats.totalGestionnaires}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Intégrateurs</span>
              </div>
              <div className="text-sm font-medium">{stats.totalIntegrateurs}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Administrateurs</span>
              </div>
              <div className="text-sm font-medium">{stats.totalAdmins}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.activiteRecente.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.utilisateur}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={getActivityBadgeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Raccourcis vers les tâches administratives courantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Gérer les utilisateurs</p>
                <p className="text-sm text-muted-foreground">Voir tous les comptes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Voir les analyses</p>
                <p className="text-sm text-muted-foreground">Statistiques détaillées</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Paramètres système</p>
                <p className="text-sm text-muted-foreground">Configuration globale</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
