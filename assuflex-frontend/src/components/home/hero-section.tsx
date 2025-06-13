import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { gsap } from "gsap"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const formSchema = z.object({
  fullName: z.string().min(1, "Nom et prénom requis"),
  email: z.string().email("Email invalide"),
  phoneNumber: z.string().min(1, "Téléphone requis"),
  subject: z.string().optional(),
  callbackDateTime: z.string().optional(),
  message: z.string().optional(),
  rgpd: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter" }) }),
})

type FormData = z.infer<typeof formSchema>

export default function HeroWithContact() {
  const heroRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  useEffect(() => {
    const tl = gsap.timeline()
    tl.from(".hero-title", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(".hero-description", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-button", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".contact-form", { x: 50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
  }, [])

  const onSubmit = (data: FormData) => {
    console.log("Message envoyé :", data)
  }

  return (
    <div ref={heroRef} className="relative pt-32 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="z-10">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Votre <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">assurance santé sur mesure</span> avec ASSUFLEX
            </h1>
            <p className="hero-description text-xl text-gray-600 mb-8">
              Protégez ce qui compte vraiment avec nos solutions personnalisées pour chaque profil et situation.
            </p>
            <div className="hero-button flex flex-col gap-2 w-fit">
              <Link to="/insurance" className="bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200">
                Demandez votre devis gratuit
              </Link>
              <Link to="/nos-garanties" className="bg-[#003E8A] hover:bg-[#002F6C] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200">
                Découvrez nos assurances
              </Link>
            </div>
          </div>

          <div className="contact-form w-full max-w-md p-6 rounded-2xl bg-[#003E8A] text-white shadow-xl">
  <h2 className="text-2xl font-bold mb-4">Contact rapide</h2>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
    <div>
      <Label htmlFor="fullName" className="text-white text-sm">Prénom & Nom</Label>
      <Input id="fullName" {...register("fullName")} className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm" />
      {errors.fullName && <p className="text-xs text-red-200 mt-1">{errors.fullName.message}</p>}
    </div>

    <div>
      <Label htmlFor="email" className="text-white text-sm">Email</Label>
      <Input id="email" type="email" {...register("email")} className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm" />
      {errors.email && <p className="text-xs text-red-200 mt-1">{errors.email.message}</p>}
    </div>

    <div>
      <Label htmlFor="phoneNumber" className="text-white text-sm">Téléphone</Label>
      <Input id="phoneNumber" type="tel" {...register("phoneNumber")} className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 h-10 text-sm" />
      {errors.phoneNumber && <p className="text-xs text-red-200 mt-1">{errors.phoneNumber.message}</p>}
    </div>

    <div>
      <Label htmlFor="callbackDateTime" className="text-white text-sm">Date & Heure souhaitées</Label>
      <Input id="callbackDateTime" type="datetime-local" {...register("callbackDateTime")} className="mt-1 bg-white text-gray-900 h-10 text-sm" />
    </div>

    <div>
      <Label htmlFor="message" className="text-white text-sm">Message</Label>
      <Textarea id="message" rows={3} {...register("message")} className="mt-1 bg-white text-gray-900 placeholder:text-gray-400 text-sm" />
    </div>

    <div className="flex items-center gap-3">
      <Switch {...register("rgpd")} id="rgpd" className="mt-1 scale-90" />
      <Label htmlFor="rgpd" className="text-sm text-white">
        J’accepte d’être recontacté(e)
      </Label>
    </div>

    <Button type="submit" className=" bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200">
      Envoyer
    </Button>
  </form>
</div>

        </div>
      </div>

      {/* Déco */}
      <div className="absolute top-1/4 left-8 w-12 h-12 border-4 border-orange-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/4 right-8 w-8 h-8 border-4 border-blue-400 rounded-full opacity-20"></div>
      <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-orange-500 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-blue-500 rounded-full opacity-30"></div>
    </div>
  )
}