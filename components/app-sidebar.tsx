import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Gauge, Usb, GitFork, Cloud, ScrollText } from "lucide-react"
import Link from "next/link"

const navItems = [
  {
    title: "System Stats",
    href: "#system-stats",
    icon: Gauge,
  },
  {
    title: "Dongles",
    href: "#dongles",
    icon: Usb,
  },
  {
    title: "Proxy Manager",
    href: "#proxy-manager",
    icon: GitFork,
  },
  {
    title: "Ngrok Access",
    href: "#ngrok-access",
    icon: Cloud,
  },
  {
    title: "Logs",
    href: "#logs",
    icon: ScrollText,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-xl font-bold">DPM</span>
          <span className="sr-only">Dongle Proxy Manager</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
