import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Leaf, Briefcase, Building2, Check } from "lucide-react"
import { Link } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

interface Formula {
  name: string
  description: string
  features: string[]
  price: string
  recommended?: boolean
}

interface ProfilePackProps {
  title: string
  description: string
  features: string[]
  formulas: Formula[]
  isEnterprise?: boolean
}

export default function ProfilePacksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".packs-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".packs-tabs", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }
  }, [])

  const profilePacks: Record<string, ProfilePackProps> = {
    jeune: {
      title: "Pack Jeune actif / Étudiant",
      description: "Pour les jeunes en début de vie active ou en études supérieures",
      features: [
        "Couverture essentielle : soins courants, urgences, pharmacie et hospitalisation",
        "Offre économique respectant les obligations liées à la santé",
        "Adaptée à un budget limité sans négliger la qualité des remboursements",
        "Option possible pour inclure des séances de médecine douce ou des soins à l'étranger",
      ],
      formulas: [
        {
          name: "Éco",
          description: "Couverture minimale à petit prix",
          features: ["Soins courants", "Hospitalisation", "Pharmacie remboursable"],
          price: "À partir de 15€/mois",
        },
        {
          name: "Équilibre",
          description: "Bon rapport garanties / tarif",
          features: ["Soins courants", "Hospitalisation", "Pharmacie", "Optique basique", "Dentaire basique"],
          price: "À partir de 25€/mois",
          recommended: true,
        },
        {
          name: "Confort",
          description: "Renforts optique/dentaire et hospitalisation à 100%",
          features: [
            "Soins courants",
            "Hospitalisation 100%",
            "Pharmacie",
            "Optique renforcée",
            "Dentaire renforcé",
            "Médecines douces",
          ],
          price: "À partir de 35€/mois",
        },
      ],
    },
    famille: {
      title: "Pack Famille",
      description: "Pour protéger toute la famille à un tarif optimisé",
      features: [
        "Consultations pédiatriques, soins dentaires et optiques pour enfants et adultes",
        "Prise en charge des frais de maternité et de suivi de grossesse",
        "Garanties équilibrées pour la sécurité quotidienne",
        "Tarif optimisé pour toute la famille",
      ],
      formulas: [
        {
          name: "Éco",
          description: "Couverture minimale à petit prix",
          features: ["Soins courants", "Hospitalisation", "Pharmacie remboursable"],
          price: "À partir de 40€/mois",
        },
        {
          name: "Équilibre",
          description: "Bon rapport garanties / tarif",
          features: [
            "Soins courants",
            "Hospitalisation",
            "Pharmacie",
            "Optique basique",
            "Dentaire basique",
            "Maternité",
          ],
          price: "À partir de 60€/mois",
          recommended: true,
        },
        {
          name: "Confort",
          description: "Renforts optique/dentaire et hospitalisation à 100%",
          features: [
            "Soins courants",
            "Hospitalisation 100%",
            "Pharmacie",
            "Optique renforcée",
            "Dentaire renforcé",
            "Maternité premium",
            "Médecines douces",
          ],
          price: "À partir de 80€/mois",
        },
      ],
    },
    senior: {
      title: "Pack Senior / Retraité",
      description: "Pour les retraités ou personnes de plus de 60 ans",
      features: [
        "Besoins spécifiques liés à l'âge : hospitalisation, soins longue durée, aides auditives",
        "Remboursement renforcé sur les dépassements d'honoraires et équipements médicaux",
        "Services d'assistance inclus en cas d'immobilisation ou de retour à domicile",
        "Bonne couverture avec maîtrise des coûts",
      ],
      formulas: [
        {
          name: "Éco",
          description: "Couverture minimale à petit prix",
          features: ["Soins courants", "Hospitalisation", "Pharmacie remboursable"],
          price: "À partir de 45€/mois",
        },
        {
          name: "Équilibre",
          description: "Bon rapport garanties / tarif",
          features: [
            "Soins courants",
            "Hospitalisation",
            "Pharmacie",
            "Optique basique",
            "Dentaire basique",
            "Aides auditives",
          ],
          price: "À partir de 70€/mois",
          recommended: true,
        },
        {
          name: "Confort",
          description: "Renforts optique/dentaire et hospitalisation à 100%",
          features: [
            "Soins courants",
            "Hospitalisation 100%",
            "Pharmacie",
            "Optique renforcée",
            "Dentaire renforcé",
            "Aides auditives premium",
            "Médecines douces",
            "Assistance renforcée",
          ],
          price: "À partir de 95€/mois",
        },
      ],
    },
    tns: {
      title: "Pack Travailleur Indépendant (TNS)",
      description: "Pour les autoentrepreneurs, freelances et professions libérales",
      features: [
        "Protection complète : soins courants, hospitalisation, optique, dentaire",
        "Garanties adaptées à l'absence de mutuelle collective",
        "Options : médecine douce, prise en charge rapide des arrêts de travail",
        "Conciliation entre protection sociale et gestion autonome de l'activité",
      ],
      formulas: [
        {
          name: "Éco",
          description: "Couverture minimale à petit prix",
          features: ["Soins courants", "Hospitalisation", "Pharmacie remboursable"],
          price: "À partir de 30€/mois",
        },
        {
          name: "Équilibre",
          description: "Bon rapport garanties / tarif",
          features: [
            "Soins courants",
            "Hospitalisation",
            "Pharmacie",
            "Optique basique",
            "Dentaire basique",
            "Indemnités journalières",
          ],
          price: "À partir de 50€/mois",
          recommended: true,
        },
        {
          name: "Confort",
          description: "Renforts optique/dentaire et hospitalisation à 100%",
          features: [
            "Soins courants",
            "Hospitalisation 100%",
            "Pharmacie",
            "Optique renforcée",
            "Dentaire renforcé",
            "Indemnités journalières premium",
            "Médecines douces",
          ],
          price: "À partir de 75€/mois",
        },
      ],
    },
    entreprise: {
      title: "Pack Entreprise / TPE (collective)",
      description: "Pour les dirigeants souhaitant proposer une mutuelle à leurs salariés",
      features: [
        "Respect des obligations légales liées aux contrats collectifs santé",
        "Personnalisation selon la taille de l'entreprise et les profils des collaborateurs",
        "Accompagnement : mise en place du contrat, gestion RH et suivi administratif",
        "Valorisation de la politique sociale de l'entreprise avec optimisation des charges",
      ],
      formulas: [
        {
          name: "Éco",
          description: "Couverture minimale à petit prix",
          features: ["Soins courants", "Hospitalisation", "Pharmacie remboursable"],
          price: "Sur devis",
        },
        {
          name: "Équilibre",
          description: "Bon rapport garanties / tarif",
          features: ["Soins courants", "Hospitalisation", "Pharmacie", "Optique basique", "Dentaire basique"],
          price: "Sur devis",
          recommended: true,
        },
        {
          name: "Confort",
          description: "Renforts optique/dentaire et hospitalisation à 100%",
          features: [
            "Soins courants",
            "Hospitalisation 100%",
            "Pharmacie",
            "Optique renforcée",
            "Dentaire renforcé",
            "Médecines douces",
          ],
          price: "Sur devis",
        },
      ],
      isEnterprise: true,
    },
  }

  function ProfilePackCard({ title, description, features, formulas, isEnterprise = false }: ProfilePackProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current.querySelectorAll(".animate-item"), {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          },
        })
      }
    }, [])

    return (
      <Card ref={cardRef} className="w-full border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
          <CardTitle className="animate-item text-2xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="animate-item text-gray-700 text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="animate-item font-semibold text-lg mb-4 text-blue-700">Caractéristiques du pack</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="animate-item flex items-start">
                    <Check className="h-5 w-5 text-orange-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="animate-item font-semibold text-lg mb-4 text-blue-700">Formules disponibles</h3>
              <div className="grid gap-4">
                {formulas.map((formula, index) => (
                  <div
                    key={index}
                    className={`animate-item p-4 rounded-md border ${
                      formula.recommended
                        ? "border-orange-500 bg-gradient-to-r from-orange-50 to-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-blue-800">{formula.name}</h4>
                      {formula.recommended && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Recommandé</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{formula.description}</p>
                    <ul className="text-sm space-y-1 mb-3">
                      {formula.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="h-3 w-3 text-orange-500 mr-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="font-medium text-blue-700">{formula.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button size="lg" className="animate-item bg-gradient-to-r from-[#FF623E] via-[#FF623E] to-[#FF971B] text-white hover:opacity-90">
           <Link to={"/insurance"}>  {isEnterprise ? "Demander un devis entreprise" : "Obtenir un devis personnalisé"}           </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="packs-title text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Nos packs par profil
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des solutions adaptées à chaque étape de votre vie et à votre situation professionnelle
          </p>
        </div>

        <Tabs defaultValue="jeune" className="w-full packs-tabs">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 h-auto bg-gradient-to-r from-blue-50 to-orange-50 p-2 rounded-lg">
            <TabsTrigger
              value="jeune"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Jeune actif / Étudiant</span>
            </TabsTrigger>
            <TabsTrigger
              value="famille"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Users className="h-5 w-5 text-orange-500" />
              <span>Famille</span>
            </TabsTrigger>
            <TabsTrigger
              value="senior"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Leaf className="h-5 w-5 text-blue-600" />
              <span>Senior / Retraité</span>
            </TabsTrigger>
            <TabsTrigger
              value="tns"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Briefcase className="h-5 w-5 text-orange-500" />
              <span>Travailleur indépendant</span>
            </TabsTrigger>
            <TabsTrigger
              value="entreprise"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Entreprise / TPE</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jeune">
            <ProfilePackCard {...profilePacks.jeune} />
          </TabsContent>

          <TabsContent value="famille">
            <ProfilePackCard {...profilePacks.famille} />
          </TabsContent>

          <TabsContent value="senior">
            <ProfilePackCard {...profilePacks.senior} />
          </TabsContent>

          <TabsContent value="tns">
            <ProfilePackCard {...profilePacks.tns} />
          </TabsContent>

          <TabsContent value="entreprise">
            <ProfilePackCard {...profilePacks.entreprise} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
