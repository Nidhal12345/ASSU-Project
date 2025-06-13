import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "../components/home/header"
import Footer from "../components/shared/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Eye, Building, Loader2, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

interface CoverageDetail {
  soinsCourants: number
  dentaire: number
  optique: number
  hospitalisation: number
}

interface InsuranceOffer {
  id: string
  name: string
  assureurName: string
  price: number
  coverage: CoverageDetail
  features: string[]
}

interface ApiResponse {
  offers: InsuranceOffer[]
}

export default function InsuranceComparison() {
  const [offers, setOffers] = useState<InsuranceOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInsuranceOffers()
  }, [])

  const fetchInsuranceOffers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post<ApiResponse>('http://localhost:8080/api/v1/quotes/simuler',JSON.parse(localStorage.getItem("formData") || "{}"), {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const { offers } = response.data
      setOffers(offers)
    } catch (err) {
      console.error('Error fetching insurance offers:', err)
      setError('Impossible de charger les offres d\'assurance. Veuillez réessayer.')
          } finally {
      setLoading(false)
    }
  }

  const retryFetch = () => {
    fetchInsuranceOffers()
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-12">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Recherche des meilleures offres...
              </h2>
              <p className="text-gray-500 text-center">
                Nous analysons les offres qui correspondent à vos besoins
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error && offers.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-12">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Erreur de chargement
              </h2>
              <p className="text-gray-500 text-center mb-6">{error}</p>
              <Button onClick={retryFetch} className="bg-blue-600 hover:bg-blue-700">
                Réessayer
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-12">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Voici les offres qui correspondent à vos besoins
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous avons sélectionné les meilleures offres d'assurance santé adaptées à votre profil
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-700 text-sm">
                  Certaines données peuvent ne pas être à jour. {error}
                </span>
              </div>
            </div>
          )}

          {offers.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Offres disponibles</h2>
              <div className="space-y-6">
                {offers.map((offer) => (
                  <InsuranceCard key={offer.id} offer={offer} />
                ))}
              </div>
            </>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Besoin d'aide pour choisir ? Nos conseillers sont là pour vous accompagner
            </p>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Contacter un conseiller
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function InsuranceCard({
  offer,
}: {
  offer: InsuranceOffer
}) {
    const navigate = useNavigate();
  const getCoverageLevel = (percentage: number): number => {
    if (percentage === 0) return 1
    if (percentage <= 33.33) return 2
    if (percentage <= 66.66) return 3
    return 4
  }

  const getCoverageColor = (percentage: number): string => {
    if (percentage === 0) return "bg-gray-400"
    if (percentage <= 33.33) return "bg-orange-500"
    if (percentage <= 66.66) return "bg-blue-600"
    return "bg-green-600"
  }

  const getCoverageLevelText = (percentage: number): string => {
    if (percentage === 0) return "Non couvert"
    if (percentage <= 33.33) return "Basique"
    if (percentage <= 66.66) return "Standard"
    return "Optimal"
  }

  const handleReceiveQuote = async () => {
    try {

      const formData = JSON.parse(localStorage.getItem("formData") || "{}")
      
      const payload = {
        ...formData,
        offerId: offer.id,
        offerName: offer.name,
        assureurName: offer.assureurName,
        monthlyPrice: offer.price,
        annualPrice: offer.price * 12,  
      }

    const quotePromise = axios.post('http://localhost:8080/api/v1/quotes/generate', payload, {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const response = await toast.promise(
    quotePromise,
    {
      loading: 'Génération du devis en cours...',
      success: 'Devis généré avec succès !',
      error: 'Erreur lors de la génération du devis. Veuillez réessayer.',
    }
  )

    } catch (error) {
      console.error('Error generating quote:', error)
    }
  }

  const handleSubscribeOffre = (offer: InsuranceOffer) => async () => {
    try {
      const formData = JSON.parse(localStorage.getItem("formData") || "{}")
      
      const payload = {
        ...formData,
        offerId: offer.id,
        offerName: offer.name,
        assureurName: offer.assureurName,
        monthlyPrice: offer.price,
        annualPrice: offer.price * 12,  
      }

      JSON.stringify(payload)

      localStorage.setItem("selectedOffer", JSON.stringify(payload))
      navigate(`/FileUpload/${offer.id}`);      
    } catch (error) {
      console.error('Error subscribing to offer:', error)
    }
  }

  return (
    <Card className="border-0 overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg hover:scale-[1.01] bg-white">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-r border-gray-200">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.name}</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">{offer.assureurName}</p>
              
              <div className="space-y-2">
                {offer.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 space-y-5">
            <CoverageBar
              label="Soins Courants"
              icon={<Heart className="w-4 h-4" />}
              percentage={offer.coverage.soinsCourants}
              color={getCoverageColor(offer.coverage.soinsCourants)}
              levelText={getCoverageLevelText(offer.coverage.soinsCourants)}
            />
            <CoverageBar
              label="Dentaire"
              icon={<Shield className="w-4 h-4" />}
              percentage={offer.coverage.dentaire}
              color={getCoverageColor(offer.coverage.dentaire)}
              levelText={getCoverageLevelText(offer.coverage.dentaire)}
            />
            <CoverageBar
              label="Optique"
              icon={<Eye className="w-4 h-4" />}
              percentage={offer.coverage.optique}
              color={getCoverageColor(offer.coverage.optique)}
              levelText={getCoverageLevelText(offer.coverage.optique)}
            />
            <CoverageBar
              label="Hospitalisation"
              icon={<Building className="w-4 h-4" />}
              percentage={offer.coverage.hospitalisation}
              color={getCoverageColor(offer.coverage.hospitalisation)}
              levelText={getCoverageLevelText(offer.coverage.hospitalisation)}
            />
          </div>

          <div className="lg:col-span-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-l border-gray-200 flex flex-col justify-between">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-800">
                {offer.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 font-medium">€/mois</div>
              <div className="text-xs text-gray-400 mt-1">
                {(offer.price * 12).toFixed(2)}€/an
              </div>
            </div>

            <div className="space-y-3">

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition-all duration-200"
                onClick={handleSubscribeOffre(offer)}
                >
                  Souscrire en ligne
                </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-3 transition-all duration-200"
                onClick={handleReceiveQuote}
              >
                Recevoir mon devis
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
  percentage,
  color,
  levelText,
}: {
  label: string
  icon: React.ReactNode
  percentage: number
  color: string
  levelText: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-gray-800">{percentage.toFixed(0)}%</span>
          <div className="text-xs text-gray-500">{levelText}</div>
        </div>
      </div>
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        ></div>
      </div>
    </div>
  )
}