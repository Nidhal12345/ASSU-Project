import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/transactions",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Paiement {
  id: string
  client: string
  date: string
  montant: number
  methode: string
  statut: "payé" | "en_attente" | "échoué"
}

export const getPaiements = async (): Promise<Paiement[]> => {
  const response = await api.get("")
  console.log(response.data)
  return response.data
}

export const fetchClientPayments = async () => {
  try {
    const response = await api.get('/me')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error)
    throw error
  }
}