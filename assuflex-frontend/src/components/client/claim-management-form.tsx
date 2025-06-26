import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Calendar, User, Mail, Phone, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

const claimSchema = z.object({
  contractNumber: z
    .string()
    .min(1, "Le numéro de contrat est obligatoire")
    .min(3, "Le numéro de contrat doit contenir au moins 3 caractères"),
  incidentDate: z
    .string()
    .min(1, "La date de l'incident est obligatoire"),
  claimType: z
    .string()
    .min(1, "Le type de sinistre est obligatoire")
    .refine(
      (value) => ["HOSPITALISATION", "SOINS", "PHARMACIE", "OPTIQUE", "DENTAIRE"].includes(value),
      "Type de sinistre invalide",
    ),
  description: z
    .string()
    .min(1, "La description est obligatoire")
    .min(10, "La description doit contenir au moins 10 caractères"),
  contactName: z
    .string()
    .min(1, "Le nom de contact est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  contactEmail: z.string().min(1, "L'email de contact est obligatoire").email("Format d'email invalide"),
  contactPhone: z
    .string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone français invalide")
    .optional()
    .or(z.literal("")),
})

type ClaimFormData = z.infer<typeof claimSchema>

const CLAIM_TYPES = [
  { value: "HOSPITALISATION", label: "Hospitalisation" },
  { value: "SOINS", label: "Soins" },
  { value: "PHARMACIE", label: "Pharmacie" },
  { value: "OPTIQUE", label: "Optique" },
  { value: "DENTAIRE", label: "Dentaire" },
]

export function ClaimManagementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
  })

  const claimType = watch("claimType")

  const onSubmit = async (data: ClaimFormData) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post("http://localhost:8080/api/v1/claims", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })

      toast.success("Votre sinistre a bien été soumis.")
      reset()
    } catch (error) {
      console.log(error)
      toast.error("Erreur lors de la soumission. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Déclaration de sinistre</h2>
        <p className="text-muted-foreground">Déclarez votre sinistre en remplissant le formulaire ci-dessous</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations du contrat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Informations du contrat
              </CardTitle>
              <CardDescription>Renseignez les informations relatives à votre contrat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Numéro de contrat *</Label>
                <Input id="contractNumber" {...register("contractNumber")} placeholder="Ex: CTR-2024-001234" />
                {errors.contractNumber && <p className="text-sm text-destructive">{errors.contractNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date de l'incident *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="incidentDate"
                    type="date"
                    {...register("incidentDate")}
                    className="pl-10"
                  />
                </div>
                {errors.incidentDate && <p className="text-sm text-destructive">{errors.incidentDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="claimType">Type de sinistre *</Label>
                <Select onValueChange={(value) => setValue("claimType", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de sinistre" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {CLAIM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.claimType && <p className="text-sm text-destructive">{errors.claimType.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations de contact
              </CardTitle>
              <CardDescription>Vos coordonnées pour le suivi du dossier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom complet *</Label>
                <Input id="contactName" {...register("contactName")} placeholder="Prénom Nom" />
                {errors.contactName && <p className="text-sm text-destructive">{errors.contactName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail")}
                    placeholder="votre@email.com"
                    className="pl-10"
                  />
                </div>
                {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Téléphone (optionnel)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    {...register("contactPhone")}
                    placeholder="06 12 34 56 78"
                    className="pl-10"
                  />
                </div>
                {errors.contactPhone && <p className="text-sm text-destructive">{errors.contactPhone.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description du sinistre</CardTitle>
            <CardDescription>Décrivez en détail les circonstances de votre sinistre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Décrivez précisément les circonstances du sinistre, les soins reçus, les frais engagés..."
                className="min-h-[120px]"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Soumettre la déclaration"}
          </Button>
        </div>
      </form>
    </div>
  )
}
