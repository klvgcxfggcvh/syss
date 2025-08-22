"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { CalendarToggle } from "@/components/calendar-toggle"
import { LoginScreen } from "@/components/auth/login-screen"
import { Dashboard } from "@/components/dashboard/dashboard"
import { useAuthStore } from "@/store/auth-store"
import { Shield } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, user, initialize } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initialize().finally(() => setIsLoading(false))
  }, [initialize])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 mx-auto text-primary animate-pulse" />
            <p className="text-muted-foreground">Initializing Army COP System...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LoginScreen />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Army COP System</h1>
                <p className="text-sm text-muted-foreground">Common Operational Picture</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {user?.role || "USER"}
              </Badge>
              <CalendarToggle />
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}
