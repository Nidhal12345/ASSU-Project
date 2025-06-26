import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Award, Clock, PiggyBank, Target } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      })
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className="feature-card bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-orange-400 flex items-center justify-center mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".why-choose-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".why-choose-description", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="why-choose-title text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Pourquoi choisir ASSUFLEX ?
          </h2>
          <p className="why-choose-description text-gray-600 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir le meilleur service et les meilleures garanties pour votre assurance santé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="Expertise"
            description="Plus de 15 ans d'expérience dans le domaine de l'assurance santé et une équipe de conseillers qualifiés."
            delay={0}
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6" />}
            title="Réactivité"
            description="Réponse sous 24h à toutes vos demandes et accompagnement personnalisé tout au long de votre contrat."
            delay={0.1}
          />
          <FeatureCard
            icon={<PiggyBank className="h-6 w-6" />}
            title="Tarifs Compétitifs"
            description="Des offres négociées avec nos partenaires assureurs pour vous garantir le meilleur rapport qualité/prix."
            delay={0.2}
          />
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="100% Adapté"
            description="Des solutions sur-mesure qui s'adaptent parfaitement à votre profil, votre budget et vos besoins spécifiques."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  )
}
