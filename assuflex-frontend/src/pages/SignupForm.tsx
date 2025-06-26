import type React from "react"
import { useState } from "react"

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmationMotDePasse: "",
    acceptConditions: false,
  })
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmationMotDePasse: "",
    acceptConditions: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

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

    // Calculer la force du mot de passe si le champ est motDePasse
    if (name === "motDePasse") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Très faible"
      case 1:
        return "Faible"
      case 2:
        return "Moyen"
      case 3:
        return "Fort"
      case 4:
        return "Très fort"
      default:
        return ""
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-red-400"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-400"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      confirmationMotDePasse: "",
      acceptConditions: "",
    }

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
      valid = false
    }

    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis"
      valid = false
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
      valid = false
    }

    // Validation du mot de passe
    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis"
      valid = false
    } else if (formData.motDePasse.length < 8) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 8 caractères"
      valid = false
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = "Veuillez confirmer votre mot de passe"
      valid = false
    } else if (formData.motDePasse !== formData.confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = "Les mots de passe ne correspondent pas"
      valid = false
    }

    // Validation des conditions d'utilisation
    if (!formData.acceptConditions) {
      newErrors.acceptConditions = "Vous devez accepter les conditions d'utilisation"
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
      console.log("Données d'inscription:", formData)

      // Pour la démo, réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        confirmationMotDePasse: "",
        acceptConditions: false,
      })
    } catch (error) {
      console.error("Erreur d'inscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.nom ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Votre nom"
          />
          {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            required
            value={formData.prenom}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.prenom ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Votre prénom"
          />
          {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="votre.email@exemple.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          id="motDePasse"
          name="motDePasse"
          type="password"
          autoComplete="new-password"
          required
          value={formData.motDePasse}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.motDePasse ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Créez un mot de passe sécurisé"
        />
        {errors.motDePasse && <p className="mt-1 text-sm text-red-500">{errors.motDePasse}</p>}

        {/* Indicateur de force du mot de passe */}
        {formData.motDePasse && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-500">Force du mot de passe:</div>
              <div
                className="text-xs font-medium"
                style={{ color: passwordStrength >= 3 ? "#22c55e" : passwordStrength >= 2 ? "#eab308" : "#ef4444" }}
              >
                {getPasswordStrengthText()}
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmationMotDePasse"
          name="confirmationMotDePasse"
          type="password"
          autoComplete="new-password"
          required
          value={formData.confirmationMotDePasse}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.confirmationMotDePasse ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Confirmez votre mot de passe"
        />
        {errors.confirmationMotDePasse && <p className="mt-1 text-sm text-red-500">{errors.confirmationMotDePasse}</p>}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptConditions"
            name="acceptConditions"
            type="checkbox"
            checked={formData.acceptConditions}
            onChange={handleChange}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acceptConditions" className="text-gray-700">
            J'accepte les{" "}
            <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
              conditions d'utilisation
            </a>{" "}
            et la{" "}
            <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
              politique de confidentialité
            </a>
          </label>
          {errors.acceptConditions && <p className="mt-1 text-sm text-red-500">{errors.acceptConditions}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70 mt-4"
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
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </div>
    </form>
  )
}
