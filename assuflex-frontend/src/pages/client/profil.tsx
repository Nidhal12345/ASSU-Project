import type React from "react"

import { useEffect, useState } from "react"
import { Mail, Phone, MapPin, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { changePassword, fetchClientProfile, updateClientProfile } from "@/api/gestionnaire"
import toast from "react-hot-toast"
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

export function ClientProfil() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const data = (await fetchClientProfile()) as ClientProfile
        setProfile(data)
      } catch (error) {
        toast.error("Impossible de charger votre profil. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      await updateClientProfile(profile)
      console.log(profile)
      toast.success("Votre profil a été mis à jour avec succès.")
    } catch (error) {
      toast.error("Impossible de mettre à jour votre profil. Veuillez réessayer plus tard.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Le nouveau mot de passe et sa confirmation ne correspondent pas.")
      return
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword })
      toast.success("Mot de passe mis à jour avec succès.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return

    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <DataTableSkeleton rows={5} columns={7} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Impossible de charger les informations du profil.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mon profil</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>
        <TabsContent value="informations" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-1/3">
              <CardHeader>
                <CardTitle>Votre profil</CardTitle>
                <CardDescription>Informations de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-24 w-24 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
  {`${profile.firstName?.charAt(0) ?? ''}${profile.lastName?.charAt(0) ?? ''}`}
</div>

                <div className="text-center">
                  <h3 className="text-lg font-medium">{`${profile.firstName} ${profile.lastName}`}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <div className="w-full mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{`${profile.address}, ${profile.postalCode} ${profile.city}`}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Modifier vos informations</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input disabled id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" name="address" value={profile.address} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input id="postalCode" name="postalCode" value={profile.postalCode} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" name="city" value={profile.city} onChange={handleChange} />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="profile-form" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="securite">
      <Card>
        <CardHeader>
          <CardTitle>Sécurité du compte</CardTitle>
          <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordUpdate}>Mettre à jour le mot de passe</Button>
        </CardFooter>
      </Card>
    </TabsContent>
      </Tabs>
    </div>
  )
}
