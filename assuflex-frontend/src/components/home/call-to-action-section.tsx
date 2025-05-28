import { motion } from "framer-motion"
import { AnimatedSection } from "./animated-section"

export function CallToActionSection() {
  return (
    <section className="py-16 bg-[#002d52] text-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Obtenez votre devis en 2 minutes</h2>
          <p className="text-lg text-gray-300 mb-8">
            Remplissez notre formulaire simple et recevez instantanément des offres adaptées à vos besoins
          </p>
          <motion.a
            href="/insurance"
            className="bg-[#f25305] hover:bg-[#f8aa36] text-white font-medium px-8 py-4 rounded-md text-center inline-block transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Je simule ma mutuelle santé
          </motion.a>
        </AnimatedSection>
      </div>
    </section>
  )
}
