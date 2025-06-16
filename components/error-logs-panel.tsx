import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"

const logs = [
  "[INFO] 2024-01-15 10:00:01 - Proxy server started on port 8080.",
  "[WARNING] 2024-01-15 10:01:15 - Dongle-02 disconnected unexpectedly.",
  "[INFO] 2024-01-15 10:02:30 - Dongle-01 IP changed to 192.168.8.100.",
  "[ERROR] 2024-01-15 10:03:45 - Failed to connect to Ngrok service. Retrying...",
  "[INFO] 2024-01-15 10:05:00 - Proxy type changed to HTTP.",
  "[WARNING] 2024-01-15 10:06:20 - High CPU usage detected (90%).",
  "[INFO] 2024-01-15 10:07:35 - Ngrok tunnel refreshed successfully.",
  "[ERROR] 2024-01-15 10:08:50 - Dongle-03 failed to initialize. Check hardware.",
  "[INFO] 2024-01-15 10:10:05 - System uptime: 3 days, 14 hours, 22 minutes.",
  "[INFO] 2024-01-15 10:11:20 - Disk space remaining: 120 GB.",
  "[WARNING] 2024-01-15 10:12:35 - Low memory warning: 1GB free.",
  "[INFO] 2024-01-15 10:13:50 - Dongle-04 connected.",
]

export function ErrorLogsPanel() {
  const isLoading = false // Simulate loading state

  return (
    <Card id="logs">
      <CardHeader>
        <CardTitle>Error Logs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="grid gap-2 flex-1 w-full sm:w-auto">
            <Label htmlFor="log-filter" className="sr-only">
              Filter by Log Level
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select defaultValue="all">
                <SelectTrigger id="log-filter">
                  <SelectValue placeholder="Filter by log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {isLoading ? <Skeleton className="h-10 w-24" /> : <Button className="w-full sm:w-auto">Clear Logs</Button>}
        </div>
        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <Textarea
            readOnly
            value={logs.join("\n")}
            className="h-80 font-mono text-xs resize-none"
            placeholder="No logs available."
          />
        )}
      </CardContent>
    </Card>
  )
}
