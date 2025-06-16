import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"

export function ProxyManagementPanel() {
  const isLoading = false // Simulate loading state

  return (
    <Card id="proxy-manager">
      <CardHeader>
        <CardTitle>Proxy Management</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="proxy-status" className="text-base">
            Proxy Status
          </Label>
          {isLoading ? <Skeleton className="h-10 w-24" /> : <Button variant="destructive">Stop Proxy</Button>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="proxy-type">Proxy Type</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select defaultValue="socks5">
              <SelectTrigger id="proxy-type">
                <SelectValue placeholder="Select proxy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="socks5">SOCKS5</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Rotation Settings</Label>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <RadioGroup defaultValue="per-request" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="per-request" id="per-request" className="peer sr-only" />
                <Label
                  htmlFor="per-request"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Per Request
                </Label>
              </div>
              <div>
                <RadioGroupItem value="time-interval" id="time-interval" className="peer sr-only" />
                <Label
                  htmlFor="time-interval"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Time Interval
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-rotate">Auto-Rotate</Label>
          {isLoading ? <Skeleton className="h-6 w-12" /> : <Switch id="auto-rotate" defaultChecked />}
        </div>
      </CardContent>
    </Card>
  )
}
