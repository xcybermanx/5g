import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SystemStatsPanel() {
  const isLoading = false // Simulate loading state

  return (
    <Card id="system-stats">
      <CardHeader>
        <CardTitle>System Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            ) : (
              <div className="relative h-20 w-20 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#3b82f6 75%, transparent 75%)`, // Placeholder for 75% usage
                    transform: "rotate(-90deg)",
                  }}
                ></div>
                <span className="relative text-2xl font-bold">75%</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-2">
              {isLoading ? <Skeleton className="h-4 w-24 mx-auto" /> : "Current CPU load"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-3/4 mb-2" />
            ) : (
              <div className="text-2xl font-bold">8.2 GB / 16 GB</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-24" /> : "51% Used"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disk Space</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-3/4 mb-2" />
            ) : (
              <div className="text-2xl font-bold">120 GB / 256 GB</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-24" /> : "47% Used"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-6 w-3/4 mb-2" /> : <div className="text-2xl font-bold">3d 14h 22m</div>}
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-24" /> : "Since last reboot"}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
