"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Map, Users, ClipboardList, FileText, MessageSquare, Clock, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useI18nStore } from "@/store/i18n-store"
import type { DashboardView } from "./dashboard"

interface SidebarProps {
  activeView: DashboardView
  onViewChange: (view: DashboardView) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const { t } = useI18nStore()

  const menuItems = [
    { id: "map" as DashboardView, icon: Map, label: "Map View", badge: null },
    { id: "operations" as DashboardView, icon: Users, label: "Operations", badge: "3" },
    { id: "tasking" as DashboardView, icon: ClipboardList, label: "Tasking", badge: "7" },
    { id: "reports" as DashboardView, icon: FileText, label: "Reports", badge: "2" },
    { id: "messaging" as DashboardView, icon: MessageSquare, label: "Messages", badge: "12" },
    { id: "replay" as DashboardView, icon: Clock, label: "Replay & AAR", badge: null },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-semibold text-sm">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "Unknown User"}</p>
            <p className="text-xs text-sidebar-foreground/70">{user?.role || "USER"}</p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
