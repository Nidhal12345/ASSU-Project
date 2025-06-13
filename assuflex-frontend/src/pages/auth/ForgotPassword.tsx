"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../../assets/Orange Minimalist Logo4444.svg"


export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorText = await response.text()
        setError(errorText || "Échec de l'envoi de l'email de réinitialisation. Veuillez réessayer.")
      }
    } catch (err) {
      setError("Erreur réseau. Veuillez vérifier votre connexion et réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Vérifiez votre email</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Nous avons envoyé les instructions de réinitialisation à votre adresse email.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Si vous ne voyez pas l'email dans votre boîte de réception, veuillez vérifier votre dossier spam.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Essayer un autre email
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full text-gray-600 hover:text-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Pas de souci ! Saisissez votre adresse email et nous vous enverrons les instructions de réinitialisation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Saisissez votre adresse email"
                required
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-describedby="email-description"
              />
              <p id="email-description" className="text-xs text-gray-500">
                Nous enverrons les instructions de réinitialisation à cette adresse email
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !isValidEmail(email)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi des instructions...
                </div>
              ) : (
                "Envoyer les instructions"
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour à la connexion
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="absolute top-2 left-2">
        <div className="flex items-center justify-center px-4">
                  <div className="flex items-center gap-2">
                    <Link to="/" className="hidden md:block">
                        <img src={logo} alt="Assuflex Logo" className="h-10" />
                      </Link>
                  </div>
                </div>
      </div>
    </div>
  )
}
