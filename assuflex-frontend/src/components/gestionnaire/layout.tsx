import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function Layout() {
  const location = useLocation()

  // Fonction pour obtenir le titre de la page en fonction de l'URL
  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/gestionnaire/") return "Tableau de bord"
    if (path.startsWith("/gestionnaire/devis")) return "Devis"
    if (path.startsWith("/gestionnaire/validation") && path.split("/").length > 2) return "Détails de la demande"
    if (path.startsWith("/gestionnaire/validation")) return "Validation"
    if (path.startsWith("/gestionnaire/contrats")) return "Contrats"
    if (path.startsWith("/gestionnaire/clients")) return "Clients"
    if (path.startsWith("/gestionnaire/paiements")) return "Paiements"
    if (path.startsWith("/gestionnaire/analyses")) return "Analyses"
    return "Gestionnaire test d'assurance santé"
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <Header title={getPageTitle()} />
          <main className="flex-1 overflow-auto w-full p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
