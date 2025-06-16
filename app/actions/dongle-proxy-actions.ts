"use server"

import { LOCAL_DONGLE_SERVER_URL } from "@/lib/config"

interface DongleDevice {
  ip: string
  interface: string
  inetIp: string
  port: string
  active: number
  publicIp: string
}

/**
 * Fetches the list of connected dongle devices from the local proxy server.
 * @returns An array of DongleDevice objects or an empty array on error.
 */
export async function getConnectedDongleDevices(): Promise<DongleDevice[]> {
  try {
    const response = await fetch(`${LOCAL_DONGLE_SERVER_URL}/devices`, {
      cache: "no-store", // Always get fresh data
    })

    if (!response.ok) {
      console.error(`Failed to fetch devices: ${response.status} ${response.statusText}`)
      return []
    }

    const devices: DongleDevice[] = await response.json()
    return devices
  } catch (error) {
    console.error("Error fetching connected dongle devices:", error)
    return []
  }
}

/**
 * Triggers an IP change for a specific dongle device on the local proxy server.
 * @param ip The IP address of the dongle to change.
 * @returns A success message or an error message.
 */
export async function triggerIpChange(ip: string) {
  try {
    const response = await fetch(`${LOCAL_DONGLE_SERVER_URL}/changeip?ip=${ip}`, {
      method: "GET", // The provided script uses GET for /changeip
      cache: "no-store", // Ensure the action is performed
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to change IP: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return { success: true, message: `IP change initiated for dongle ${ip}.` }
  } catch (error) {
    console.error("Error triggering IP change:", error)
    return {
      success: false,
      message: `Failed to trigger IP change: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
