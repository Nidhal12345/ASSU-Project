import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .from(
        ".hero-description",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .from(
        ".hero-button",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4",
      )
      .from(
        ".hero-image",
        {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6",
      )

    if (heroRef.current) {
      gsap.to(".hero-image", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative pt-32 flex items-center pb-16 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Découvrez nos{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              garanties santé
              </span>{" "}
              avec ASSUFLEX
            </h1>
            <p className="hero-description text-xl text-gray-600 mb-8">
              Protégez ce qui compte vraiment avec nos solutions personnalisées pour chaque profil et situation
            </p>
            <div className="hero-button flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full py-3 px-6 text-lg font-medium transition-colors duration-200">
                <Link to={"/insurance"}>Demander un devis gratuit
                </Link>
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
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
