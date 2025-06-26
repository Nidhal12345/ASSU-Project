import { useRef, useEffect } from "react"
import { GraduationCap, Users, HeartPulse, Briefcase, Building } from "lucide-react"
import {Link} from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

const packages = [
  {
    id: "jeune",
    title: "Jeune actif / étudiant",
    description: "Couverture essentielle à petit prix pour les jeunes en bonne santé",
    icon: <GraduationCap className="h-10 w-10" />,
    color: "#f25305",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    id: "famille",
    title: "Famille",
    description: "Protection complète pour toute la famille avec options pédiatriques",
    icon: <Users className="h-10 w-10" />,
    color: "#f25305",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    id: "senior",
    title: "Senior / retraité",
    description: "Garanties renforcées pour les soins spécifiques aux seniors",
    icon: <HeartPulse className="h-10 w-10" />,
    color: "#f25305",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    id: "tns",
    title: "Travailleur indépendant (TNS)",
    description: "Solutions fiscalement avantageuses pour les indépendants",
    icon: <Briefcase className="h-10 w-10" />,
    color: "#f25305",
    lightColor: "bg-sky-50",
    borderColor: "border-sky-100",
  },
  {
    id: "entreprise",
    title: "Entreprise / TPE",
    description: "Offres collectives adaptées aux besoins de vos salariés",
    icon: <Building className="h-10 w-10" />,
    color: "#f25305",
    lightColor: "bg-slate-50",
    borderColor: "border-slate-100",
  },
]

export function HealthPackagesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)

  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (cardsRef.current) {
      cardsRef.current[index] = el
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const cards = cardsRef.current.filter(Boolean)
    const section = sectionRef.current
    const heading = headingRef.current
    const subheading = subheadingRef.current
    const cta = ctaRef.current

    if (cards.length && section && heading && subheading && cta) {
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })

      mainTl
        .fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .fromTo(subheading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")

      mainTl.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3",
      )

      mainTl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.2")
    }

    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-28 lg:py-32 bg-gradient-to-b from-slate-100 to-white relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-100 to-transparent"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-50 opacity-60 blur-[100px]"></div>
        <div className="absolute top-[30%] -left-[5%] w-[20%] h-[40%] rounded-full bg-emerald-50 opacity-50 blur-[80px]"></div>

        <div className="absolute inset-0 bg-grid-slate-200/40 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Nos packs santé par profil
          </h2>

          <p ref={subheadingRef} className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Des solutions adaptées à chaque situation personnelle et professionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              ref={(el) => setCardRef(el, index)}
              className={cn(
                "bg-white rounded-xl overflow-hidden h-full flex flex-col",
                "border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300",
                pkg.borderColor,
              )}
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className={`relative mr-5 ${pkg.lightColor} p-3 rounded-lg`} style={{ color: pkg.color }}>
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{pkg.title}</h3>
                </div>

                <p className="text-slate-600 mb-8 flex-grow">{pkg.description}</p>

                <div className="mt-auto">
                  <Link
                    to={"/nos-garanties"}
                    className="inline-flex items-center font-medium transition-colors duration-300"
                    style={{ color: pkg.color }}
                  >
                    <div className="flex items-center">
                      <span>Découvrir</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HealthPackagesSection
