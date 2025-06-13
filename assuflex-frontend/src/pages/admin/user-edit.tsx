import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, UserUpdateData, getUserById, updateUser, deleteUser } from "@/components/admin/admin"

export function AdminUserEdit() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserUpdateData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getUserById(id)
        console.log(data)
        setUser(data)
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          role: data.role,
          statut: data.statut,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données de l'utilisateur",
        })
        navigate("/admin/users")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, toast, navigate])

  const handleSave = async () => {
    if (!id || !user) return
    try {
      setSaving(true)
      await updateUser(id, formData)
      toast({
        title: "Utilisateur mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      })
      navigate("/admin/users")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteUser(id)
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      })
      navigate("/admin/users")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; className: string }> = {
      ROLE_CLIENT: { label: "Client", className: "bg-blue-100 text-blue-800 border-blue-200" },
      ROLE_GESTIONNAIRE: { label: "Gestionnaire", className: "bg-green-100 text-green-800 border-green-200" },
      ROLE_ADMIN: { label: "Administrateur", className: "bg-red-100 text-red-800 border-red-200" },
      ROLE_INTEGRATEUR: { label: "Intégrateur", className: "bg-purple-100 text-purple-800 border-purple-200" },
    }
    const roleInfo = roleMap[role] || { label: role, className: "bg-gray-100 text-gray-800 border-gray-200" }
    return (
      <Badge variant="outline" className={roleInfo.className}>
        {roleInfo.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Utilisateur non trouvé</h2>
        <Button onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux utilisateurs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Modifier l'utilisateur: {user.prenom} {user.nom}
        </h2>
        {getRoleBadge(user.role)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Modifiez les informations de base de l'utilisateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom || ""}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom || ""}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone || ""}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres du compte */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du compte</CardTitle>
            <CardDescription>Gérez le rôle et le statut de l'utilisateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role || ""} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLE_CLIENT">Client</SelectItem>
                  <SelectItem value="ROLE_GESTIONNAIRE">Gestionnaire</SelectItem>
                  <SelectItem value="ROLE_INTEGRATEUR">Intégrateur</SelectItem>
                  <SelectItem value="ROLE_ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut || ""}
                onValueChange={(value) => setFormData({ ...formData, statut: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 space-y-2">
              <Label>Informations du compte</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Date d'inscription: {new Date(user.dateInscription).toLocaleDateString("fr-FR")}</p>
                <p>Dernière connexion: {new Date(user.derniereConnexion).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer l'utilisateur
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement
                supprimées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  )
}
