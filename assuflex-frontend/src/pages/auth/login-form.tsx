"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Logo from "../../assets/Orange Minimalist Logo4444.svg"
import { Link } from "react-router-dom"
import { useAuth } from "@/guards/AuthContext"
import toast from "react-hot-toast"

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

type FormValues = z.infer<typeof formSchema>

function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { refreshAuth } = useAuth()

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const watchedValues = watch()
  const isFormValid = isValid && watchedValues.email && watchedValues.password

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()
      toast.success("Connexion réussie ! Bienvenue " + result.fullName)
      const token = result.token

      if (!token) {
        throw new Error("No token received from server")
      }

      localStorage.setItem("jwtToken", token)

      await refreshAuth()
      console.log("LoginForm: Context refreshed")

      const role = result.role
      if (!role) {
        throw new Error("No role received from server")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-white text-gray-800">
      <div className="w-full flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 h-screen sticky top-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Assurance santé"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:hidden w-full h-64">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Assurance santé"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex flex-col items-center mb-6">
              <Link to="/" className="inline-block mb-4">
                <img src={Logo || "/placeholder.svg"} alt="Assuflex Logo" className="h-20" />
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">Connexion</h1>
            <p className="text-gray-600 mb-8 text-center">
              Accédez à votre espace personnel pour gérer votre assurance santé
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Adresse Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ex. marie@exemple.fr"
                  className={`w-full bg-white border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]`}
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Mot de Passe
                  </label>
                  <Link to={"/forgot-password"}>
                    <span className="text-sm text-[#FF6A00] hover:underline">Mot de passe oublié?</span>
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-white border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]`}
                  {...register("password")}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center mt-6 ${
                  isSubmitting || !isFormValid
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-[#FF6A00] hover:bg-[#E05F00] text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              Vous n'avez pas de compte?{" "}
              <Link to={"/signup"} className="text-[#FF6A00] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
