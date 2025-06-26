"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserPlus, MoreHorizontal } from "lucide-react"
import { DataTable } from "@/components/gestionnaire/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, getUsers } from "@/components/admin/admin"
import { NewUserForm } from "@/components/admin/new-user-form"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [toast])

  const getRoleBadge = (role: User["role"]) => {
    const roleMap = {
      ROLE_CLIENT: (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          Client
        </Badge>
      ),
      ROLE_GESTIONNAIRE: (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Gestionnaire
        </Badge>
      ),
      ROLE_ADMIN: (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Administrateur
        </Badge>
      ),
      ROLE_INTEGRATEUR: (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
          Intégrateur
        </Badge>
      ),
    }
    return roleMap[role]
  }

  const getStatusBadge = (statut: User["statut"]) => {
    const statusMap = {
      actif: (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Actif
        </Badge>
      ),
      inactif: (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          Inactif
        </Badge>
      ),
      suspendu: (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Suspendu
        </Badge>
      ),
    }
    return statusMap[statut]
  }

  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof User,
    },
    {
      header: "Nom",
      accessorKey: "nom" as keyof User,
    },
    {
      header: "Prénom",
      accessorKey: "prenom" as keyof User,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof User,
    },
    {
      header: "Téléphone",
      accessorKey: "telephone" as keyof User,
    },
    {
      header: "Rôle",
      accessorKey: "role" as keyof User,
      cell: (user: User) => getRoleBadge(user.role),
    },
    {
      header: "Statut",
      accessorKey: "statut" as keyof User,
      cell: (user: User) => getStatusBadge(user.statut),
    },
    {
      header: "Inscription",
      accessorKey: "dateInscription" as keyof User,
      cell: (user: User) => new Date(user.creationDate).toLocaleDateString("fr-FR"),
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof User,
      cell: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Voir le profil</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Supprime</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Gérez tous les comptes utilisateurs de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsNewUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchKey="email"
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
      />

      <NewUserForm
        open={isNewUserDialogOpen}
        onOpenChange={setIsNewUserDialogOpen}
        onUserCreated={fetchUsers}
      />
    </div>
  )
}
