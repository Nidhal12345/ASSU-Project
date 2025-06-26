import type React from "react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FileText, MailOpen, CheckCircle } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  const addToStepsRef = (el: HTMLDivElement) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el)
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const description = descriptionRef.current
    const steps = stepsRef.current

    if (section && heading && description && steps.length) {
      gsap.set([heading, description, ...steps], { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })

      tl.fromTo(heading, { y: 50, autoAlpha: 0 }, { duration: 0.8, y: 0, autoAlpha: 1, ease: "power3.out" })
        .fromTo(
          description,
          { y: 30, autoAlpha: 0 },
          { duration: 0.8, y: 0, autoAlpha: 1, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          steps,
          { y: 50, autoAlpha: 0 },
          {
            duration: 0.8,
            y: 0,
            autoAlpha: 1,
            stagger: 0.2,
            ease: "power3.out",
            onComplete: () => {
              steps.forEach((step) => {
                step.addEventListener("mouseenter", () => {
                  gsap.to(step, {
                    backgroundColor: "#e5e7eb",
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out",
                  })
                })

                step.addEventListener("mouseleave", () => {
                  gsap.to(step, {
                    backgroundColor: "#e2e8f0",
                    y: 0,
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                    duration: 0.5,
                    ease: "power2.out",
                  })
                })
              })
            },
          },
          "-=0.2",
        )
    }

    return () => {
      if (steps.length) {
        steps.forEach((step) => {
          step.removeEventListener("mouseenter", () => {})
          step.removeEventListener("mouseleave", () => {})
        })
      }

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#f1faff] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-6 mb-12">
          <h2 ref={headingRef} className="text-4xl md:text-5xl font-bold text-gray-900">
            Comment ça marche
          </h2>
          <p ref={descriptionRef} className="mt-4 text-gray-600 max-w-xl">
            Obtenez votre mutuelle santé en 3 étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div ref={addToStepsRef} className="bg-gray-200 p-8 rounded-lg cursor-pointer transition-all">
            <FileText className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-gray-900">Remplissez votre profil</h3>
            <p className="text-gray-600">
              Quelques informations sur votre situation et vos besoins en santé
            </p>
          </div>

          <div ref={addToStepsRef} className="bg-gray-200 p-8 rounded-lg cursor-pointer transition-all">
            <MailOpen className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-gray-900">Recevez des offres personnalisées</h3>
            <p className="text-gray-600">
              Comparez les garanties et tarifs des meilleures mutuelles du marché
            </p>
          </div>

          <div ref={addToStepsRef} className="bg-gray-200 p-8 rounded-lg cursor-pointer transition-all">
            <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-gray-900">Souscrivez simplement</h3>
            <p className="text-gray-600">
              Finalisez votre contrat en ligne ou avec l'aide d'un conseiller
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
