import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { z } from "zod"
import type { FormData } from "../../pages/steperFormMain"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ExtendedFormData extends FormData {
  spouseFirstName?: string
  spouseLastName?: string
  spouseBirthDate?: Date
  childrenCount?: number
  childrenInfo?: {
    firstName: string
    lastName: string
    birthDate?: Date
  }[]
}

interface ContractStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
}

// Zod validation schemas
const childSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
    invalid_type_error: "Date invalide"
  }).refine((date) => {
    const today = new Date()
    const maxAge = new Date()
    maxAge.setFullYear(today.getFullYear() - 25) // Children must be under 25
    return date <= today && date >= maxAge
  }, "L'enfant doit être né il y a moins de 25 ans")
})

const spouseSchema = z.object({
  spouseFirstName: z.string().min(1, "Le prénom est requis").min(2, "Le prénom doit contenir au moins 2 caractères"),
  spouseLastName: z.string().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  spouseBirthDate: z.date({
    required_error: "La date de naissance est requise",
    invalid_type_error: "Date invalide"
  }).refine((date) => {
    const today = new Date()
    const minAge = new Date()
    minAge.setFullYear(today.getFullYear() - 18) // Spouse must be at least 18
    const maxAge = new Date()
    maxAge.setFullYear(today.getFullYear() - 100) // Reasonable max age
    return date <= minAge && date >= maxAge
  }, "Le conjoint doit être âgé d'au moins 18 ans")
})

const contractSchema = z.object({
  coverageOption: z.enum(["moi", "moi-conjoint", "moi-enfants", "moi-conjoint-enfants"], {
    required_error: "Veuillez sélectionner une option de couverture"
  }),
  startDate: z.date({
    required_error: "La date de début est requise",
    invalid_type_error: "Date invalide"
  }).refine((date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to compare only dates
    const inputDate = new Date(date)
    inputDate.setHours(0, 0, 0, 0)
    return inputDate >= today
  }, "La date de début ne pas valide"),
  childrenInfo: z.array(childSchema).optional(),
}).and(
  z.union([
    z.object({ coverageOption: z.literal("moi") }),
    z.object({ 
      coverageOption: z.enum(["moi-conjoint", "moi-conjoint-enfants"]),
    }).merge(spouseSchema),
    z.object({ 
      coverageOption: z.enum(["moi-enfants", "moi-conjoint-enfants"]),
      childrenInfo: z.array(childSchema).min(1, "Au moins un enfant doit être ajouté")
    }),
  ])
)

const ContractStep = ({ formData, updateFormData, onNext }: ContractStepProps) => {
  const extendedFormData = formData as ExtendedFormData

  const spouseFormRef = useRef<HTMLDivElement>(null)
  const childrenFormRef = useRef<HTMLDivElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (formData.coverageOption.includes("enfants") && !extendedFormData.childrenInfo) {
      updateFormData({
        childrenInfo: [{ firstName: "", lastName: "", birthDate: undefined }],
        childrenCount: 1,
      } as Partial<ExtendedFormData>)
    }
  }, [formData.coverageOption])

  useEffect(() => {
    gsap.set([spouseFormRef.current, childrenFormRef.current], {
      height: 0,
      opacity: 0,
      overflow: "hidden",
      marginTop: 0,
    })

    if (formData.coverageOption.includes("conjoint") && spouseFormRef.current) {
      gsap.to(spouseFormRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        marginTop: 16,
      })
    } else if (spouseFormRef.current) {
      gsap.to(spouseFormRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        marginTop: 0,
      })
    }

    if (formData.coverageOption.includes("enfants") && childrenFormRef.current) {
      gsap.to(childrenFormRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        marginTop: 16,
        delay: formData.coverageOption.includes("conjoint") ? 0.1 : 0,
      })
    } else if (childrenFormRef.current) {
      gsap.to(childrenFormRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        marginTop: 0,
      })
    }
  }, [formData.coverageOption])

  const handleCoverageChange = (option: string) => {
    const resetData: Partial<ExtendedFormData> = { coverageOption: option }

    if (!option.includes("conjoint")) {
      resetData.spouseFirstName = ""
      resetData.spouseLastName = ""
      resetData.spouseBirthDate = undefined
    }

    if (!option.includes("enfants")) {
      resetData.childrenInfo = []
      resetData.childrenCount = 0
    } else if (!extendedFormData.childrenInfo || extendedFormData.childrenInfo.length === 0) {
      resetData.childrenInfo = [{ firstName: "", lastName: "", birthDate: undefined }]
      resetData.childrenCount = 1
    }

    updateFormData(resetData)
    
    // Clear validation errors when changing coverage option
    setErrors({})
  }

  const addChild = () => {
    const currentChildren = [...(extendedFormData.childrenInfo || [])]
    currentChildren.push({ firstName: "", lastName: "", birthDate: undefined })

    updateFormData({
      childrenInfo: currentChildren,
      childrenCount: currentChildren.length,
    } as Partial<ExtendedFormData>)
  }

  const removeChild = (index: number) => {
    const currentChildren = [...(extendedFormData.childrenInfo || [])]
    if (currentChildren.length > 1) {
      currentChildren.splice(index, 1)

      updateFormData({
        childrenInfo: currentChildren,
        childrenCount: currentChildren.length,
      } as Partial<ExtendedFormData>)

      // Clear errors for the removed child
      const newErrors = { ...errors }
      delete newErrors[`childFirstName${index}`]
      delete newErrors[`childLastName${index}`]
      delete newErrors[`childBirthDate${index}`]
      setErrors(newErrors)
    }
  }

  const updateChildInfo = (index: number, field: string, value: any) => {
    const currentChildren = [...(extendedFormData.childrenInfo || [])]
    currentChildren[index] = { ...currentChildren[index], [field]: value }

    updateFormData({
      childrenInfo: currentChildren,
    } as Partial<ExtendedFormData>)

    // Clear specific field error when user starts typing
    if (value && errors[`child${field.charAt(0).toUpperCase() + field.slice(1)}${index}`]) {
      const newErrors = { ...errors }
      delete newErrors[`child${field.charAt(0).toUpperCase() + field.slice(1)}${index}`]
      setErrors(newErrors)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value } as Partial<ExtendedFormData>)
    
    // Clear specific field error when user starts typing
    if (value && errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    setIsValidating(true)
    const newErrors: Record<string, string> = {}

    try {
      // Prepare data for validation
      const dataToValidate = {
        coverageOption: formData.coverageOption,
        startDate: formData.startDate,
        ...(formData.coverageOption.includes("conjoint") && {
          spouseFirstName: extendedFormData.spouseFirstName,
          spouseLastName: extendedFormData.spouseLastName,
          spouseBirthDate: extendedFormData.spouseBirthDate,
        }),
        ...(formData.coverageOption.includes("enfants") && {
          childrenInfo: extendedFormData.childrenInfo,
        }),
      }

      contractSchema.parse(dataToValidate)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          
          // Handle nested child errors
          if (path.includes('childrenInfo')) {
            const match = path.match(/childrenInfo\.(\d+)\.(\w+)/)
            if (match) {
              const [, index, field] = match
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
              newErrors[`child${fieldName}${index}`] = err.message
            } else if (path === 'childrenInfo') {
              newErrors.childrenInfo = err.message
            }
          } else {
            newErrors[path] = err.message
          }
        })
      }
      
      setErrors(newErrors)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    } else {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.text-red-500:first-of-type')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">Mon contrat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Qui souhaitez-vous assurer ? <span className="text-assuflex-primary">*</span>
            </Label>
            <RadioGroup
              value={formData.coverageOption}
              onValueChange={handleCoverageChange}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              <Label
                htmlFor="moi"
                className={`flex items-center justify-center p-3 rounded border cursor-pointer transition-colors ${
                  formData.coverageOption === "moi"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="moi" id="moi" className="sr-only" />
                Moi
              </Label>
              <Label
                htmlFor="moi-conjoint"
                className={`flex items-center justify-center p-3 rounded border cursor-pointer transition-colors ${
                  formData.coverageOption === "moi-conjoint"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="moi-conjoint" id="moi-conjoint" className="sr-only" />
                Moi et mon conjoint
              </Label>
              <Label
                htmlFor="moi-enfants"
                className={`flex items-center justify-center p-3 rounded border cursor-pointer transition-colors ${
                  formData.coverageOption === "moi-enfants"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="moi-enfants" id="moi-enfants" className="sr-only" />
                Moi et mes enfants
              </Label>
              <Label
                htmlFor="moi-conjoint-enfants"
                className={`flex items-center justify-center p-3 rounded border cursor-pointer transition-colors ${
                  formData.coverageOption === "moi-conjoint-enfants"
                    ? "bg-assuflex-primary text-white border-assuflex-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="moi-conjoint-enfants" id="moi-conjoint-enfants" className="sr-only" />
                Moi, mon conjoint et mes enfants
              </Label>
            </RadioGroup>
            {errors.coverageOption && <p className="text-sm text-red-500 mt-1">{errors.coverageOption}</p>}
          </div>

          {/* Spouse Information - Hidden initially */}
          <div ref={spouseFormRef} className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="font-medium text-base">Informations sur le conjoint</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spouseFirstName" className="text-sm">
                  Prénom <span className="text-assuflex-primary">*</span>
                </Label>
                <Input
                  id="spouseFirstName"
                  value={extendedFormData.spouseFirstName || ""}
                  onChange={(e) => handleFieldChange('spouseFirstName', e.target.value)}
                  className={`bg-background ${errors.spouseFirstName ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Prénom du conjoint"
                />
                {errors.spouseFirstName && <p className="text-sm text-red-500">{errors.spouseFirstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spouseLastName" className="text-sm">
                  Nom <span className="text-assuflex-primary">*</span>
                </Label>
                <Input
                  id="spouseLastName"
                  value={extendedFormData.spouseLastName || ""}
                  onChange={(e) => handleFieldChange('spouseLastName', e.target.value)}
                  className={`bg-background ${errors.spouseLastName ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Nom du conjoint"
                />
                {errors.spouseLastName && <p className="text-sm text-red-500">{errors.spouseLastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseBirthDate" className="text-sm">
                Date de naissance <span className="text-assuflex-primary">*</span>
              </Label>
              <CustomDatePicker
                date={extendedFormData.spouseBirthDate}
                onDateChange={(date) => handleFieldChange('spouseBirthDate', date)}
                placeholder="JJ/MM/AAAA"
                className={`bg-background w-full ${errors.spouseBirthDate ? 'border-red-500' : ''}`}
              />
              {errors.spouseBirthDate && <p className="text-sm text-red-500">{errors.spouseBirthDate}</p>}
            </div>
          </div>

          {/* Children Information */}
          <div ref={childrenFormRef} className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-base">Informations sur les enfants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChild}
                className="text-assuflex-primary border-assuflex-primary hover:bg-assuflex-primary hover:text-white"
              >
                Ajouter un enfant
              </Button>
            </div>

            {errors.childrenInfo && <p className="text-sm text-red-500">{errors.childrenInfo}</p>}

            {extendedFormData.childrenInfo?.map((child, index) => (
              <div key={index} className="space-y-4 pt-2 border-t first:border-t-0 first:pt-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Enfant {index + 1}</h4>
                  {extendedFormData.childrenInfo && extendedFormData.childrenInfo.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChild(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`childFirstName${index}`} className="text-sm">
                      Prénom <span className="text-assuflex-primary">*</span>
                    </Label>
                    <Input
                      id={`childFirstName${index}`}
                      value={child.firstName || ""}
                      onChange={(e) => updateChildInfo(index, "firstName", e.target.value)}
                      className={`bg-background ${errors[`childFirstName${index}`] ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Prénom de l'enfant"
                    />
                    {errors[`childFirstName${index}`] && (
                      <p className="text-sm text-red-500">{errors[`childFirstName${index}`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`childLastName${index}`} className="text-sm">
                      Nom <span className="text-assuflex-primary">*</span>
                    </Label>
                    <Input
                      id={`childLastName${index}`}
                      value={child.lastName || ""}
                      onChange={(e) => updateChildInfo(index, "lastName", e.target.value)}
                      className={`bg-background ${errors[`childLastName${index}`] ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Nom de l'enfant"
                    />
                    {errors[`childLastName${index}`] && (
                      <p className="text-sm text-red-500">{errors[`childLastName${index}`]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`childBirthDate${index}`} className="text-sm">
                    Date de naissance <span className="text-assuflex-primary">*</span>
                  </Label>
                  <CustomDatePicker
                    date={child.birthDate}
                    onDateChange={(date) => updateChildInfo(index, "birthDate", date)}
                    placeholder="JJ/MM/AAAA"
                    className={`bg-background w-full ${errors[`childBirthDate${index}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`childBirthDate${index}`] && (
                    <p className="text-sm text-red-500">{errors[`childBirthDate${index}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">
              Quand souhaitez-vous que votre contrat débute ? <span className="text-assuflex-primary">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              La date de début ne peut pas être dans le futur
            </p>
            <CustomDatePicker
              date={formData.startDate}
              onDateChange={(date) => handleFieldChange('startDate', date)}
              placeholder="JJ/MM/AAAA"
              className={`bg-background ${errors.startDate ? 'border-red-500' : ''}`}
            />
            {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleNext} 
              disabled={isValidating}
              className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white"
            >
              {isValidating ? "Validation..." : "Suivant"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContractStep