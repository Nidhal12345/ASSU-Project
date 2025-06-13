"use client"

import { useState, useEffect } from "react"
import { api } from "../api/api"

// Types
interface ClientProfile {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  codePostal: string
  ville: string
}

interface Quote {
  id: string
  numero: string
  date: string
  typeContrat: string
  montant: number
  statut: string
}

interface Contract {
  id: string
  numero: string
  typeContrat: string
  dateDebut: string
  dateFin: string
  montant: number
  statut: string
}

interface Payment {
  id: string
  reference: string
  date: string
  contrat: string
  montant: number
  statut: string
}

// Hook générique pour les appels API
function useApiData<T>(fetchFunction: () => Promise<T>, initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await fetchFunction()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Une erreur est survenue"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error, refetch: fetchData }
}

// Hook pour le profil client
export function useClientProfile() {
  const { data, isLoading, error, refetch } = useApiData<ClientProfile>(api.fetchClientProfile)

  const updateProfile = async (profileData: ClientProfile) => {
    try {
      await api.updateClientProfile(profileData)
      refetch()
    } catch (error) {
      throw error
    }
  }

  return { data, isLoading, error, refetch, updateProfile }
}

// Hook pour les devis
export function useClientQuotes() {
  return useApiData<Quote[]>(api.fetchClientQuotes)
}

// Hook pour les contrats
export function useClientContracts() {
  return useApiData<Contract[]>(api.fetchClientContracts)
}

// Hook pour les paiements
export function useClientPayments() {
  return useApiData<Payment[]>(api.fetchClientPayments)
}
