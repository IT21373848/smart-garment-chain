"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Settings2,
  Container,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Smart-Garment-Chain",
      logo: Container,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Production Scheduling",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "./overview",
        },
        {
          title: "Production Lines",
          url: "./productionlines",
        },
        {
          title: "New Productions",
          url: "./newproduction",
        },
        {
          title: 'Designs',
          url: './designs'
        }
      ],
    },
    {
      title: "Supply Management",
      url: "/supplymanagement",
      icon: Bot,
      items: [
        {
          title: "Make Orders",
          url: "./MakeOrders",
        },
        {
          title: "Submit Orders",
          url: "./SubmitOrder",
        },
        {
          title: "Track Orders",
          url: "./TrackOrders",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
