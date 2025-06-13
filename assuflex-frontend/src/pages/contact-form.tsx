import type React from "react"
import { Header } from "../components/home/header"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { gsap } from "gsap"
import { Loader2 } from "lucide-react"
import Footer from "@/components/shared/footer"

export default function ContactFormPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const faqRef = useRef<HTMLDivElement>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      alert("Veuillez vérifier le reCAPTCHA")
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted:", formData)
    console.log("reCAPTCHA token:", recaptchaToken)

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !window.grecaptcha && !document.querySelector("#recaptcha-script")) {
      const script = document.createElement("script")
      script.id = "recaptcha-script"
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.onload = () => {
        setRecaptchaLoaded(true)
      }
      document.head.appendChild(script)
    } else if (typeof window !== "undefined" && window.grecaptcha) {
      setRecaptchaLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (recaptchaLoaded && recaptchaRef.current && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.render(recaptchaRef.current!, {
          sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
          callback: (token: string) => {
            setRecaptchaToken(token)
          },
        })
      })
    }
  }, [recaptchaLoaded])

  useEffect(() => {
    if (faqRef.current) {
      const faqItems = faqRef.current.querySelectorAll(".faq-item")

      gsap.fromTo(
        faqItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        },
      )
    }
  }, [])

  const faqs = [
    {
      question: "Comment puis-je suivre ma commande ?",
      answer:
        "Vous pouvez suivre votre commande en vous connectant à votre compte et en accédant à la section 'Mes commandes'. Vous y trouverez toutes les informations concernant l'état de votre livraison.",
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer:
        "Les délais de livraison varient généralement entre 3 et 5 jours ouvrables pour la France métropolitaine. Pour les livraisons internationales, comptez entre 7 et 14 jours selon la destination.",
    },
    {
      question: "Comment puis-je retourner un produit ?",
      answer:
        "Pour retourner un produit, connectez-vous à votre compte, sélectionnez la commande concernée et suivez les instructions pour générer une étiquette de retour. Vous disposez de 14 jours après réception pour nous retourner votre article.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer:
        "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal, ainsi que les virements bancaires pour les commandes professionnelles.",
    },
    {
      question: "Comment contacter le service client ?",
      answer:
        "Notre service client est disponible du lundi au vendredi de 9h à 18h par téléphone au 01 23 45 67 89 ou par email à support@exemple.fr. Vous pouvez également utiliser ce formulaire de contact.",
    },
  ]

  return (
    <>
    <Header></Header>
    <div className="flex flex-col lg:flex-row min-h-screen bg-white mt-12">
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex justify-center items-center">
        <div className="w-full max-w-xl p-8 bg-[#f6fafe] rounded-lg">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#093e78] mb-2">Merci pour votre message</h2>
              <p className="text-[#093e78] mb-6">Nous vous répondrons dans les plus brefs délais.</p>
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ nom: "", prenom: "", email: "", message: "" })
                  setRecaptchaToken("")
                  if (window.grecaptcha) {
                    window.grecaptcha.reset()
                  }
                }}
                className="bg-[#093e78] hover:bg-[#072a52] text-white"
              >
                Envoyer un nouveau message
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#093e78] mb-2">Nous contacter</h1>
                <p className="text-[#093e78]">À quel sujet souhaitez-vous nous contacter ?</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="text-sm font-medium text-[#093e78]">
                      Nom<span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#cbddee] focus:border-[#093e78] focus:ring-[#093e78]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="prenom" className="text-sm font-medium text-[#093e78]">
                      Prénom<span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#cbddee] focus:border-[#093e78] focus:ring-[#093e78]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#093e78]">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white border-[#cbddee] focus:border-[#093e78] focus:ring-[#093e78]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-[#093e78]">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[150px] bg-white border-[#cbddee] focus:border-[#093e78] focus:ring-[#093e78]"
                  />
                </div>

                <div className="mt-4">
                  <div ref={recaptchaRef} className="g-recaptcha"></div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !recaptchaToken}
                    className="px-12 py-3 bg-[#f26832] hover:bg-[#e05a26] text-white font-medium uppercase"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ENVOI EN COURS...
                      </>
                    ) : (
                      "ENVOYER"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-[#093e78] text-white flex items-center">
        <div className="w-full max-w-xl mx-auto" ref={faqRef}>
          <h2 className="text-2xl font-bold mb-8">Questions fréquentes</h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="faq-item border-b border-[#1a5694] pb-2">
                <AccordionTrigger className="text-left font-medium hover:text-[#f26832] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#cbddee]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement, options: any) => void
      reset: () => void
    }
  }
}
