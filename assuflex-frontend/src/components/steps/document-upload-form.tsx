import type React from "react"
import { useState, useCallback, useMemo } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload, FileText, LogIn, UserPlus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FileUpload from "./file-upload"
import { Header } from "./Header-steper"
import { useNavigate } from "react-router-dom"

export default function DocumentUploadForm() {
  const navigate = useNavigate()
  const quote = JSON.parse(localStorage.getItem("selectedOffer") || "{}")

  const [cni, setCni] = useState<File | null>(null)
  const [rib, setRib] = useState<File | null>(null)
  const [justificatif, setJustificatif] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const checkJwtToken = useCallback(() => {
    const token = localStorage.getItem("jwtToken")
    return !!token
  }, [])

  const submitQuoteAndFiles = useCallback(async (quote: any, files: File[]) => {
    const formData = new FormData()
    formData.append("quote", JSON.stringify(quote))
    
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      await axios.post("http://localhost:8080/api/v1/quotes/demande-devis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      
      toast.success("Documents téléversés avec succès. Vous allez être redirigé.")
      setTimeout(() => {
        navigate("/client/demandes")
      }, 1500)
      
    } catch (error: any) {
      console.error("Erreur lors de l'envoi des documents:", error)
      throw error
    }
  }, [navigate])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: null, message: "" })

    if (!cni || !rib || !justificatif) {
      setStatus({
        type: "error",
        message: "Veuillez téléverser tous les documents requis.",
      })
      return
    }

    if (!checkJwtToken()) {
      setIsLoginModalOpen(true)
      return
    }

    setIsSubmitting(true)

    try {

        await submitQuoteAndFiles(quote, [cni, rib, justificatif])

      setStatus({
        type: "success",
        message: "Documents téléversés avec succès. Vous allez être redirigé.",
      })
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors du téléversement des documents."
      
      if (error.response?.status === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter."
        localStorage.removeItem("jwtToken")
        setIsLoginModalOpen(true)
      } else if (error.response?.status === 413) {
        errorMessage = "Les fichiers sont trop volumineux."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setStatus({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [cni, rib, justificatif, checkJwtToken, quote, submitQuoteAndFiles])

  const redirectToLogin = useCallback(() => {
        console.log("Redirecting to register page with quote ID:", quote.offerId)
    navigate(`/login?redirect=quote&id=${quote.offerId}`)
  }, [navigate, quote.offerId])

  const redirectToRegister = useCallback(() => {
    console.log("Redirecting to register page with quote ID:", quote.offerId)
    navigate(`/signup?redirect=quote&id=${quote.offerId}`)
  }, [navigate, quote.offerId])

  const allFilesUploaded = useMemo(() => cni && rib && justificatif, [cni, rib, justificatif])

  return (
    <>
      <Header />
      <Card className="mt-24 w-full max-w-3xl mx-auto shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-xl font-semibold text-slate-800">Documents requis</CardTitle>
          <CardDescription>
            Veuillez téléverser les documents suivants pour compléter votre demande de devis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg mb-6 col-span-1 md:col-span-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <FileText size={16} />
                    <span>Tous les documents doivent être au format image ou PDF</span>
                  </div>
                  <div className="text-sm text-slate-600">Taille maximale: 10 MB par fichier</div>
                </div>

                <FileUpload
                  label="Carte Nationale d'Identité (CNI)"
                  file={cni}
                  setFile={setCni}
                  acceptedFileTypes="image/*,application/pdf"
                  description="Recto-verso de votre pièce d'identité en cours de validité"
                />

                <FileUpload
                  label="Relevé d'Identité Bancaire (RIB)"
                  file={rib}
                  setFile={setRib}
                  acceptedFileTypes="image/*,application/pdf"
                  description="Document officiel comportant vos coordonnées bancaires"
                />

                <FileUpload
                  label="Justificatif de domicile"
                  file={justificatif}
                  setFile={setJustificatif}
                  acceptedFileTypes="image/*,application/pdf"
                  description="Document de moins de 3 mois (facture d'électricité, eau, téléphone...)"
                />
              </div>
            </div>

            {status.message && (
              <Alert
                variant={status.type === "error" ? "destructive" : "default"}
                className={status.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
              >
                {status.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle>{status.type === "error" ? "Erreur" : "Succès"}</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t flex justify-between pt-4">
          <div className="flex items-center text-sm text-slate-600">
            {allFilesUploaded ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle size={16} />
                <span>Tous les documents sont prêts</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Upload size={16} />
                <span>Veuillez téléverser tous les documents requis</span>
              </div>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || !allFilesUploaded} className="px-6">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Soumettre les documents"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentification requise</DialogTitle>
            <DialogDescription>
              Vous devez être connecté pour soumettre vos documents. Veuillez vous connecter ou créer un compte pour
              continuer.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-6">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-slate-100 p-6">
                <LogIn className="h-10 w-10 text-slate-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button type="button" onClick={redirectToLogin} className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Button>

              <Button type="button" onClick={redirectToRegister} variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                S'inscrire
              </Button>

              <Button type="button" variant="ghost" onClick={() => setIsLoginModalOpen(false)} className="w-full mt-2">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}