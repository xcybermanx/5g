"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { switchDongleMode } from "@/app/actions/dongle-actions"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { getConnectedDongleDevices, triggerIpChange } from "@/app/actions/dongle-proxy-actions"

interface Dongle {
  id: string
  name: string
  status: "online" | "offline"
  signalStrength: string
  ipAddress: string
  networkName: string
  // New fields from the local server script
  interface: string
  inetIp: string
  port: string
  active: number
  publicIp: string
}

export function DongleManagementPanel() {
  const [dongles, setDongles] = useState<Dongle[]>([])
  const [isLoading, setIsLoading] = useState(true) // Manage loading state for dongle data
  const { toast } = useToast()

  // Action for switching dongle mode (from previous step)
  const [modeState, switchModeAction, isModePending] = useActionState(async (prevState: any, formData: FormData) => {
    const mode = Number.parseInt(formData.get("mode") as string)
    const result = await switchDongleMode(mode)
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })
    return result
  }, null)

  // Action for triggering IP change
  const [ipChangeState, ipChangeAction, isIpChangePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const ip = formData.get("ip") as string
      const result = await triggerIpChange(ip)
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
      // Refresh dongle list after IP change attempt
      fetchDongleDevices()
      return result
    },
    null,
  )

  const fetchDongleDevices = async () => {
    setIsLoading(true)
    const devices = await getConnectedDongleDevices()
    // Map the fetched devices to your Dongle interface, adding placeholders for missing fields
    const mappedDevices: Dongle[] = devices.map((device, index) => ({
      id: device.ip, // Using IP as ID for uniqueness
      name: `Dongle-${index + 1}`,
      status: device.active === 1 ? "online" : "offline",
      signalStrength: "N/A", // This would need to be fetched separately if available
      ipAddress: device.ip,
      networkName: "N/A", // This would need to be fetched separately if available
      interface: device.interface,
      inetIp: device.inetIp,
      port: device.port,
      active: device.active,
      publicIp: device.publicIp,
    }))
    setDongles(mappedDevices)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDongleDevices()
    // Set up an interval to refresh dongle data periodically
    const interval = setInterval(fetchDongleDevices, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval) // Clean up on unmount
  }, [])

  return (
    <Card id="dongles">
      <CardHeader>
        <CardTitle>Dongle Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interface</TableHead>
                <TableHead>Local IP</TableHead>
                <TableHead>Proxy Port</TableHead>
                <TableHead>Public IP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : dongles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No dongles found. Ensure your local server is running and accessible.
                  </TableCell>
                </TableRow>
              ) : (
                dongles.map((dongle) => (
                  <TableRow key={dongle.id}>
                    <TableCell className="font-medium">{dongle.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${dongle.status === "online" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                      >
                        {dongle.status.charAt(0).toUpperCase() + dongle.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{dongle.interface}</TableCell>
                    <TableCell>{dongle.ipAddress}</TableCell>
                    <TableCell>{dongle.port}</TableCell>
                    <TableCell>{dongle.publicIp}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <form action={ipChangeAction}>
                        <input type="hidden" name="ip" value={dongle.ipAddress} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          disabled={dongle.active !== 1 || isIpChangePending}
                        >
                          New IP
                        </Button>
                      </form>
                      <Button variant="outline" size="sm" disabled={dongle.status === "online"}>
                        Connect
                      </Button>
                      <Button variant="outline" size="sm" disabled={dongle.status === "offline"}>
                        Disconnect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Dongle Mode Switch</h3>
          <form action={switchModeAction} className="grid gap-4 md:grid-cols-2 items-end">
            <div className="grid gap-2">
              <Label htmlFor="dongle-mode">Select Mode</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select name="mode" defaultValue="2">
                  <SelectTrigger id="dongle-mode">
                    <SelectValue placeholder="Select dongle mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Debug</SelectItem>
                    <SelectItem value="2">2 - HiLink</SelectItem>
                    <SelectItem value="3">3 - Stick Modem</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-full md:w-auto" />
            ) : (
              <Button type="submit" disabled={isModePending}>
                {isModePending ? "Switching Mode..." : "Switch Dongle Mode"}
              </Button>
            )}
          </form>
          {modeState && modeState.message && (
            <p className={`text-sm ${modeState.success ? "text-green-600" : "text-red-600"}`}>{modeState.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
