"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Download, Eye, XCircle } from "lucide-react"
import { DataTable } from "../../components/client/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { fetchClientContracts } from "@/api/api"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"

interface Contract {
  id: string
  type: string
  startDate: string
  endDate: string
  status: string
  price: string
  coverage: string
  documents: string
  clotureRequested?: boolean
}

export function ClientContrats() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [requestingClosure, setRequestingClosure] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true)
        const data = (await fetchClientContracts()) as Contract[]
        console.log(data)
        setContracts(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos contrats",
        })
      } finally {
        setLoading(false)
      }
    }

    loadContracts()
  }, [toast])

  const handleClosureRequest = async (contractId: string) => {
    try {
      setRequestingClosure(contractId)

      const response = await fetch(`http://localhost:8080/api/v1/contracts/${contractId}/demande-cloture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          "Accept": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la demande de clôture")
      }

      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.id === contractId ? { ...contract, clotureRequested: true } : contract,
        ),
      )

      toast({
        title: "Demande envoyée",
        description: "Votre demande de clôture a été envoyée avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande de clôture. Veuillez réessayer.",
      })
    } finally {
      setRequestingClosure(null)
    }
  }

  const isClosureDisabled = (contract: Contract) => {
    return contract.status === "CLOTURE" || contract.clotureRequested === true
  }

  const getClosureButtonText = (contract: Contract) => {
    if (contract.status === "CLOTURE") return "Contrat clôturé"
    if (contract.clotureRequested) return "Demande en cours"
    return "Demander la clôture"
  }

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Contract,
    },
    {
      header: "Type",
      accessorKey: "type" as keyof Contract,
    },
    {
      header: "Date début",
      accessorKey: "startDate" as keyof Contract,
      cell: (contract: Contract) => new Date(contract.startDate).toLocaleDateString("fr-FR"),
    },
    {
      header: "Date fin",
      accessorKey: "endDate" as keyof Contract,
      cell: (contract: Contract) => new Date(contract.endDate).toLocaleDateString("fr-FR"),
    },
    {
      header: "Prix",
      accessorKey: "price" as keyof Contract,
      cell: (contrat: Contract) => `${Number(contrat.price).toFixed(2)} €`,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Contract,
      cell: (contract: Contract) => {
        const statusMap: Record<string, React.ReactNode> = {
          EN_COURS: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Actif
            </Badge>
          ),
          expiré: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Expiré
            </Badge>
          ),
          CLOTURE: (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              Clôturé
            </Badge>
          ),
        }
        return statusMap[contract.status] || contract.status
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (contract: Contract) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href={`http://localhost:8080/uploads/contracts/${contract.documents}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Télécharger le contrat</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isClosureDisabled(contract)}
              onClick={() => handleClosureRequest(contract.id)}
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <XCircle className="mr-2 h-4 w-4" />
              <span>{getClosureButtonText(contract)}</span>
            </DropdownMenuItem>
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
          <h2 className="text-2xl font-bold tracking-tight">Mes contrats</h2>
          <p className="text-muted-foreground">Consultez et gérez vos contrats d'assurance santé</p>
        </div>
      </div>

      <DataTable data={contracts} columns={columns} searchKey="type" />

      {contracts.length > 0 && (
        <div className="border-t pt-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Actions sur les contrats</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vous pouvez demander la clôture de vos contrats actifs. Une fois la demande envoyée, notre équipe la
              traitera dans les plus brefs délais.
            </p>
            <div className="grid gap-3">
              {contracts
                .filter((contract) => contract.status === "EN_COURS")
                .map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 bg-background rounded border">
                    <div className="flex-1">
                      <p className="font-medium">Contrat {contract.id}</p>
                      <p className="text-sm text-muted-foreground">{contract.type}</p>
                    </div>
                    <Button
                      variant={contract.clotureRequested ? "secondary" : "destructive"}
                      size="sm"
                      disabled={isClosureDisabled(contract) || requestingClosure === contract.id}
                      onClick={() => handleClosureRequest(contract.id)}
                    >
                      {requestingClosure === contract.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          {getClosureButtonText(contract)}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
