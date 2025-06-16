"use server"

import { parseStringPromise } from "xml2js"

const DONGLE_BASE_URL = "http://192.168.8.1"

interface SesTokInfo {
  response: {
    SesInfo: string[]
    TokInfo: string[]
  }
}

/**
 * Retrieves the session token from the dongle's web interface.
 * @returns The session token string.
 * @throws Error if token retrieval fails or XML parsing fails.
 */
async function getDongleToken(): Promise<string> {
  const url = `${DONGLE_BASE_URL}/api/webserver/token/SesTokInfo`
  console.log(`Retrieving token at <${url}>`)

  try {
    const response = await fetch(url, { cache: "no-store" }) // Ensure fresh data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const xmlText = await response.text()
    console.log("Raw token XML response:", xmlText)

    // Parse XML to extract token
    const result: SesTokInfo = await parseStringPromise(xmlText)
    const token = result.response.TokInfo[0]

    if (!token) {
      throw new Error("Token not found in XML response.")
    }
    console.log("The token is:", token)
    return token
  } catch (error) {
    console.error("Error retrieving dongle token:", error)
    throw new Error(`Failed to retrieve dongle token: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Switches the dongle's operating mode.
 * @param mode The desired mode (1: Debug, 2: HiLink, 3: Stick Modem).
 * @returns A success message or an error message.
 */
export async function switchDongleMode(mode: number) {
  if (![1, 2, 3].includes(mode)) {
    return { success: false, message: "Invalid mode selected. Choose 1, 2, or 3." }
  }

  try {
    const token = await getDongleToken()
    const payload = `<request><mode>${mode}</mode></request>`
    const url = `${DONGLE_BASE_URL}/api/device/mode`

    console.log(`Switching device mode to ${mode} at <${url}> with payload: ${payload}`)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        __RequestVerificationToken: token,
      },
      body: payload,
      cache: "no-store", // Ensure fresh data
    })

    const answerXml = await response.text()
    console.log("Modem sent back:", answerXml)

    // Parse the response to check for success/error code
    const result: { response: { Code: string[] } } = await parseStringPromise(answerXml)
    const code = result.response.Code ? result.response.Code[0] : null

    if (code === "0") {
      return { success: true, message: `Dongle mode successfully switched to ${mode}.` }
    } else {
      return {
        success: false,
        message: `Failed to switch dongle mode. Modem response code: ${code || "N/A"}. Full response: ${answerXml}`,
      }
    }
  } catch (error) {
    console.error("Error switching dongle mode:", error)
    return { success: false, message: `An error occurred: ${error instanceof Error ? error.message : String(error)}` }
  }
}
