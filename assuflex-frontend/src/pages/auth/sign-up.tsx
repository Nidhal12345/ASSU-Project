import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import Logo from "../../assets/Orange Minimalist Logo4444.svg"

const formSchema = z.object({
  name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
})

type FormValues = z.infer<typeof formSchema>

function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    console.log("Données soumises:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    alert("Inscription réussie!")
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
                      <img src={Logo} alt="Assuflex Logo" className="h-20" />
                    </Link>            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">Rejoignez-nous aujourd'hui</h1>
            <p className="text-gray-600 mb-8">
              Notre assurance santé vous offre les outils et la protection dont vous avez besoin pour une vie sereine.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom et Prénom
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="ex. Marie Dupont"
                  className={`w-full bg-white border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]`}
                  {...register("name")}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Adresse Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ex. marie@exemple.fr"
                  className={`w-full bg-white border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]`}
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Mot de Passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-white border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]`}
                  {...register("password")}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#FF6A00] focus:ring-[#FF6A00]"
                    {...register("terms")}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm">
                    J'accepte les{" "}
                    <a href="#" className="text-[#FF6A00] hover:underline">
                      Conditions d'Utilisation
                    </a>
                  </label>
                  {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF6A00] hover:bg-[#E05F00] text-white py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center"
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
                  "Créer un Compte"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              Vous avez déjà un compte?{" "}
              <Link to={"/login"} className="text-[#FF6A00] hover:underline">
                Connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
