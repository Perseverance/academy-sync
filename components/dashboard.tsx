"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  UserCircle2,
  FileSpreadsheet,
  Activity,
  Clock,
  Loader2,
  LinkIcon,
  Unlink,
} from "lucide-react"

interface ConnectionStatus {
  google: "active" | "needs_reauth" | "error"
  strava: "connected" | "not_connected" | "needs_reauth"
  stravaUsername?: string
}

interface LastRunStatus {
  date: string
  status: "success" | "error" | "partial_error"
  message: string
}

export function Dashboard() {
  const { user, isLoading: authLoading } = useAuth() // AuthProvider handles redirect if no user
  const { toast } = useToast()

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    google: "active", // Assume active initially, backend would confirm
    strava: "not_connected",
  })
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("")
  const [inputSpreadsheetUrl, setInputSpreadsheetUrl] = useState("")

  const [lastRunStatus, setLastRunStatus] = useState<LastRunStatus | null>(null)
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [isSavingUrl, setIsSavingUrl] = useState(false)
  const [isConnectingStrava, setIsConnectingStrava] = useState(false)
  const [isDisconnectingStrava, setIsDisconnectingStrava] = useState(false)
  const [isReauthorizingGoogle, setIsReauthorizingGoogle] = useState(false)

  useEffect(() => {
    if (user) {
      // Simulate fetching initial data from backend
      const fetchData = async () => {
        setIsFetchingData(true)
        await new Promise((resolve) => setTimeout(resolve, 1200)) // Simulate API delay
        // Mocked API response
        setConnectionStatus({
          google: "active",
          strava: "connected",
          stravaUsername: "StravaRunner123",
        })
        const savedUrl = "https://docs.google.com/spreadsheets/d/example123/edit"
        setSpreadsheetUrl(savedUrl)
        setInputSpreadsheetUrl(savedUrl)
        setLastRunStatus({
          date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD
          status: "success",
          message:
            "Successfully logged 10.50 km and 00:55:30. Workout description in 'Описание на тренировката' updated.",
        })
        setIsFetchingData(false)
      }
      fetchData()
    }
  }, [user])

  const handleConnectStrava = async () => {
    setIsConnectingStrava(true)
    toast({ title: "Connecting to Strava...", description: "Please follow the Strava authorization steps." })
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate OAuth flow
    setConnectionStatus((prev) => ({ ...prev, strava: "connected", stravaUsername: "StravaRunner123" }))
    toast({ title: "Strava Connected!", description: "Your Strava account is now linked.", variant: "default" })
    setIsConnectingStrava(false)
  }

  const handleDisconnectStrava = async () => {
    setIsDisconnectingStrava(true)
    toast({ title: "Disconnecting Strava...", description: "Please wait." })
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setConnectionStatus((prev) => ({ ...prev, strava: "not_connected", stravaUsername: undefined }))
    toast({ title: "Strava Disconnected", description: "Your Strava account has been unlinked.", variant: "default" })
    setIsDisconnectingStrava(false)
  }

  const handleReauthorizeStrava = async () => {
    // Similar to connect, but might have different backend logic or UI indication
    setIsConnectingStrava(true) // Reuse loading state
    toast({ title: "Re-authorizing Strava...", description: "Please follow the Strava authorization steps." })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConnectionStatus((prev) => ({
      ...prev,
      strava: "connected",
      stravaUsername: prev.stravaUsername || "StravaUser",
    }))
    toast({
      title: "Strava Re-authorized!",
      description: "Your Strava connection has been refreshed.",
      variant: "default",
    })
    setIsConnectingStrava(false)
  }

  const handleSaveSpreadsheet = async () => {
    if (!inputSpreadsheetUrl.trim() || !inputSpreadsheetUrl.startsWith("https://docs.google.com/spreadsheets/d/")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Spreadsheet URL.",
        variant: "destructive",
      })
      return
    }
    setIsSavingUrl(true)
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
    // On success from backend:
    setSpreadsheetUrl(inputSpreadsheetUrl)
    toast({ title: "Spreadsheet Link Saved!", description: "Your configuration has been updated.", variant: "default" })
    setIsSavingUrl(false)
    // On error:
    // toast({ title: "Error Saving Link", description: "Could not save the spreadsheet link. Please try again.", variant: "destructive" })
  }

  const handleReauthorizeGoogle = async () => {
    setIsReauthorizingGoogle(true)
    toast({ title: "Re-authorizing Google...", description: "Please follow the Google authorization steps." })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConnectionStatus((prev) => ({ ...prev, google: "active" }))
    toast({
      title: "Google Permissions Renewed!",
      description: "Your Google Sheets access is active.",
      variant: "default",
    })
    setIsReauthorizingGoogle(false)
  }

  if (authLoading || isFetchingData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
        {" "}
        {/* Adjust height as needed */}
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const getStatusDisplay = (
    status: ConnectionStatus["google"] | ConnectionStatus["strava"],
    serviceName: string,
    username?: string,
  ) => {
    let icon,
      text,
      badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary",
      badgeText = ""
    switch (status) {
      case "active":
      case "connected":
        icon = <CheckCircle className="w-5 h-5 text-success" />
        text = serviceName === "Strava" ? `Connected as ${username}` : "Sheets Access: Active"
        badgeVariant = "default"
        badgeText = "Active"
        break
      case "needs_reauth":
        icon = <AlertTriangle className="w-5 h-5 text-orange-400" />
        text = `${serviceName} Access: Re-authorization Needed!`
        badgeVariant = "outline"
        badgeText = "Re-authorize"
        break
      case "not_connected":
        icon = <XCircle className="w-5 h-5 text-destructive" />
        text = `${serviceName}: Not Connected`
        badgeVariant = "destructive"
        badgeText = "Not Connected"
        break
      default: // error or unknown
        icon = <AlertTriangle className="w-5 h-5 text-destructive" />
        text = `${serviceName} Access: Error`
        badgeVariant = "destructive"
        badgeText = "Error"
    }
    return {
      icon,
      text,
      badge: (
        <Badge
          variant={badgeVariant}
          className={badgeVariant === "default" ? "bg-success/20 text-success border-success/30" : ""}
        >
          {badgeText}
        </Badge>
      ),
    }
  }

  const googleStatus = getStatusDisplay(connectionStatus.google, "Google")
  const stravaStatus = getStatusDisplay(connectionStatus.strava, "Strava", connectionStatus.stravaUsername)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {(connectionStatus.google === "needs_reauth" || connectionStatus.strava === "needs_reauth") && (
        <Card className="border-orange-500/50 bg-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <p className="text-orange-300 font-medium">
                Action Required: Some connections need re-authorization to ensure smooth operation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle2 className="mr-2 h-6 w-6 text-primary" />
            Google Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Connected as: <span className="font-medium text-foreground">{user?.email}</span>
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {googleStatus.icon}
              <span className="text-sm">{googleStatus.text}</span>
            </div>
            {googleStatus.badge}
          </div>
          {connectionStatus.google === "needs_reauth" && (
            <Button onClick={handleReauthorizeGoogle} disabled={isReauthorizingGoogle} size="sm">
              {isReauthorizingGoogle ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Re-authorize Google
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            Strava Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {stravaStatus.icon}
              <span className="text-sm">{stravaStatus.text}</span>
            </div>
            {stravaStatus.badge}
          </div>
          {connectionStatus.strava === "not_connected" && (
            <Button onClick={handleConnectStrava} disabled={isConnectingStrava}>
              {isConnectingStrava ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Connect to Strava
            </Button>
          )}
          {connectionStatus.strava === "connected" && (
            <div className="flex space-x-2">
              <Button onClick={handleReauthorizeStrava} variant="outline" size="sm" disabled={isConnectingStrava}>
                {isConnectingStrava ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Re-authorize
              </Button>
              <Button onClick={handleDisconnectStrava} variant="destructive" size="sm" disabled={isDisconnectingStrava}>
                {isDisconnectingStrava ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="mr-2 h-4 w-4" />
                )}
                Disconnect Strava
              </Button>
            </div>
          )}
          {connectionStatus.strava === "needs_reauth" && (
            <Button onClick={handleReauthorizeStrava} size="sm" disabled={isConnectingStrava}>
              {isConnectingStrava ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Re-authorize Strava
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6 text-primary" />
            Google Spreadsheet Configuration
          </CardTitle>
          <CardDescription>Paste the full URL of your Google Spreadsheet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="spreadsheet-url">Spreadsheet Link</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="spreadsheet-url"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={inputSpreadsheetUrl}
                onChange={(e) => setInputSpreadsheetUrl(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSaveSpreadsheet} disabled={isSavingUrl || inputSpreadsheetUrl === spreadsheetUrl}>
                {isSavingUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Link
              </Button>
            </div>
          </div>
          {spreadsheetUrl && (
            <p className="text-sm text-muted-foreground flex items-center">
              Current:{" "}
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary hover:underline truncate max-w-xs inline-block"
              >
                {spreadsheetUrl}
              </a>
              <ExternalLink className="ml-1 h-3 w-3 text-primary" />
            </p>
          )}
          {!spreadsheetUrl && <p className="text-sm text-muted-foreground">Spreadsheet Link: Not Set.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-6 w-6 text-primary" />
            Last Automation Run Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lastRunStatus ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Last Sync Attempt:{" "}
                  {new Date(lastRunStatus.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Badge
                  variant={
                    lastRunStatus.status === "success"
                      ? "default"
                      : lastRunStatus.status === "partial_error"
                        ? "outline"
                        : "destructive"
                  }
                  className={
                    lastRunStatus.status === "success"
                      ? "bg-success/20 text-success border-success/30"
                      : lastRunStatus.status === "partial_error"
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : ""
                  }
                >
                  {lastRunStatus.status === "success"
                    ? "Success"
                    : lastRunStatus.status === "partial_error"
                      ? "Completed with Errors"
                      : "Failed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{lastRunStatus.message}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No automation run data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
