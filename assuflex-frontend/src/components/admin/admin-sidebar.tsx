import { Users, Settings, Paperclip } from "lucide-react"
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
} from "@/components/ui/sidebar"
import logo from "../../assets/Orange Minimalist Logo4444.svg"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { jwtDecode } from "jwt-decode"

export function AdminSidebar() {
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
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
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
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")} tooltip="Utilisateurs">
                  <Link to="/admin/users">
                    <Users />
                    <span>Utilisateurs</span>
                  </Link>
                </SidebarMenuButton>
                {/* <SidebarMenuBadge>1247</SidebarMenuBadge> */}
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
