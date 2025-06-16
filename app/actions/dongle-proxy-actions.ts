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
      const errorBody = await response.text()
      console.error(
        `Failed to fetch devices from ${LOCAL_DONGLE_SERVER_URL}/devices: HTTP status ${response.status} ${response.statusText}. Response body: ${errorBody}`,
      )
      throw new Error(`Server responded with status ${response.status}: ${errorBody || response.statusText}`)
    }

    const devices: DongleDevice[] = await response.json()
    return devices
  } catch (error) {
    console.error(`Error fetching connected dongle devices from ${LOCAL_DONGLE_SERVER_URL}:`, error)
    // Re-throw a more user-friendly error for the client component
    throw new Error(
      `Could not connect to dongle management server at ${LOCAL_DONGLE_SERVER_URL}. Please ensure it is running and accessible. Error: ${error instanceof Error ? error.message : String(error)}`,
    )
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
      message: `Failed to trigger IP change: Could not connect to dongle management server at ${LOCAL_DONGLE_SERVER_URL}. Please ensure it is running and accessible. Error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
