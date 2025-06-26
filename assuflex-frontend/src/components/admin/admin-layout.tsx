import { Outlet, useLocation } from "react-router-dom"
import { AdminSidebar } from "./admin-sidebar"
import { Header } from "../gestionnaire/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AdminLayout() {
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/admin") return "Administration - Tableau de bord"
    if (path.startsWith("/admin/users") && path.split("/").length > 3) return "Modifier l'utilisateur"
    if (path.startsWith("/admin/users")) return "Gestion des utilisateurs"
    return "Administration ASSUFLEX"
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
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
