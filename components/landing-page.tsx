"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Activity, BarChart3, Calendar, Loader2 } from "lucide-react"

export function LandingPage() {
  const { user, signIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading && !user) {
    // Show loader only if loading and no user (i.e. initial load or during sign-in)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  // If user is already set (e.g. from localStorage) and not loading, this page shouldn't render due to redirect in AuthProvider
  // However, as a fallback or if AuthProvider logic changes:
  if (user) return null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-500 to-orange-400 bg-clip-text text-transparent">
            The Academy Sync Tool
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your Strava account to Google Sheets and automatically log your running data. Focus on your runs,
            not on manual data entry.
          </p>
          <Button
            onClick={signIn}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-transform duration-150"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Sign in with Google
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border/50 shadow-md hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <Activity className="w-10 h-10 text-primary mx-auto mb-3" />
              <CardTitle className="text-xl font-semibold">Connect Strava</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">
                Securely link your Strava account to automatically fetch your activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-md hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-primary mx-auto mb-3" />
              <CardTitle className="text-xl font-semibold">Google Sheets Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">
                Specify your Google Spreadsheet and watch your training log update itself.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-md hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
              <CardTitle className="text-xl font-semibold">Automated Daily</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">
                Set it up once, and your runs are logged automatically every day.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
