import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
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

const ContractStep = ({ formData, updateFormData, onNext }: ContractStepProps) => {
  const extendedFormData = formData as ExtendedFormData

  const spouseFormRef = useRef<HTMLDivElement>(null)
  const childrenFormRef = useRef<HTMLDivElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

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
    }
  }

  const updateChildInfo = (index: number, field: string, value: any) => {
    const currentChildren = [...(extendedFormData.childrenInfo || [])]
    currentChildren[index] = { ...currentChildren[index], [field]: value }

    updateFormData({
      childrenInfo: currentChildren,
    } as Partial<ExtendedFormData>)
  }

  const isStepValid = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (!formData.coverageOption) {
      newErrors.coverageOption = "Veuillez sélectionner une option"
      isValid = false
    }

    if (!formData.startDate) {
      newErrors.startDate = "Veuillez sélectionner une date"
      isValid = false
    }

    if (formData.coverageOption.includes("conjoint")) {
      if (!extendedFormData.spouseFirstName) {
        newErrors.spouseFirstName = "Veuillez saisir le prénom"
        isValid = false
      }

      if (!extendedFormData.spouseLastName) {
        newErrors.spouseLastName = "Veuillez saisir le nom"
        isValid = false
      }

      if (!extendedFormData.spouseBirthDate) {
        newErrors.spouseBirthDate = "Veuillez sélectionner une date"
        isValid = false
      }
    }

    if (formData.coverageOption.includes("enfants") && extendedFormData.childrenInfo) {
      extendedFormData.childrenInfo.forEach((child, index) => {
        if (!child.firstName) {
          newErrors[`childFirstName${index}`] = "Veuillez saisir le prénom"
          isValid = false
        }

        if (!child.lastName) {
          newErrors[`childLastName${index}`] = "Veuillez saisir le nom"
          isValid = false
        }

        if (!child.birthDate) {
          newErrors[`childBirthDate${index}`] = "Veuillez sélectionner une date"
          isValid = false
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (isStepValid()) {
      onNext()
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
                  onChange={(e) => updateFormData({ spouseFirstName: e.target.value } as Partial<ExtendedFormData>)}
                  className="bg-background"
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
                  onChange={(e) => updateFormData({ spouseLastName: e.target.value } as Partial<ExtendedFormData>)}
                  className="bg-background"
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
                onDateChange={(date) => updateFormData({ spouseBirthDate: date } as Partial<ExtendedFormData>)}
                placeholder="JJ/MM/AAAA"
                className="bg-background w-full"
              />
              {errors.spouseBirthDate && <p className="text-sm text-red-500">{errors.spouseBirthDate}</p>}
            </div>
          </div>

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
                      className="bg-background"
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
                      className="bg-background"
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
                    className="bg-background w-full"
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
            <CustomDatePicker
              date={formData.startDate}
              onDateChange={(date) => updateFormData({ startDate: date })}
              placeholder="JJ/MM/AAAA"
              className="bg-background"
            />
            {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white">
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContractStep
