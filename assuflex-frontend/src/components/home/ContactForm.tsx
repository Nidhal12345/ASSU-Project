import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { gsap } from "gsap"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Schéma de validation Zod
const formSchema = z.object({
  fullName: z.string().min(1, "Nom et prénom requis"),
  email: z.string().email("Email invalide"),
  phoneNumber: z.string().min(1, "Téléphone requis"),
  subject: z.string().optional(),
  callbackDate: z.string().optional(),
  callbackSlot: z.enum(["matin", "apres-midi", "soir"]).optional(),
  message: z.string().optional(),
  rgpd: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter" }) }),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, { opacity: 0, y: 50, duration: 0.6, ease: "power3.out" })
    }
  }, [])

  const onSubmit = (data: FormData) => {
    console.log("Données envoyées :", data)
    // TODO: appel API
  }

  return (
    <section className="relative bg-white py-24 px-6 sm:py-32 lg:px-8 overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">Contactez-nous</h2>
        <p className="mt-4 text-lg text-slate-700">
          Remplissez le formulaire ci-dessous pour recevoir une réponse rapide.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 mx-auto max-w-xl grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2"
      >
        {/* Nom complet */}
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Nom et prénom *</Label>
          <Input id="fullName" {...register("fullName")} className="mt-2" />
          {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} className="mt-2" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div className="sm:col-span-2">
          <Label htmlFor="phoneNumber">Téléphone *</Label>
          <Input id="phoneNumber" type="tel" {...register("phoneNumber")} className="mt-2" />
          {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>}
        </div>

        {/* Objet */}
        <div className="sm:col-span-2">
          <Label htmlFor="subject">Objet</Label>
          <Select>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choisissez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="devis-sante">Demande de devis santé</SelectItem>
              <SelectItem value="devis-prevoyance">Devis prévoyance</SelectItem>
              <SelectItem value="infos">Infos générales</SelectItem>
              <SelectItem value="rappel">Demande de rappel</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="sm:col-span-2">
          <Label htmlFor="callbackDate">Date de rappel souhaitée</Label>
          <Input id="callbackDate" type="date" {...register("callbackDate")} className="mt-2" />
        </div>

        {/* Créneau */}
        <div className="sm:col-span-2">
          <Label htmlFor="callbackSlot">Créneau</Label>
          <div className="mt-2 flex gap-4">
            {[
              { value: "matin", label: "Matin" },
              { value: "apres-midi", label: "Après-midi" },
              { value: "soir", label: "Soir" },
            ].map((slot) => (
              <label key={slot.value} className="inline-flex items-center">
                <input
                  type="radio"
                  value={slot.value}
                  {...register("callbackSlot")}
                  className="h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 capitalize text-slate-700">{slot.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" {...register("message")} rows={4} className="mt-2" />
        </div>

        {/* RGPD */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <Switch {...register("rgpd")} id="rgpd" className="mt-1" />
          <Label htmlFor="rgpd" className="text-sm text-slate-700">
            J’accepte que mes données soient utilisées pour être recontacté(e) par ASSUFLEX.
          </Label>
          {errors.rgpd && <p className="text-sm text-red-600 ml-auto">{errors.rgpd.message}</p>}
        </div>

        {/* Bouton */}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            className="w-full bg-[#FF6A00] text-white rounded-full py-3 hover:bg-[#e65c00]"
          >
            Envoyer ma demande
          </Button>
        </div>
      </form>
    </section>
  )
}
