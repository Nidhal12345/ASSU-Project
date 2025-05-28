import { motion } from "framer-motion"
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

const ProfileStep = ({ formData, updateFormData, onNext, onPrevious }: ProfileStepProps) => {
  const isStepValid = formData.birthDate && formData.profession && formData.regime

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
              onDateChange={(date) => updateFormData({ birthDate: date })}
              placeholder="JJ/MM/AAAA"
              className="bg-background"
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label className="text-base font-medium">
              Ma profession <span className="text-assuflex-primary">*</span>
            </Label>
            <Select value={formData.profession} onValueChange={(value) => updateFormData({ profession: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionnez votre profession" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border rounded-md shadow-md">
                <SelectItem value="Employé">Employé</SelectItem>
                <SelectItem value="Sans profession">Sans profession</SelectItem>
                <SelectItem value="Retraité">Retraité</SelectItem>
                <SelectItem value="Autre">Autre...</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="space-y-2 overflow-visible" variants={itemVariants}>
            <Label className="text-base font-medium">
              Mon régime <span className="text-assuflex-primary">*</span>
            </Label>
            <Select value={formData.regime} onValueChange={(value) => updateFormData({ regime: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionnez votre régime" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border rounded-md shadow-md">
                <SelectItem value="Régime général">Régime général</SelectItem>
                <SelectItem value="Régime local">Régime local</SelectItem>
                <SelectItem value="Régime TNS">Régime TNS</SelectItem>
                <SelectItem value="Autre">Autre...</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="flex justify-between pt-4" variants={itemVariants}>
            <Button variant="outline" onClick={onPrevious}>
              Précédent
            </Button>
            <Button
              onClick={onNext}
              disabled={!isStepValid}
              className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white"
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

