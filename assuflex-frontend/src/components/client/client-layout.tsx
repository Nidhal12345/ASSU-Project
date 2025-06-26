"use client"

import { Outlet, useLocation } from "react-router-dom"
import { ClientSidebar } from "./client-sidebar"
import { ClientHeader } from "./client-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ChatBot from "@/pages/ChatBot"

export function ClientLayout() {
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/client" || path === "/client/") return "Tableau de bord"
    if (path.startsWith("/client/contrats")) return "Mes contrats"
    if (path.startsWith("/client/paiements")) return "Paiements"
    if (path.startsWith("/client/demandes")) return "Mes demandes"
    if (path.startsWith("/client/profil")) return "Mon profil"
    return "Espace client Assuflex"
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <ClientSidebar />
        <SidebarInset className="flex flex-col w-full">
          <ClientHeader title={getPageTitle()} />
          <main className="flex-1 overflow-auto w-full p-4 md:p-6">
            <Outlet />
                  <ChatBot />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
