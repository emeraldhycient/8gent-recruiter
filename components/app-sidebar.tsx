"use client"

import { Briefcase, Users, Building2, Settings, BarChart2, FileSpreadsheet, UserPlus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const nav = [
    {
      label: "Hiring",
      items: [
        { title: "Jobs", url: "/jobs", icon: Briefcase },
        { title: "Applicants", url: "/applicants", icon: Users },
        { title: "Reports", url: "/reports", icon: BarChart2 },
        { title: "Exports", url: "/exports", icon: FileSpreadsheet },
      ],
    },
    {
      label: "Company",
      items: [
        { title: "Team & Roles", url: "/company", icon: UserPlus },
        { title: "Company Profile", url: "/company#profile", icon: Building2 },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
