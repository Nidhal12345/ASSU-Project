"use client"

import {
  Home,
  FileCodeIcon as FileContract,
  CreditCard,
  ClipboardCheck,
  User,
  Bell,
  Settings,
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import logo from "../../assets/Orange Minimalist Logo4444.svg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ClientSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/client" && location.pathname === "/client") return true
    if (path !== "/client" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-6">
        <div className="flex items-center justify-center px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden md:block">
                <img src={logo} alt="Assuflex Logo" className="h-10" />
              </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mon espace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client")} tooltip="Accueil">
                  <Link to="/client">
                    <Home />
                    <span>Accueil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/contrats")} tooltip="Mes contrats">
                  <Link to="/client/contrats">
                    <FileContract />
                    <span>Mes contrats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/paiements")} tooltip="Paiements">
                  <Link to="/client/paiements">
                    <CreditCard />
                    <span>Paiements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/demandes")} tooltip="Mes demandes">
                  <Link to="/client/demandes">
                    <ClipboardCheck />
                    <span>Mes demandes</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>2</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/profil")} tooltip="Mon profil">
                  <Link to="/client/profil">
                    <User />
                    <span>Mon profil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/client/sinistre")} tooltip="Mon profil">
                  <Link to="/client/sinistre">
                    <User />
                    <span>sinistre</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Notifications</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <Bell className="mt-1 h-4 w-4 text-accent" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Paiement à venir</p>
                    <p className="text-xs text-muted-foreground">Votre prochain paiement est prévu le 05/07/2025</p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>NS</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">Nidhal saddouri</p>
            <p className="text-xs text-muted-foreground truncate">nidhal@saddouri.com</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Paramètres</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
