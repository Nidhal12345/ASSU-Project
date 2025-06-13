import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface PartnerLogoProps {
  name: string
  logo: string
  delay: number
}

function PartnerLogo({ name, logo, delay }: PartnerLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay,
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top 85%",
        },
      })

      logoRef.current.addEventListener("mouseenter", () => {
        gsap.to(logoRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power1.out",
        })
      })

      logoRef.current.addEventListener("mouseleave", () => {
        gsap.to(logoRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power1.out",
        })
      })
    }
  }, [delay])

  return (
    <div
      ref={logoRef}
      className="partner-logo bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer transition-all"
    >
      <img src={logo || "/placeholder.svg"} alt={name} className="max-h-16" />
    </div>
  )
}

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".partners-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }
  }, [])

  const partners = [
    { name: "Harmonie Mutuelle", logo: "/placeholder.svg?height=100&width=200" },
    { name: "MGEN", logo: "/placeholder.svg?height=100&width=200" },
    { name: "Malakoff Humanis", logo: "/placeholder.svg?height=100&width=200" },
    { name: "AG2R La Mondiale", logo: "/placeholder.svg?height=100&width=200" },
    { name: "Apivia Macif", logo: "/placeholder.svg?height=100&width=200" },
    { name: "Mutuelle Générale", logo: "/placeholder.svg?height=100&width=200" },
    { name: "Swiss Life", logo: "/placeholder.svg?height=100&width=200" },
    { name: "APRIL Santé", logo: "/placeholder.svg?height=100&width=200" },
    { name: "AXA Santé", logo: "/placeholder.svg?height=100&width=200" },
    { name: "Alptis", logo: "/placeholder.svg?height=100&width=200" },
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="partners-title text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Nos partenaires assureurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ASSUFLEX collabore avec les meilleurs assureurs pour vous offrir des garanties optimales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <PartnerLogo key={index} name={partner.name} logo={partner.logo} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
