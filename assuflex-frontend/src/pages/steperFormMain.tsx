import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ContractStep from "../components/steps/ContractStep"
import NeedsStep from "../components/steps/NeedsStep"
import ProfileStep from "../components/steps/ProfileStep"
import ContactStep from "../components/steps/ContactStep"
import ProgressBar from "../components/steps/ProgressBar"
import { Header } from "../components/steps/Header-steper"
import gsap from "gsap"

export interface FormData {
  coverageOption: string
  startDate: Date | undefined

  spouseFirstName?: string
  spouseLastName?: string
  spouseBirthDate?: Date

  childrenCount?: number
  childrenInfo?: {
    firstName: string
    lastName: string
    birthDate?: Date
  }[]

  regularCare: number
  hospitalization: number
  dental: number
  optical: number

  birthDate: Date | undefined
  profession: string
  regime: string

  civility: string
  firstName: string
  lastName: string
  postalCode: string
  phoneNumber: string
  email: string
}

const initialFormData: FormData = {
  coverageOption: "",
  startDate: undefined,

  spouseFirstName: "",
  spouseLastName: "",
  spouseBirthDate: undefined,

  childrenCount: 0,
  childrenInfo: [],

  regularCare: 33.33,
  hospitalization: 33.33,
  dental: 33.33,
  optical: 33.33,
  birthDate: undefined,
  profession: "",
  regime: "",
  civility: "Madame",
  firstName: "",
  lastName: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
}

function steperFormMain() {
  const Navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [direction, setDirection] = useState(0)
  
  const totalSteps = 4

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
      animateStepTransition(1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
      animateStepTransition(-1)
    }
  }

  const animateStepTransition = (direction: number) => {
    const container = document.querySelector(".step-container")
    if (container) {
      gsap.fromTo(
        container,
        {
          x: direction > 0 ? 100 : -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
      )
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData)
    Navigate("/offre")
  }

  const renderStep = () => {
    return (
      <div className="step-container relative w-full overflow-hidden">
        {currentStep === 0 && <ContractStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
        {currentStep === 1 && (
          <NeedsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 2 && (
          <ProfileStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 3 && (
          <ContactStep
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Header></Header>
      <div className="min-h-screen bg-background flex justify-center items-start py-8 px-4">
        <div className="mt-24 w-full max-w-2xl bg-card rounded-lg shadow-sm overflow-hidden">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          {renderStep()}
        </div>
      </div>
    </>
  )
}

export default steperFormMain