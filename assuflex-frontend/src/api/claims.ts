import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/claims",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API Claims:", error)
    return Promise.reject(error)
  },
)

export interface Claim {
  id: string
  contractNumber: string
  incidentDate: string
  claimType: "Hospitalisation" | "Consultation" | "Pharmacie" | "Optique" | "Dentaire" | "Autre"
  description: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  status: "en_attente" | "en_cours" | "traite" | "rejete"
  attachments: ClaimAttachment[]
  createdAt: string
  updatedAt: string
  clientId: string
}

export interface ClaimAttachment {
  id: string
  fileName: string
  fileNameServer: string
  fileSize: number
  fileType: string
  uploadDate: string
}

export interface ClaimFormData {
  contractNumber: string
  incidentDate: string
  claimType: string
  description: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  attachments: File[]
}

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get("/mine")
  return response.data
}

export const getClaimById = async (id: string): Promise<Claim> => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const createClaim = async (formData: FormData): Promise<Claim> => {
  const response = await api.post("", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const getAllClaims = async (): Promise<Claim[]> => {
  const response = await api.get("")
  return response.data
}

export const updateClaimStatus = async (id: string, status: string): Promise<void> => {
  await api.patch(`/${id}/status`, { status })
}
