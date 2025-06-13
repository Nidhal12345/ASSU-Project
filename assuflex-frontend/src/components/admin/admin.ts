import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/users",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API Admin:", error)
    return Promise.reject(error)
  },
)

export interface User {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: "ROLE_CLIENT" | "ROLE_GESTIONNAIRE" | "ROLE_ADMIN" | "ROLE_INTEGRATEUR"
  statut: "actif" | "inactif" | "suspendu"
  dateInscription: string
  derniereConnexion: string
}

export interface AdminStats {
  totalUtilisateurs: number
  totalClients: number
  totalGestionnaires: number
  totalAdmins: number
  totalIntegrateurs: number
  utilisateursActifs: number
  nouvellesInscriptions: number
  activiteRecente: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: "inscription" | "connexion" | "modification" | "suppression"
  utilisateur: string
  description: string
  date: string
}

export interface UserUpdateData {
  nom?: string
  prenom?: string
  email?: string
  telephone?: string
  role?: string
  statut?: string
}

export const getUsers = async (): Promise<User[]> => {
  // // Placeholder data - remplacer par un vrai appel API
  // return [
  //   {
  //     id: "1",
  //     nom: "Dupont",
  //     prenom: "Jean",
  //     email: "jean.dupont@example.com",
  //     telephone: "0123456789",
  //     role: "ROLE_CLIENT",
  //     statut: "actif",
  //     dateInscription: "2024-01-15",
  //     derniereConnexion: "2024-12-01",
  //   },
  //   {
  //     id: "2",
  //     nom: "Martin",
  //     prenom: "Marie",
  //     email: "marie.martin@example.com",
  //     telephone: "0987654321",
  //     role: "ROLE_GESTIONNAIRE",
  //     statut: "actif",
  //     dateInscription: "2024-02-20",
  //     derniereConnexion: "2024-11-30",
  //   },
  //   {
  //     id: "3",
  //     nom: "Bernard",
  //     prenom: "Pierre",
  //     email: "pierre.bernard@example.com",
  //     telephone: "0147258369",
  //     role: "ROLE_INTEGRATEUR",
  //     statut: "inactif",
  //     dateInscription: "2024-03-10",
  //     derniereConnexion: "2024-11-25",
  //   },
  // ]
  const response = await api.get("")
  return response.data
}

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const updateUser = async (id: string, data: UserUpdateData): Promise<User> => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/${id}`)
}

export const getAdminStats = async (): Promise<AdminStats> => {
  // Placeholder data - remplacer par un vrai appel API
  return {
    totalUtilisateurs: 1247,
    totalClients: 1089,
    totalGestionnaires: 12,
    totalAdmins: 3,
    totalIntegrateurs: 143,
    utilisateursActifs: 892,
    nouvellesInscriptions: 23,
    activiteRecente: [
      {
        id: "1",
        type: "inscription",
        utilisateur: "Sophie Dubois",
        description: "Nouvelle inscription client",
        date: "2024-12-01T10:30:00",
      },
      {
        id: "2",
        type: "connexion",
        utilisateur: "Jean Dupont",
        description: "Connexion au tableau de bord",
        date: "2024-12-01T09:15:00",
      },
      {
        id: "3",
        type: "modification",
        utilisateur: "Marie Martin",
        description: "Modification du profil",
        date: "2024-12-01T08:45:00",
      },
    ],
  }
  // const response = await api.get("/stats")
  // return response.data
}
