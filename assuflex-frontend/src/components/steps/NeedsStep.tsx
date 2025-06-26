import { motion } from "framer-motion"
import type { FormData } from "../../pages/steperFormMain"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Hospital, Smile, Eye } from "lucide-react"

interface NeedsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const NeedsStep = ({ formData, updateFormData, onNext, onPrevious }: NeedsStepProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
        when: "beforeChildren",  
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">Mon Besoins</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-assuflex-secondary" />
              <span className="font-medium">Soins courants</span>
            </div>
            <div className="pl-8">
              <Slider
                value={[formData.regularCare]}
                max={100}
                step={33.33}
                onValueChange={(value) => {
                  const levels = [0, 33.33, 66.66, 100]
                  const closest = levels.reduce((prev, curr) => {
                    return Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
                  })
                  updateFormData({ regularCare: closest })
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                <span>Basique</span>
                <span>Modéré</span>
                <span>Élevé</span>
                <span>Premium</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <Hospital size={18} className="text-assuflex-secondary" />
              <span className="font-medium">Hospitalisation</span>
            </div>
            <div className="pl-8">
              <Slider
                value={[formData.hospitalization]}
                max={100}
                step={33.33}
                onValueChange={(value) => {
                  const levels = [0, 33.33, 66.66, 100]
                  const closest = levels.reduce((prev, curr) => {
                    return Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
                  })
                  updateFormData({ hospitalization: closest })
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                <span>Basique</span>
                <span>Modéré</span>
                <span>Élevé</span>
                <span>Premium</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <Smile size={18} className="text-assuflex-secondary" />
              <span className="font-medium">Dentaire</span>
            </div>
            <div className="pl-8">
              <Slider
                value={[formData.dental]}
                max={100}
                step={33.33}
                onValueChange={(value) => {
                  const levels = [0, 33.33, 66.66, 100]
                  const closest = levels.reduce((prev, curr) => {
                    return Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
                  })
                  updateFormData({ dental: closest })
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                <span>Basique</span>
                <span>Modéré</span>
                <span>Élevé</span>
                <span>Premium</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <Eye size={18} className="text-assuflex-secondary" />
              <span className="font-medium">Optique</span>
            </div>
            <div className="pl-8">
              <Slider
                value={[formData.optical]}
                max={100}
                step={33.33}
                onValueChange={(value) => {
                  const levels = [0, 33.33, 66.66, 100]
                  const closest = levels.reduce((prev, curr) => {
                    return Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
                  })
                  updateFormData({ optical: closest })
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                <span>Basique</span>
                <span>Modéré</span>
                <span>Élevé</span>
                <span>Premium</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex justify-between pt-4" variants={itemVariants}>
            <Button variant="outline" onClick={onPrevious}>
              Précédent
            </Button>
            <Button onClick={onNext} className="bg-assuflex-primary hover:bg-assuflex-primary-dark text-white">
              Suivant
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default NeedsStep
