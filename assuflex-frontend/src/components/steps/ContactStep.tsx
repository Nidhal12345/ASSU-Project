import { useState, useEffect } from "react"
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

const ContactStep = ({ formData, updateFormData, onSubmit, onPrevious }: ContactStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePostalCode = (code: string) => {
    const regex = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/
    return regex.test(code)
  }

  const validatePhoneNumber = (number: string) => {
    const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return regex.test(number)
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "postalCode":
        return validatePostalCode(value) ? "" : "Code postal invalide (format: 5 chiffres)"
      case "phoneNumber":
        return validatePhoneNumber(value) ? "" : "Numéro de téléphone invalide"
      case "email":
        return validateEmail(value) ? "" : "Adresse email invalide"
      case "firstName":
      case "lastName":
        return value.trim() ? "" : "Ce champ est requis"
      default:
        return ""
    }
  }

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })

    const error = validateField(field, value)
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }

  const isStepValid =
    formData.civility &&
    formData.firstName &&
    formData.lastName &&
    formData.postalCode &&
    validatePostalCode(formData.postalCode) &&
    formData.phoneNumber &&
    validatePhoneNumber(formData.phoneNumber) &&
    formData.email &&
    validateEmail(formData.email)

  const handleSubmit = async () => {
    if (!isStepValid) return

    setIsSubmitting(true)
    await onSubmit()
    setIsSubmitting(false)
  }

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
      },
    )
  }, [])

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">Mes coordonnées</CardTitle>
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
              <Label
                htmlFor="madame"
                className={`flex items-center justify-center p-2 rounded border cursor-pointer transition-colors ${
                  formData.civility === "Madame"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="Madame" id="madame" className="sr-only" />
                Madame
              </Label>
              <Label
                htmlFor="monsieur"
                className={`flex items-center justify-center p-2 rounded border cursor-pointer transition-colors ${
                  formData.civility === "Monsieur"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="Monsieur" id="monsieur" className="sr-only" />
                Monsieur
              </Label>
            </RadioGroup>
          </div>

          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Mon prénom <span className="text-assuflex-primary">*</span>
            </Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="bg-background"
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Mon nom <span className="text-assuflex-primary">*</span>
            </Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="bg-background"
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>

          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Mon code postal <span className="text-assuflex-primary">*</span>
            </Label>
            <Input
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="bg-background"
            />
            {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
          </div>

          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Mon numéro de téléphone <span className="text-assuflex-primary">*</span>
            </Label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="bg-background"
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          <div className="form-element space-y-2">
            <Label className="text-base font-medium">
              Mon adresse email <span className="text-assuflex-primary">*</span>
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-background"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="form-element flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
              Précédent
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid || isSubmitting}
              className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white uppercase font-semibold"
            >
              {isSubmitting ? <span className="loading-spinner"></span> : "Découvrir mes offres"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactStep
