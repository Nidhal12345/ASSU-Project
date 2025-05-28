import type React from "react"
import { useState } from "react"
import { Header } from "../components/home/header"
import Footer from "../components/shared/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Heart, Shield, Eye, Building, Filter } from "lucide-react"

export default function InsuranceComparison() {
  const [soinsCourantsLevel, setSoinsCourantsLevel] = useState(3)
  const [dentaireLevel, setDentaireLevel] = useState(3)
  const [optiqueLevel, setOptiqueLevel] = useState(3)
  const [hospitalisationLevel, setHospitalisationLevel] = useState(3)
  const [budgetLevel, setBudgetLevel] = useState(3)

  const averageLevel = Math.round((soinsCourantsLevel + dentaireLevel + optiqueLevel + hospitalisationLevel) / 4)

  return (
    <>
    <Header></Header>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-12">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">voici les offres qui correspondent à vos besoins</h1>

        <Card className="mb-10 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
            <h2 className="text-lg font-medium text-white">Modifiez vos besoins</h2>
          </div>
          <CardContent className="p-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <CoverageOption
                title="Soins courants"
                icon={<Heart className="w-5 h-5" />}
                level={soinsCourantsLevel}
                onLevelChange={(value) => setSoinsCourantsLevel(value)}
                example={`Ex : pour une consultation spécialiste conventionné secteur 2, vous serez remboursé jusqu'à ${
                  soinsCourantsLevel === 1
                    ? "20€"
                    : soinsCourantsLevel === 2
                      ? "25€"
                      : soinsCourantsLevel === 3
                        ? "32€"
                        : "40€"
                }`}
              />

              <CoverageOption
                title="Dentaire"
                icon={<Shield className="w-5 h-5" />}
                level={dentaireLevel}
                onLevelChange={(value) => setDentaireLevel(value)}
                example={`Ex : pour une couronne céramo-métallique sur molaire, vous serez remboursé jusqu'à ${
                  dentaireLevel === 1 ? "75€" : dentaireLevel === 2 ? "95€" : dentaireLevel === 3 ? "116€" : "150€"
                }`}
              />

              <CoverageOption
                title="Optique"
                icon={<Eye className="w-5 h-5" />}
                level={optiqueLevel}
                onLevelChange={(value) => setOptiqueLevel(value)}
                example={`Ex : pour une paire de lunettes à verres complexes, vous serez remboursé jusqu'à ${
                  optiqueLevel === 1 ? "60€" : optiqueLevel === 2 ? "80€" : optiqueLevel === 3 ? "100€" : "150€"
                }`}
              />

              <CoverageOption
                title="Hospitalisation"
                icon={<Building className="w-5 h-5" />}
                level={hospitalisationLevel}
                onLevelChange={(value) => setHospitalisationLevel(value)}
                example={`Ex : pour une opération de la cataracte, vous serez remboursé jusqu'à ${
                  hospitalisationLevel === 1
                    ? "200€"
                    : hospitalisationLevel === 2
                      ? "270€"
                      : hospitalisationLevel === 3
                        ? "339€"
                        : "400€"
                }`}
              />
            </div>

            <div className="mt-10 border-t pt-8">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Budget mensuel</h2>
              <div className="px-4">
                <div className="mb-2">
                  <Slider
                    defaultValue={[budgetLevel]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={(value) => setBudgetLevel(value[0])}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-500 [&>span:first-child_span]:bg-blue-500"
                  />
                </div>
                <div className="flex justify-between mt-2 mb-6 text-sm text-gray-600">
                  <span>48€</span>
                  <span>67€</span>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">Offre personnalisée</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Recommandée
          </Badge>
        </h2>

        <div className="mb-10">
          <RecommendationCard
            id="1"
            level={averageLevel}
            soinsCourantsLevel={soinsCourantsLevel}
            dentaireLevel={dentaireLevel}
            optiqueLevel={optiqueLevel}
            hospitalisationLevel={hospitalisationLevel}
            isHighlighted={true}
            buttonColor="orange"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Autres offres</h2>

        <div className="space-y-6">
          <RecommendationCard
            id="2"
            level={Math.min(averageLevel + 1, 4)}
            soinsCourantsLevel={Math.min(soinsCourantsLevel + 1, 4)}
            dentaireLevel={Math.min(dentaireLevel + 1, 4)}
            optiqueLevel={Math.min(optiqueLevel + 1, 4)}
            hospitalisationLevel={Math.min(hospitalisationLevel + 1, 4)}
            isHighlighted={false}
            buttonColor="orange"
          />
          <RecommendationCard
            id="3"
            level={Math.max(averageLevel - 1, 1)}
            soinsCourantsLevel={Math.max(soinsCourantsLevel - 1, 1)}
            dentaireLevel={Math.max(dentaireLevel - 1, 1)}
            optiqueLevel={Math.max(optiqueLevel - 1, 1)}
            hospitalisationLevel={Math.max(hospitalisationLevel - 1, 1)}
            isHighlighted={false}
            buttonColor="orange"
          />
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

function CoverageOption({
  title,
  icon,
  level,
  onLevelChange,
  example,
}: {
  title: string
  icon: React.ReactNode
  level: number
  onLevelChange: (value: number) => void
  example: string
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">{icon}</div>
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>

      <div className="px-1">
        <Slider
          defaultValue={[level]}
          min={1}
          max={4}
          step={1}
          onValueChange={(value) => onLevelChange(value[0])}
          className="[&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-500 [&>span:first-child_span]:bg-blue-500"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Min</span>
        <span>Max</span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{example}</p>
    </div>
  )
}

function RecommendationCard({
  id,
  level,
  soinsCourantsLevel,
  dentaireLevel,
  optiqueLevel,
  hospitalisationLevel,
  isHighlighted,
}: {
  id: string
  level: number
  soinsCourantsLevel: number
  dentaireLevel: number
  optiqueLevel: number
  hospitalisationLevel: number
  isHighlighted: boolean
  buttonColor: string
}) {
  const getCoveragePercentage = (level: number) => (level === 1 ? 75 : level === 2 ? 85 : level === 3 ? 95 : 100)
  const price = level === 1 ? "49.99" : level === 2 ? "54.99" : level === 3 ? "59.99" : "64.99"

  const levelLabels = ["Basique", "Standard", "Optimal", "Premium"]

  return (
    <Card
      className={`border-0 overflow-hidden transition-all hover:shadow-xl ${
        isHighlighted ? "shadow-lg ring-2 ring-blue-500" : "shadow-md hover:scale-[1.01]"
      }`}
    >
      {isHighlighted && (
        <div className="bg-blue-600 text-white text-center py-1.5 text-sm font-medium">Recommandé pour vous</div>
      )}
      <CardContent className={`p-0 ${isHighlighted ? "" : "border-t-4 border-gray-200"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start p-6 bg-gray-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">Formule {levelLabels[level - 1]}</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Sans délai d'attente</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Tiers payant inclus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <CoverageBar
              label="Soins Courants"
              icon={<Heart className="w-4 h-4" />}
              value={getCoveragePercentage(soinsCourantsLevel)}
              level={soinsCourantsLevel}
            />
            <CoverageBar
              label="Dentaire"
              icon={<Shield className="w-4 h-4" />}
              value={getCoveragePercentage(dentaireLevel)}
              level={dentaireLevel}
            />
            <CoverageBar
              label="Optique"
              icon={<Eye className="w-4 h-4" />}
              value={getCoveragePercentage(optiqueLevel)}
              level={optiqueLevel}
            />
            <CoverageBar
              label="Hospitalisation"
              icon={<Building className="w-4 h-4" />}
              value={getCoveragePercentage(hospitalisationLevel)}
              level={hospitalisationLevel}
            />
          </div>

          <div className="bg-gray-50 p-6 flex flex-col justify-between">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-800">{price}</div>
              <div className="text-sm text-gray-500">€/mois</div>
            </div>

            <div className="space-y-3">
              <Button className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5`}>
                Souscrire en ligne
              </Button>
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-medium py-2.5"
              >
                Recevoir un devis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CoverageBar({
  label,
  icon,
  value,
  level,
}: {
  label: string
  icon: React.ReactNode
  value: number
  level: number
}) {
  const getColorByLevel = (level: number) => {
    switch (level) {
      case 1:
        return "bg-gray-600"
      case 2:
        return "bg-blue-600"
      case 3:
        return "bg-indigo-600"
      case 4:
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${getColorByLevel(level)} rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
      </div>
    </div>
  )
}
