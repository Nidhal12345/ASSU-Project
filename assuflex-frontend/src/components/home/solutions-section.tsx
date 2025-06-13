import { Shield } from "lucide-react"
import { AnimatedSection, StaggeredChildren, StaggeredChild } from "./animated-section"
import { motion } from "framer-motion"

export function SolutionsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-[#002d52] text-3xl font-bold mb-12">Découvrez Nos Solutions d'Assurance :</h2>
        </AnimatedSection>
        <StaggeredChildren className="grid md:grid-cols-3 gap-6" initialDelay={0.3} staggerDelay={0.15}>
          {[
            { title: "Mutuelle santé", icon: "health" },
            { title: "Prévoyance", icon: "protection" },
            { title: "Mutuelle santé", icon: "health" },
          ].map((solution, index) => (
            <StaggeredChild key={index}>
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center h-full"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="mb-4 text-[#0071cc]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Shield className="h-8 w-8" />
                </motion.div>
                <h3 className="text-[#002d52] font-medium mb-6">{solution.title}</h3>
                <motion.div className="mt-auto" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <a
                    href="#"
                    className="text-[#13acf7] text-sm hover:underline hover:text-[#0071cc] transition-colors duration-300"
                  >
                    Obtenir un tarif
                  </a>
                </motion.div>
              </motion.div>
            </StaggeredChild>
          ))}
        </StaggeredChildren>
      </div>
    </section>
  )
}
