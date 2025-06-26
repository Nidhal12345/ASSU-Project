"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction as AlertDialogActionComponent,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import type React from "react"

import { useEffect, useState } from "react"
import { ClipboardCheck, Filter, Pencil, Trash2, CreditCard } from "lucide-react"
import { DataTable } from "../../components/client/data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { deleteQuote, fetchClientQuotes } from "@/api/api"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "react-router-dom"
import { PageHeaderSkeleton, DataTableSkeleton } from "@/components/skeleton-components"
import toast from "react-hot-toast"

interface Quote {
  id: string
  date: string
  type: string
  amount: string
  status: string
  pdfLink: string
  subscriptionLink?: string
  requiresFileUpload?: boolean
}

const formSchema = z.object({
  date: z
    .string()
    .min(1, "La date est requise")
    .refine(
      (dateString) => {
        const selectedDate = new Date(dateString)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today
      },
      {
        message: "La date ne peut pas être dans le passé",
      },
    ),
})

export function ClientDemandes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
    },
  })

async function updateQuoteDate(quoteId: string, newDate: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/quotes/${quoteId}/date`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ date: newDate }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.success("Date mise à jour avec succès");
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (error) {
    console.error("Error updating quote date:", error);
    throw error;
  }
}


  useEffect(() => {
    const loadQuotes = async () => {
      try {
        setLoading(true)
        const data = (await fetchClientQuotes()) as Quote[]
        console.log(data)
        setQuotes(data)
      } catch (error) {
        toast.error("Erreur lors du chargement des demandes de devis")
      } finally {
        setLoading(false)
      }
    }

    loadQuotes()
  }, [toast])

  useEffect(() => {
    if (selectedQuote) {
      const formattedDate = new Date(selectedQuote.date).toISOString().split("T")[0]
      form.reset({
        date: formattedDate,
      })
    }
  }, [selectedQuote, form])

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote)
  }

  const handleDelete = (quote: Quote) => {
    setSelectedQuote(quote)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedQuote) {
      await deleteQuote(selectedQuote.id)

      setQuotes(quotes.filter((q) => q.id !== selectedQuote.id))
            setDeleteDialogOpen(false)
                  setSelectedQuote(null)
      toast.success(`La demande de devis ${selectedQuote.id} a été supprimée avec succès.`)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedQuote) {
      try {
        setIsUpdating(true)

        await updateQuoteDate(selectedQuote.id, values.date)

        const updatedQuotes = quotes.map((q) => (q.id === selectedQuote.id ? { ...q, date: values.date } : q))
        setQuotes(updatedQuotes)
        toast.success("Date du contrat mise à jour avec succès")
        setSelectedQuote(null)
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la date du contrat:", error)
        toast.error("Erreur lors de la mise à jour de la date du contrat. Veuillez réessayer.")
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const isQuoteEditable = (quote: Quote) => {
    return quote.status === "en_attente"
  }

  const columns = [
    {
      header: "Référence",
      accessorKey: "id" as keyof Quote,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof Quote,
      cell: (quote: Quote) => new Date(quote.date).toLocaleDateString("fr-FR"),
    },
    {
      header: "Type",
      accessorKey: "type" as keyof Quote,
    },
    {
      header: "Montant",
      accessorKey: "amount" as keyof Quote,
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof Quote,
      cell: (quote: Quote) => {
        const statusMap: Record<string, React.ReactNode> = {
          en_attente: (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              En attente
            </Badge>
          ),
          accepted: (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Validée
            </Badge>
          ),
          rejected: (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              Rejetée
            </Badge>
          ),
        }
        return statusMap[quote.status] || quote.status
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (quote: Quote) => {
        const canEdit = isQuoteEditable(quote)

        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(quote)} disabled={!canEdit}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Modifier la date du contrat</DialogTitle>
                          <DialogDescription>
                            Modifiez la date de votre contrat. Cliquez sur Enregistrer lorsque vous avez terminé.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date du contrat</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" disabled={isUpdating}>
                                  Annuler
                                </Button>
                              </DialogClose>
                              <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Enregistrement..." : "Enregistrer"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                {!canEdit && (
                  <TooltipContent side="bottom">
                    <p>Modification disponible uniquement pour les demandes en attente</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(quote)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        )
      },
    },
    {
      header: "Paiement",
      accessorKey: "payment",
      cell: (quote: Quote) => {
        const isEnabled = !!quote.subscriptionLink

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isEnabled) {
                        window.open(quote.subscriptionLink, "_blank")
                      }
                    }}
                    disabled={!isEnabled}
                    className="w-full flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Payer
                  </Button>
                </div>
              </TooltipTrigger>
              {!isEnabled && (
                <TooltipContent side="bottom">
                  <p>Paiement non disponible pour cette demande</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )
      },
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
          <h2 className="text-2xl font-bold tracking-tight">Mes demandes</h2>
          <p className="text-muted-foreground">Consultez et gérez vos demandes de devis</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            <Link to={"/insurance"}>Nouvelle demande</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Toutes</DropdownMenuItem>
              <DropdownMenuItem>En attente</DropdownMenuItem>
              <DropdownMenuItem>Validées</DropdownMenuItem>
              <DropdownMenuItem>Rejetées</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable data={quotes} columns={columns} searchKey="type" />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement votre demande de devis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogActionComponent
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogActionComponent>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
