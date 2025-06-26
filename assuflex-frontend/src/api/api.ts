import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const deleteClaim = async (claimId: string): Promise<void> => {
  try {
    const response = await api.delete(`/claims/${claimId}`)

    if (response.status !== 204) {
      throw new Error(`Failed to delete claim: ${response.status} ${response.statusText}`)
    }
  }catch (error) {
    console.error('Error deleting claim:', error);
    throw error;
  }
}


export const deleteQuote = async (quoteId: any) => {
  try {
    const response = await api.delete(`/quotes/${quoteId}`)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    throw error
  }
}

export const fetchClientQuotes = async () => {
  try {
    const response = await api.get('/quotes/client')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error)
    throw error
  }
}

export const fetchClientContracts = async () => {
  try {
    const response = await api.get('/contracts/client')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error)
    throw error
  }
}

export const fetchAllContracts = async () => {
  try {
     const response = await api.get('/contracts')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error)
    throw error
  }
}