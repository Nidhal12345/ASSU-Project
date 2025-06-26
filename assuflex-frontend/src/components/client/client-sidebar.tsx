"use client"

import {
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { jwtDecode } from "jwt-decode"

export function ClientSidebar() {
  const location = useLocation()

  interface DecodedToken {
    sub?: string;
    fullName?: string;
  }
  
   function getUserNameFromToken(): DecodedToken | null {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

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
            <AvatarFallback>{getUserNameFromToken()?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">{getUserNameFromToken()?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{getUserNameFromToken()?.sub}</p>
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
