"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { fetchClientProfile } from "@/api/gestionnaire"

interface ClientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  pendingQuotes?: number
  activeContracts?: number
  totalPaid?: string
}

export function useClientProfile() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchClientProfile()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Une erreur est survenue"))
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger votre profil",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [toast])

  return { profile, isLoading, error }
}
