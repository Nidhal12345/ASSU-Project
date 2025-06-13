"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "../../hooks/use-toast"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function Analyses() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Dans un environnement réel, nous utiliserions getStats()
        // Simulons des données pour la démonstration
        const mockStats = {
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
            { statut: "Validées", nombre: 28, color: "#10b981" },
            { statut: "En attente", nombre: 10, color: "#f59e0b" },
            { statut: "Rejetées", nombre: 4, color: "#ef4444" },
          ],
          contratsParType: [
            { type: "Santé individuelle", nombre: 45 },
            { type: "Santé famille", nombre: 32 },
            { type: "Santé senior", nombre: 21 },
          ],
          paiementsParMois: [
            { mois: "Jan", montant: 12500 },
            { mois: "Fév", montant: 15200 },
            { mois: "Mar", montant: 18100 },
            { mois: "Avr", montant: 14300 },
            { mois: "Mai", montant: 22500 },
            { mois: "Juin", montant: 19800 },
            { mois: "Juil", montant: 23100 },
            { mois: "Août", montant: 25400 },
            { mois: "Sept", montant: 8200 },
          ],
          tauxConversion: [
            { mois: "Jan", taux: 65 },
            { mois: "Fév", taux: 68 },
            { mois: "Mar", taux: 72 },
            { mois: "Avr", taux: 70 },
            { mois: "Mai", taux: 75 },
            { mois: "Juin", taux: 78 },
            { mois: "Juil", taux: 80 },
            { mois: "Août", taux: 82 },
            { mois: "Sept", taux: 79 },
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analyses</h2>
        <p className="text-muted-foreground">Visualisez les performances et tendances de votre activité</p>
      </div>

      <Tabs defaultValue="devis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devis">Devis</TabsTrigger>
          <TabsTrigger value="demandes">Demandes</TabsTrigger>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="devis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des devis</CardTitle>
                <CardDescription>Nombre de devis générés par mois</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.devisParMois}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nombre" fill="hsl(var(--primary))" name="Nombre de devis" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de conversion</CardTitle>
                <CardDescription>Pourcentage de devis convertis en contrats</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.tauxConversion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="taux"
                      stroke="hsl(var(--primary))"
                      name="Taux de conversion (%)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demandes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des demandes</CardTitle>
                <CardDescription>Distribution des demandes par statut</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.demandesParStatut}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="nombre"
                      label={({ statut, percent }) => `${statut} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.demandesParStatut.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temps de traitement</CardTitle>
                <CardDescription>Temps moyen de traitement des demandes (jours)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { type: "Santé individuelle", temps: 2.3 },
                      { type: "Santé famille", temps: 3.1 },
                      { type: "Santé senior", temps: 2.8 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="temps" fill="hsl(var(--accent))" name="Temps (jours)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contrats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contrats par type</CardTitle>
                <CardDescription>Répartition des contrats par type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.contratsParType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="nombre"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--accent))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Durée des contrats</CardTitle>
                <CardDescription>Durée moyenne des contrats par type (mois)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { type: "Santé individuelle", duree: 18 },
                      { type: "Santé famille", duree: 24 },
                      { type: "Santé senior", duree: 30 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duree" fill="hsl(var(--primary))" name="Durée (mois)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paiements" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Paiements par mois</CardTitle>
                <CardDescription>Montant total des paiements par mois</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.paiementsParMois}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "Montant"]} />
                    <Legend />
                    <Bar dataKey="montant" fill="hsl(var(--primary))" name="Montant (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>Répartition des méthodes de paiement utilisées</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { methode: "Carte bancaire", nombre: 65 },
                        { methode: "Prélèvement", nombre: 30 },
                        { methode: "Virement", nombre: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="nombre"
                      label={({ methode, percent }) => `${methode} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--accent))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
