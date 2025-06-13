import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { AnimatedSection } from "./animated-section"

type FAQItem = {
  question: string
  answer: string
}

const healthInsuranceFAQs: FAQItem[] = [
  {
    question: "Qu'est-ce qu'une mutuelle santé ?",
    answer:
      "Une mutuelle santé est un contrat qui complète les remboursements de l'Assurance Maladie obligatoire. Elle prend en charge tout ou partie des frais de santé non remboursés par la Sécurité sociale, comme certains soins dentaires, optiques ou d'hospitalisation.",
  },
  {
    question: "Quelle est la différence entre une mutuelle et une complémentaire santé ?",
    answer:
      "Les termes sont souvent utilisés de façon interchangeable. La différence principale réside dans le statut de l'organisme : une mutuelle est une société à but non lucratif régie par le Code de la Mutualité, tandis qu'une complémentaire peut être proposée par une société d'assurance commerciale.",
  },
  {
    question: "Comment choisir ma mutuelle santé ?",
    answer:
      "Pour choisir votre mutuelle santé, analysez vos besoins médicaux spécifiques (lunettes, soins dentaires, hospitalisation), comparez les garanties et les tarifs de plusieurs offres, vérifiez les délais de carence et les plafonds de remboursement, et assurez-vous que votre médecin est dans le réseau de soins si la mutuelle en propose un.",
  },
  {
    question: "Quels sont les délais de remboursement ?",
    answer:
      "Les délais de remboursement varient selon les mutuelles, mais généralement, pour les soins courants, le remboursement intervient sous 48h à 5 jours après le remboursement de la Sécurité sociale. Pour les soins plus importants nécessitant une analyse du dossier, comptez 1 à 2 semaines.",
  },
  {
    question: "Qu'est-ce que le ticket modérateur ?",
    answer:
      "Le ticket modérateur est la partie des dépenses de santé qui reste à votre charge après le remboursement de l'Assurance Maladie obligatoire. C'est cette partie que la mutuelle santé peut prendre en charge partiellement ou totalement selon votre contrat.",
  },
  {
    question: "Puis-je changer de mutuelle à tout moment ?",
    answer:
      "Depuis la loi Hamon de 2015, vous pouvez résilier votre contrat de mutuelle santé à tout moment après un an d'engagement. Il vous suffit d'envoyer une lettre de résiliation, et votre nouvelle mutuelle peut s'occuper des démarches de résiliation pour vous.",
  },
  {
    question: "Comment sont calculées les cotisations d'une mutuelle santé ?",
    answer:
      "Les cotisations sont généralement calculées en fonction de votre âge, parfois de votre lieu de résidence, et du niveau de garanties choisi. Contrairement aux idées reçues, l'état de santé n'entre pas en compte dans le calcul des cotisations d'une mutuelle santé.",
  },
  {
    question: "Qu'est-ce que le tiers payant ?",
    answer:
      "Le tiers payant est un système qui vous évite d'avancer les frais médicaux. Avec ce dispositif, la Sécurité sociale et/ou votre mutuelle règlent directement le professionnel de santé. Vous n'avez donc pas à faire l'avance des frais couverts par votre contrat.",
  },
  {
    question: "Les lunettes sont-elles bien remboursées ?",
    answer:
      "Le remboursement des lunettes dépend du niveau de garantie de votre mutuelle. Avec la réforme 100% Santé, vous pouvez bénéficier de lunettes sans reste à charge si vous choisissez des équipements du panier 100% Santé. Pour les autres équipements, le remboursement varie selon votre contrat.",
  },
  {
    question: "Y a-t-il un délai de carence pour les soins dentaires ?",
    answer:
      "La plupart des mutuelles appliquent un délai de carence pour les soins dentaires coûteux (prothèses, implants), généralement de 3 à 6 mois. Pendant cette période, vous cotisez mais ne bénéficiez pas encore des remboursements pour ces soins spécifiques. Les soins courants sont souvent remboursés immédiatement.",
  },
]

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-gray-200 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="flex justify-between items-center w-full text-left font-medium text-[#002d52] hover:text-[#0071cc] transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-[#394756] text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  return (
    <section className="py-16 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#002d52] mb-4">Questions fréquentes sur la mutuelle santé</h2>
          <p className="text-[#394756] max-w-2xl mx-auto">
            Trouvez rapidement des réponses aux questions les plus courantes concernant nos services d'assurance santé.
          </p>
        </AnimatedSection>

        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12 grid-col-lg-8 mx-auto">
              <AnimatedSection className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-2">
                  {healthInsuranceFAQs.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
