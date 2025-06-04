"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ListChecks, LogOut, Moon, Sun, Settings, Activity, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/logs", label: "Log Summaries", icon: ListChecks },
  // Add more items here if needed, e.g. /settings
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    // This should ideally be handled by AuthProvider redirect, but as a fallback
    return null
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col p-4 space-y-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 px-2 py-3">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">StravaLog</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-base py-6",
                    pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-muted/50",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-base py-6 hover:bg-muted/50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
            Toggle Theme
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-full">
                  <img
                    src={user.picture || "/placeholder.svg?height=32&width=32&query=avatar"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full border-2 border-primary"
                  />
                  <span className="text-sm font-medium text-foreground hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    /* router.push('/settings') */
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
