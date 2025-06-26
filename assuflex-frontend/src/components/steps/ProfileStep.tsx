import { motion } from "framer-motion"
import { z } from "zod"
import { useState } from "react"
import type { FormData } from "../../pages/steperFormMain"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const profileSchema = z.object({
  birthDate: z
    .date({
      required_error: "La date de naissance est obligatoire",
      invalid_type_error: "Veuillez saisir une date valide"
    })
    .refine(
      (date) => date <= new Date(),
      {
        message: "La date de naissance ne peut pas être dans le futur"
      }
    )
    .refine(
      (date) => {
        const minDate = new Date()
        minDate.setFullYear(minDate.getFullYear() - 120)
        return date >= minDate
      },
      {
        message: "Veuillez saisir une date de naissance valide"
      }
    ),
  profession: z
    .string({
      required_error: "La profession est obligatoire"
    })
    .min(1, "Veuillez sélectionner votre profession"),
  regime: z
    .string({
      required_error: "Le régime est obligatoire"
    })
    .min(1, "Veuillez sélectionner votre régime")
})

type ValidationErrors = {
  birthDate?: string
  profession?: string
  regime?: string
}

const ProfileStep = ({ formData, updateFormData, onNext, onPrevious }: ProfileStepProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: keyof ValidationErrors, value: any) => {
    try {
      if (field === 'birthDate') {
        profileSchema.shape.birthDate.parse(value)
      } else if (field === 'profession') {
        profileSchema.shape.profession.parse(value)
      } else if (field === 'regime') {
        profileSchema.shape.regime.parse(value)
      }
      
      setErrors(prev => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message }))
      }
    }
  }

  const validateAllFields = () => {
    try {
      profileSchema.parse({
        birthDate: formData.birthDate,
        profession: formData.profession,
        regime: formData.regime
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ValidationErrors] = err.message
          }
        })
        setErrors(newErrors)
        setTouched({ birthDate: true, profession: true, regime: true })
      }
      return false
    }
  }

  const handleNext = () => {
    if (validateAllFields()) {
      onNext()
    }
  }

  const handleFieldChange = (field: keyof ValidationErrors, value: any) => {
    updateFormData({ [field]: value })
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleFieldBlur = (field: keyof ValidationErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const value = field === 'birthDate' ? formData.birthDate : 
                  field === 'profession' ? formData.profession : 
                  formData.regime
    validateField(field, value)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <Card className="border-0 shadow-none overflow-visible">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">Mon profil</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="space-y-2" variants={itemVariants}>
            <Label className="text-base font-medium">
              Ma date de naissance <span className="text-assuflex-primary">*</span>
            </Label>
            <CustomDatePicker
              date={formData.birthDate}
              onDateChange={(date) => handleFieldChange('birthDate', date)}
              onBlur={() => handleFieldBlur('birthDate')}
              placeholder="JJ/MM/AAAA"
              className={`bg-background ${errors.birthDate && touched.birthDate ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.birthDate && touched.birthDate && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.birthDate}
              </motion.p>
            )}
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label className="text-base font-medium">
              Ma profession <span className="text-assuflex-primary">*</span>
            </Label>
            <Select 
              value={formData.profession} 
              onValueChange={(value) => handleFieldChange('profession', value)}
              onOpenChange={(open) => {
                if (!open) handleFieldBlur('profession')
              }}
            >
              <SelectTrigger className={`bg-background ${errors.profession && touched.profession ? 'border-red-500 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Sélectionnez votre profession" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border rounded-md shadow-md">
                <SelectItem value="Employe">salarié</SelectItem>
                <SelectItem value="independant">indépendant</SelectItem>
                <SelectItem value="Retraité">retraité</SelectItem>
                <SelectItem value="Autre">étudiant</SelectItem>
                <SelectItem value="sans emploi">sans emploi</SelectItem>
              </SelectContent>
            </Select>
            {errors.profession && touched.profession && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.profession}
              </motion.p>
            )}
          </motion.div>

          <motion.div className="space-y-2 overflow-visible" variants={itemVariants}>
            <Label className="text-base font-medium">
              Mon régime <span className="text-assuflex-primary">*</span>
            </Label>
            <Select 
              value={formData.regime} 
              onValueChange={(value) => handleFieldChange('regime', value)}
              onOpenChange={(open) => {
                if (!open) handleFieldBlur('regime')
              }}
            >
              <SelectTrigger className={`bg-background ${errors.regime && touched.regime ? 'border-red-500 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Sélectionnez votre régime" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border rounded-md shadow-md">
                <SelectItem value="général">général</SelectItem>
                <SelectItem value="RSI">RSI</SelectItem>
                <SelectItem value="MSA">MSA</SelectItem>
                <SelectItem value="Autre">Autre...</SelectItem>
              </SelectContent>
            </Select>
            {errors.regime && touched.regime && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.regime}
              </motion.p>
            )}
          </motion.div>

          <motion.div className="flex justify-between pt-4" variants={itemVariants}>
            <Button variant="outline" onClick={onPrevious}>
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default ProfileStep