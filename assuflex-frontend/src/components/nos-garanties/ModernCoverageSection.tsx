"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CoverageCard from "./CoverageCard"

gsap.registerPlugin(ScrollTrigger)

export default function ModernCoverageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".coverage-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".coverage-card", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".coverage-grid",
          start: "top 80%",
        },
      })
    }
  }, [])

  useEffect(() => {
    if (hoveredCard) {
      gsap.to(`#${hoveredCard}`, {
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [hoveredCard])

  const coverageTypes = [
    {
      id: "soins-courants",
      title: "Soins courants",
      description: "Consultations chez les médecins généralistes et spécialistes, analyses médicales, radiologies.",
      icon: "stethoscope",
      color: "blue",
    },
    {
      id: "hospitalisation",
      title: "Hospitalisation",
      description: "Frais d'hospitalisation, chambre particulière, frais de séjour, honoraires chirurgicaux.",
      icon: "hospital",
      color: "orange",
    },
    {
      id: "dentaire",
      title: "Dentaire",
      description: "Soins dentaires, prothèses, orthodontie, implantologie, prise en charge du 100% Santé.",
      icon: "tooth",
      color: "cyan",
    },
    {
      id: "optique",
      title: "Optique",
      description: "Lunettes, verres, lentilles, chirurgie réfractive, prise en charge du 100% Santé.",
      icon: "eye",
      color: "green",
    },
    {
      id: "aides-auditives",
      title: "Aides auditives",
      description: "Appareils auditifs, accessoires, prise en charge du 100% Santé.",
      icon: "ear",
      color: "purple",
    },
    {
      id: "medecines-douces",
      title: "Médecines douces",
      description: "Ostéopathie, acupuncture, chiropraxie, homéopathie.",
      icon: "leaf",
      color: "teal",
    },
    {
      id: "prevention",
      title: "Prévention",
      description: "Vaccinations, bilans de santé, dépistages.",
      icon: "shield",
      color: "indigo",
    },
    {
      id: "assistance",
      title: "Assistance",
      description: "Aide à domicile, garde d'enfants, transport médicalisé.",
      icon: "help",
      color: "red",
    },
    {
      id: "maternite",
      title: "Maternité",
      description: "Suivi de grossesse, accouchement, prime de naissance.",
      icon: "baby",
      color: "pink",
    },
    {
      id: "soins-etranger",
      title: "Soins à l'étranger",
      description: "Prise en charge des soins médicaux lors de séjours à l'étranger, rapatriement sanitaire.",
      icon: "globe",
      color: "amber",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="coverage-title text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Types de couvertures santé
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez l'ensemble des garanties proposées par ASSUFLEX pour une protection complète adaptée à vos besoins
          </p>
        </div>

        <div className="coverage-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {coverageTypes.map((coverage) => (
            <div
              key={coverage.id}
              id={coverage.id}
              onMouseEnter={() => setHoveredCard(coverage.id)}
              onMouseLeave={() => {
                setHoveredCard(null)
                gsap.to(`#${coverage.id}`, {
                  scale: 1,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  duration: 0.3,
                  ease: "power2.out",
                })
              }}
             >
              <CoverageCard
                title={coverage.title}
                description={coverage.description}
                icon={coverage.icon}
                color={coverage.color}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
