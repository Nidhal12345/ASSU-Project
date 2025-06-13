"use client"

import { useState } from "react"
import { Save, Shield, Database, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminSettings() {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    // Simuler une sauvegarde
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Paramètres sauvegardés",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres administrateur</h2>
        <p className="text-muted-foreground">Configurez les paramètres globaux de la plateforme</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Configuration de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nom de la plateforme</Label>
                  <Input id="platform-name" defaultValue="ASSUFLEX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-url">URL de la plateforme</Label>
                  <Input id="platform-url" defaultValue="https://assuflex.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Description</Label>
                <Textarea id="platform-description" defaultValue="Plateforme de courtage d'assurance santé" rows={3} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Mode maintenance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="new-registrations" defaultChecked />
                <Label htmlFor="new-registrations">Autoriser les nouvelles inscriptions</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>Configuration de la sécurité et de l'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Délai d'expiration de session (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Tentatives de connexion max</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Authentification à deux facteurs obligatoire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="password-complexity" defaultChecked />
                <Label htmlFor="password-complexity">Exiger des mots de passe complexes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="audit-logs" defaultChecked />
                <Label htmlFor="audit-logs">Journalisation des actions administratives</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de notifications
              </CardTitle>
              <CardDescription>Configuration des notifications système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email administrateur principal</Label>
                <Input id="admin-email" type="email" defaultValue="admin@assuflex.com" />
              </div>
              <div className="space-y-4">
                <Label>Notifications par email</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-new-users" defaultChecked />
                    <Label htmlFor="notify-new-users">Nouvelles inscriptions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-errors" defaultChecked />
                    <Label htmlFor="notify-errors">Erreurs système</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-security" defaultChecked />
                    <Label htmlFor="notify-security">Alertes de sécurité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-maintenance" />
                    <Label htmlFor="notify-maintenance">Maintenance programmée</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Paramètres de base de données
              </CardTitle>
              <CardDescription>Configuration et maintenance de la base de données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence de sauvegarde</Label>
                  <Input id="backup-frequency" defaultValue="Quotidienne" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Période de rétention (jours)</Label>
                  <Input id="retention-period" type="number" defaultValue="90" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-backup" defaultChecked />
                <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="data-compression" defaultChecked />
                <Label htmlFor="data-compression">Compression des données</Label>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="mr-2">
                  <Database className="mr-2 h-4 w-4" />
                  Lancer une sauvegarde
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Optimiser la base
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
    </div>
  )
}
