import { useState, useEffect, useCallback, useMemo } from "react"
import { z } from "zod"
import gsap from "gsap"
import type { FormData } from "../../pages/steperFormMain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ContactStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onSubmit: () => void
  onPrevious: () => void
}

const contactSchema = z.object({
  civility: z.enum(["Madame", "Monsieur"], {
    errorMap: () => ({ message: "Veuillez sélectionner une civilité" })
  }),
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .trim(),
  lastName: z.string()
    .min(1, "Le nom est requis")
    .trim(),
  postalCode: z.string()
    .regex(/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/, "Code postal invalide (format: 5 chiffres)"),
  phoneNumber: z.string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  email: z.string()
    .email("Adresse email invalide")
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactStep = ({ formData, updateFormData, onSubmit, onPrevious }: ContactStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = useCallback((field: keyof ContactFormData, value: string) => {
    try {
      const fieldSchema = contactSchema.shape[field]
      fieldSchema.parse(value)
      return ""
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || "Valeur invalide"
      }
      return "Erreur de validation"
    }
  }, [])

  const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
    updateFormData({ [field]: value })

    setErrors(prev => ({ ...prev, [field]: "" }))

    const timeoutId = setTimeout(() => {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [updateFormData, validateField])

  const isStepValid = useMemo(() => {
    try {
      contactSchema.parse({
        civility: formData.civility,
        firstName: formData.firstName,
        lastName: formData.lastName,
        postalCode: formData.postalCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      })
      return true
    } catch {
      return false
    }
  }, [formData])

  const handleSubmit = useCallback(async () => {
    if (!isStepValid) {
      const validationErrors: Record<string, string> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (key in contactSchema.shape) {
          const error = validateField(key as keyof ContactFormData, value as string)
          if (error) validationErrors[key] = error
        }
      })
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }, [isStepValid, formData, validateField, onSubmit])

  const civilityOptions = useMemo(() => [
    { value: "Madame", id: "madame", label: "Madame" },
    { value: "Monsieur", id: "monsieur", label: "Monsieur" }
  ], [])

  const formFields = useMemo(() => [
    {
      key: "firstName" as keyof ContactFormData,
      label: "Mon prénom",
      type: "text",
      required: true
    },
    {
      key: "lastName" as keyof ContactFormData,
      label: "Mon nom",
      type: "text",
      required: true
    },
    {
      key: "postalCode" as keyof ContactFormData,
      label: "Mon code postal",
      type: "text",
      required: true
    },
    {
      key: "phoneNumber" as keyof ContactFormData,
      label: "Mon numéro de téléphone",
      type: "tel",
      required: true
    },
    {
      key: "email" as keyof ContactFormData,
      label: "Mon adresse email",
      type: "email",
      required: true
    }
  ], [])

  useEffect(() => {
    const formElements = document.querySelectorAll(".form-element")
    
    gsap.fromTo(
      formElements,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    )
  }, [])

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">
          Mes coordonnées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Ma civilité <span className="text-assuflex-primary">*</span>
            </Label>
            <RadioGroup
              value={formData.civility}
              onValueChange={(value) => updateFormData({ civility: value })}
              className="grid grid-cols-2 gap-2"
            >
              {civilityOptions.map(({ value, id, label }) => (
                <Label
                  key={value}
                  htmlFor={id}
                  className={`flex items-center justify-center p-2 rounded border cursor-pointer transition-colors ${
                    formData.civility === value
                      ? "bg-assuflex-primary text-white border-assuflex-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  <RadioGroupItem value={value} id={id} className="sr-only" />
                  {label}
                </Label>
              ))}
            </RadioGroup>
            {errors.civility && (
              <p className="text-sm text-red-500">{errors.civility}</p>
            )}
          </div>

          {formFields.map(({ key, label, type, required }) => (
            <div key={key} className="form-element space-y-2">
              <Label className="text-base font-medium">
                {label} {required && <span className="text-assuflex-primary">*</span>}
              </Label>
              <Input
                type={type}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="bg-background"
                aria-invalid={!!errors[key]}
                aria-describedby={errors[key] ? `${key}-error` : undefined}
              />
              {errors[key] && (
                <p id={`${key}-error`} className="text-sm text-red-500">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          <div className="form-element flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onPrevious} 
              disabled={isSubmitting}
              type="button"
            >
              Précédent
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid || isSubmitting}
              className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white uppercase font-semibold"
              type="button"
            >
              {isSubmitting ? (
                <span className="loading-spinner" aria-label="Chargement..." />
              ) : (
                "Découvrir mes offres"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactStep