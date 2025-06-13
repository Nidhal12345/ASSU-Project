import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const testimonials = [
  {
    id: 1,
    name: "Sophie M.",
    role: "Infirmière libérale",
    content:
      "J'ai trouvé une mutuelle parfaitement adaptée à mon statut d'indépendante. Le conseiller a été très à l'écoute et m'a proposé une solution sur mesure avec un excellent rapport qualité-prix.",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas L.",
    role: "Jeune actif",
    content:
      "Démarche simple et rapide. J'ai pu comparer plusieurs offres et choisir celle qui me convenait le mieux. La souscription en ligne s'est faite en quelques minutes !",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie et Pierre D.",
    role: "Famille avec 2 enfants",
    content:
      "Nous cherchions une mutuelle familiale avec une bonne couverture pour les enfants. ASSUFLEX nous a trouvé la solution idéale, avec des garanties orthodontie qui nous ont fait économiser beaucoup.",
    rating: 4,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#002d52] mb-4">Témoignages clients</h2>
          <p className="text-[#394756] max-w-2xl mx-auto">Découvrez ce que nos clients pensent de nos services</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={0.2 * index}>
              <motion.div
                className="bg-[#f8f9fa] p-6 rounded-lg shadow-sm h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-[#f8aa36] fill-[#f8aa36]" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[#394756] italic mb-4 flex-grow">"{testimonial.content}"</p>
                <div className="mt-auto">
                  <p className="font-bold text-[#002d52]">{testimonial.name}</p>
                  <p className="text-sm text-[#6c757d]">{testimonial.role}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
