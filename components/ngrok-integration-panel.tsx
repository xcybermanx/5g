"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function NgrokIntegrationPanel() {
  const isLoading = false // Simulate loading state
  const ngrokStatus: "online" | "offline" = "online" // Placeholder for live status
  const publicUrl = "https://example-ngrok-tunnel.ngrok.io" // Placeholder URL
  const proxyPort = 8080 // Placeholder for proxy port

  const [ngrokApiKey, setNgrokApiKey] = useState("") // New state for API key

  return (
    <Card id="ngrok-access">
      <CardHeader>
        <CardTitle>Ngrok Integration</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ngrok Status:</span>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <Badge variant={ngrokStatus === "online" ? "default" : "destructive"}>
              {ngrokStatus.charAt(0).toUpperCase() + ngrokStatus.slice(1)}
            </Badge>
          )}
        </div>
        {/* New API Key Input */}
        <div className="grid gap-2">
          <Label htmlFor="ngrok-api-key">Ngrok API Key</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="ngrok-api-key"
              type="password"
              placeholder="Enter your Ngrok API Key"
              value={ngrokApiKey}
              onChange={(e) => setNgrokApiKey(e.target.value)}
            />
          )}
        </div>
        <div className="grid gap-2">
          <span className="text-sm font-medium">Public Proxy URL (for other PCs):</span> {/* Updated label */}
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <p className="break-all font-mono text-sm bg-muted p-2 rounded-md">
              {publicUrl}:{proxyPort} {/* Combined URL and port */}
            </p>
          )}
        </div>
        {isLoading ? <Skeleton className="h-10 w-32" /> : <Button className="w-full md:w-auto">Refresh Tunnel</Button>}
      </CardContent>
    </Card>
  )
}
