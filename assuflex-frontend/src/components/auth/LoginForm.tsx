import type React from "react"

import { useState } from "react"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifiant: "",
    motDePasse: "",
    seSouvenir: false,
  })
  const [errors, setErrors] = useState({
    identifiant: "",
    motDePasse: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { identifiant: "", motDePasse: "" }

    if (!formData.identifiant.trim()) {
      newErrors.identifiant = "L'identifiant est requis"
      valid = false
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis"
      valid = false
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simuler un appel API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Pour la démo, juste logger les données
      console.log("Données de connexion:", formData)

      // Pour la démo, réinitialiser le formulaire
      setFormData({
        identifiant: "",
        motDePasse: "",
        seSouvenir: false,
      })
    } catch (error) {
      console.error("Erreur de connexion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="identifiant" className="block text-sm font-medium text-gray-700 mb-1">
          Identifiant
        </label>
        <input
          id="identifiant"
          name="identifiant"
          type="text"
          autoComplete="username"
          required
          value={formData.identifiant}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.identifiant ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Entrez votre identifiant"
        />
        {errors.identifiant && <p className="mt-1 text-sm text-red-500">{errors.identifiant}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <a href="#" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
            Mot de passe oublié ?
          </a>
        </div>
        <input
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="current-password"
          required
          value={formData.motDePasse}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.motDePasse ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Entrez votre mot de passe"
        />
        {errors.motDePasse && <p className="mt-1 text-sm text-red-500">{errors.motDePasse}</p>}
      </div>

      <div className="flex items-center">
        <input
          id="seSouvenir"
          name="seSouvenir"
          type="checkbox"
          checked={formData.seSouvenir}
          onChange={handleChange}
          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="seSouvenir" className="ml-2 block text-sm text-gray-700">
          Se souvenir de moi
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </div>
    </form>
  )
}
