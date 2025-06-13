import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Header } from "../components/home/header"
import Footer from "../components/shared/Footer"
import HeroSection from "../components/nos-garanties/HeroSection"
import WhyChooseSection from "../components/nos-garanties/WhyChooseSection"
import ProfilePacksSection from "../components/nos-garanties/ProfilePacksSection"
import ModernCoverageSection from "../components/nos-garanties/ModernCoverageSection"
import PartnersSection from "../components/nos-garanties/PartnersSection"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

export default function NosGaranties() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <WhyChooseSection />
        <ProfilePacksSection />
        <ModernCoverageSection />
        <PartnersSection />
        <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full opacity-10"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'un conseil personnalisé ?</h2>
              <p className="text-lg mb-8 text-white/90">
                Nos conseillers sont à votre disposition pour vous aider à choisir la solution la plus adaptée à vos
                besoins et à votre budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={"/insurance"}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Demander un devis
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
            <Link to={"/contact"}>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
                  Nous contacter
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
