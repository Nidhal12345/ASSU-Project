import axios from "axios"
import { ReactNode } from "react"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/quotes",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

const api2 = axios.create({
  baseURL: "http://localhost:8080/api/v1/users",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error)
    return Promise.reject(error)
  },
)

export interface Demande {
  clientId:number
  id: string
  clientName: string
  createDate: Date
  phoneNumber: string
  status:"en_attente" | "validée" | "Rejetée";
  documentNumber: number
}

export interface DocumentInfo {
  fileName: string;
  uploadDate: string; // ISO date string, e.g., "2025-04-01T12:34:56"
  fileNameServer: string;
  validated: boolean;
}

export interface ValidationDetailsDTO {
  id: ReactNode
  statut: string
  type: ReactNode
  date: string | number | Date
  createdAt: string | number | Date
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string; // LocalDate -> ISO date string
  postalCode: string;
  profession: string;

  quoteId: number;
  status: "en_attente" | "validée" | "rejetée";
  coverageOption: string;
  startDate: string; // LocalDate -> ISO date string
  setDocuments: DocumentInfo[];
}

export interface Contrat {
  id: string
  client: string
  dateDebut: string
  dateFin: string
  type: string
  montant: number
  statut: "actif" | "résilié" | "en_attente"
}

export interface Client {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  dateInscription: string
  contrats: number
}

export interface Devis {
  id: string
  client: string
  date: string
  amount: number
  status: "en_attente" | "accepté" | "refusé"
  email?: string
  phoneNumber?: string
  coverageOption?: string
  startDate?: string
}

export interface Stats {
  totalDevis: number
  totalDemandes: number
  totalContratsActifs: number
  totalClients: number
  totalPaiements: number
  tauxValidation: number
  devisParMois: { mois: string; nombre: number }[]
  demandesParStatut: { statut: string; nombre: number }[]
}

export const getDevis = async (): Promise<Devis[]> => {
  try {
    const response = await api.get("")
    return response.data
  } catch (error) {
    console.error("Error fetching devis:", error)
    throw error
  }
}

export const getDemandes = async (): Promise<Demande[]> => {
  const response = await api.get("/validation")
  console.log(response.data)
  return response.data
}

export const getDemandeById = async (id: string): Promise<ValidationDetailsDTO> => {
  const response = await api.get(`/demande/${id}`)
  console.log(response.data)
  return response.data
}

export const validerDemande = async (id: string): Promise<void> => {
  await api.put(`/demande/${id}/valider`)
}

export const rejeterDemande = async (id: string): Promise<void> => {
  (await api.put(`/demande/${id}/reject`))
}

export const getContrats = async (): Promise<Contrat[]> => {
  const response = await api.get("/contrats")
  return response.data
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api2.get("")
  return response.data
}

export const getStats = async (): Promise<Stats> => {
  const response = await api.get("/stats")
  return response.data
}


export const fetchClientProfile = async () => {
  try {
    const response = await api2.get('/profile')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    throw error
  }
}

export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  try {
    const response = await api2.put('/change-password', data)
    return response.data
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error)
    throw error
  }
}

export const updateClientProfile = async (profileData: any) => {
  try {
    const response = await api2.put('/profile', profileData)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    throw error
  }
}