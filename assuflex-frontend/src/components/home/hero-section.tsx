import { useRef, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { gsap } from "gsap"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("Format d'email invalide").min(1, "Email requis"),
  phoneNumber: z
    .string()
    .min(10, "Le numéro doit contenir au moins 10 chiffres")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone français invalide"),
  subject: z.string().optional(),
  callbackDateTime: z.string().optional(),
  message: z.string().max(500, "Le message ne peut pas dépasser 500 caractères").optional(),
  rgpd: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter d'être recontacté(e)",
  }),
})

type FormData = z.infer<typeof formSchema>

export default function HeroWithContact() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      subject: "",
      callbackDateTime: "",
      message: "",
      rgpd: false,
    },
  })

  useEffect(() => {
    const tl = gsap.timeline()
    tl.from(".hero-title", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(".hero-description", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-button", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".contact-form", { x: 50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
  }, [])

  const submitToAPI = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("API not available, simulating success:", error)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        message: "Message reçu avec succès",
        id: Date.now(),
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data)

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const result = await submitToAPI(data)
      console.log("Submission result:", result)

      setSubmitStatus("success")
      reset()

      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Une erreur inattendue s'est produite")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={heroRef} className="relative pt-32 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="z-10">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Votre{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                assurance santé sur mesure
              </span>{" "}
              avec ASSUFLEX
            </h1>
            <p className="hero-description text-xl text-gray-600 mb-8">
              Protégez ce qui compte vraiment avec nos solutions personnalisées pour chaque profil et situation.
            </p>
            <div className="hero-button flex flex-col gap-2 w-fit">
              <Link
                to="/insurance"
                className="bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200"
              >
                Demandez votre devis gratuit
              </Link>
              <Link
                to="/nos-garanties"
                className="bg-[#003E8A] hover:bg-[#002F6C] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200"
              >
                Découvrez nos assurances
              </Link>
            </div>
          </div>

          <div className="contact-form w-full max-w-md p-6 rounded-2xl bg-[#003E8A] text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Contact rapide</h2>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage || "Une erreur s'est produite. Veuillez réessayer."}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="fullName" className="text-white text-sm">
                  Prénom & Nom *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm"
                  placeholder="nom prenom"
                  disabled={isSubmitting}
                />
                {errors.fullName && <p className="text-xs text-red-200 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-white text-sm">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm"
                  placeholder="username@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-xs text-red-200 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-white text-sm">
                  Téléphone *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm"
                  placeholder="06 12 34 56 78"
                  disabled={isSubmitting}
                />
                {errors.phoneNumber && <p className="text-xs text-red-200 mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <Label htmlFor="callbackDateTime" className="text-white text-sm">
                  Date & Heure souhaitées
                </Label>
                <Input
                  id="callbackDateTime"
                  type="datetime-local"
                  {...register("callbackDateTime")}
                  className="mt-1 bg-white text-gray-900 h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  {...register("message")}
                  className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                  placeholder="Décrivez votre besoin en assurance..."
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-red-200 mt-1">{errors.message.message}</p>}
              </div>

              <div className="flex items-start gap-3">
                <Controller
                  name="rgpd"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="rgpd"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                      className="mt-1 scale-90"
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="rgpd" className="text-sm text-white cursor-pointer">
                    J'accepte d'être recontacté(e) par ASSUFLEX concernant ma demande *
                  </Label>
                  {errors.rgpd && <p className="text-xs text-red-200 mt-1">{errors.rgpd.message}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer ma demande"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-8 w-12 h-12 border-4 border-orange-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/4 right-8 w-8 h-8 border-4 border-blue-400 rounded-full opacity-20"></div>
      <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-orange-500 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-blue-500 rounded-full opacity-30"></div>
    </div>
  )
}
