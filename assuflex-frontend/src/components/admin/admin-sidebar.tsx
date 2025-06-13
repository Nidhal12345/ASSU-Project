import { BarChart3, Users, Settings, Home, Shield, UserCog, Activity, Paperclip } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-6">
        <div className="flex items-center justify-center px-4">
          <div className="flex items-center gap-2">
            <Link to="/admin" className="hidden md:block">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-lg font-bold">ASSUFLEX Admin</span>
              </div>
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Tableau de bord">
                  <Link to="/admin">
                    <Home />
                    <span>Tableau de bord</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")} tooltip="Utilisateurs">
                  <Link to="/admin/users">
                    <Users />
                    <span>Utilisateurs</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>1247</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/articles")} tooltip="Paramètres">
                  <Link to="/admin/articles">
                    <Paperclip />
                    <span>Articles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">Admin ASSUFLEX</p>
            <p className="text-xs text-muted-foreground truncate">admin@assuflex.com</p>
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
