"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle, Lock, AlertCircle } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import logo from "../../assets/Orange Minimalist Logo4444.svg"

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [token, setToken] = useState("")
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [tokenError, setTokenError] = useState("")
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      verifyToken(tokenParam)
    } else {
      setTokenError("Aucun jeton de réinitialisation fourni")
      setIsTokenValid(false)
    }
  }, [searchParams])

  const verifyToken = async (tokenValue: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/reset-password?token=${encodeURIComponent(tokenValue)}`,
      )

      if (response.ok) {
        setIsTokenValid(true)
      } else {
        const errorText = await response.text()
        setTokenError(errorText || "Jeton invalide ou expiré")
        setIsTokenValid(false)
      }
    } catch (err) {
      setTokenError("Échec de la vérification du jeton. Veuillez réessayer.")
      setIsTokenValid(false)
    }
  }

  const validatePassword = (password: string) => {
    const errors: string[] = []
    if (password.length < 8) errors.push("Au moins 8 caractères")
    if (!/[A-Z]/.test(password)) errors.push("Une lettre majuscule")
    if (!/[a-z]/.test(password)) errors.push("Une lettre minuscule")
    if (!/\d/.test(password)) errors.push("Un chiffre")
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Un caractère spécial")
    return errors
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Effacer les erreurs quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length > 0) {
      newErrors.password = `Le mot de passe doit contenir : ${passwordErrors.join(", ")}`
    }

    // Valider la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const f = new URLSearchParams()
      f.append("token", token)
      f.append("newPassword", formData.password)

      console.log(formData)

      const response = await fetch(`http://localhost:8080/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: f,
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const errorText = await response.text()
        setErrors({ general: errorText || "Échec de la réinitialisation du mot de passe. Veuillez réessayer." })
      }
    } catch (err) {
      setErrors({ general: "Erreur réseau. Veuillez vérifier votre connexion et réessayer." })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const errors = validatePassword(formData.password)
    if (formData.password.length === 0) return { strength: 0, label: "" }
    if (errors.length === 0) return { strength: 100, label: "Fort" }
    if (errors.length <= 2) return { strength: 60, label: "Moyen" }
    return { strength: 30, label: "Faible" }
  }

  const { strength, label } = passwordStrength()

  // Afficher l'état de chargement pendant la vérification du jeton
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Vérification du jeton de réinitialisation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Afficher l'erreur si le jeton est invalide
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Lien de réinitialisation invalide</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {tokenError || "Ce lien de réinitialisation de mot de passe est invalide ou a expiré."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Demander un nouveau lien
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Réinitialisation réussie</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre
                nouveau mot de passe.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Continuer vers la connexion
              </Button>
            </Link>
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
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Réinitialisez votre mot de passe</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Créez un nouveau mot de passe sécurisé pour votre compte Assuflex.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Saisissez votre nouveau mot de passe"
                  required
                  className={`h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  aria-describedby="password-requirements"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Force du mot de passe</span>
                    <span
                      className={`font-medium ${
                        strength >= 60 ? "text-green-600" : strength >= 30 ? "text-yellow-600" : "text-red-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength >= 60 ? "bg-green-500" : strength >= 30 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

              <div id="password-requirements" className="text-xs text-gray-500 space-y-1">
                <p>Le mot de passe doit contenir :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Au moins 8 caractères</li>
                  <li>Une lettre majuscule et minuscule</li>
                  <li>Un chiffre et un caractère spécial</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                  className={`h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.password || !formData.confirmPassword}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mise à jour du mot de passe...
                </div>
              ) : (
                "Mettre à jour le mot de passe"
              )}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
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
