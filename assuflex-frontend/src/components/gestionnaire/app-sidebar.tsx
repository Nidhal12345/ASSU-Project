import {
  BarChart3,
  FileText,
  Home,
  Users,
  ClipboardCheck,
  FileCodeIcon as FileContract,
  CreditCard,
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
import logo from "../../assets/Orange Minimalist Logo4444.svg"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
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
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/gestionnaire")} tooltip="Tableau de bord">
                  <Link to="/gestionnaire">
                    <Home />
                    <span>Tableau de bord</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("gestionnaire/devis")} tooltip="Devis">
                  <Link to="/gestionnaire/devis">
                    <FileText />
                    <span>Devis</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/validation")} tooltip="Validation">
                  <Link to="/gestionnaire/validation">
                    <ClipboardCheck />
                    <span>Validation</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>8</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/contrats")} tooltip="Contrats">
                  <Link to="/gestionnaire/contrats">
                    <FileContract />
                    <span>Contrats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/sinistre")} tooltip="Clients">
                  <Link to="/gestionnaire/sinistre">
                    <Users />
                    <span>sinistre</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/paiements")} tooltip="Paiements">
                  <Link to="/gestionnaire/paiements">
                    <CreditCard />
                    <span>Paiements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/analyses")} tooltip="Analyses">
                  <Link to="/gestionnaire/analyses">
                    <BarChart3 />
                    <span>Analyses</span>
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
                    <p className="text-sm font-medium">Nouvelles demandes</p>
                    <p className="text-xs text-muted-foreground">3 nouvelles demandes à traiter</p>
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
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">Jean Dupont</p>
            <p className="text-xs text-muted-foreground truncate">jean.dupont@example.com</p>
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
