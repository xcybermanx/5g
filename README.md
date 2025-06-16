# Huawei Dongle Dashboard

This project provides a responsive web dashboard UI for managing Huawei E3372 USB dongles as proxies. It allows you to monitor system statistics, manage connected dongles, configure proxy settings, integrate with Ngrok, and view error logs.

**Important:** This dashboard is designed to work in conjunction with a **dedicated local server** that directly interacts with your Huawei dongles and manages the proxy setup. The Next.js dashboard acts as a client to this local server.

## Features

*   **Dashboard Layout:** Clean, modern layout with a top navbar and sidebar navigation.
*   **System Stats:** Displays CPU usage, memory usage, disk space, and system uptime (placeholders).
*   **Dongle Management:**
    *   Table of connected dongles with status, IP, interface, proxy port, and public IP.
    *   Button to trigger IP rotation for individual dongles.
    *   Option to switch dongle operating mode (Debug, HiLink, Stick Modem).
*   **Proxy Management:** Controls for proxy type (SOCKS5, HTTP), rotation settings, and auto-rotate toggle (placeholders).
*   **Ngrok Integration:** Displays Ngrok status, public URL, and allows refreshing the tunnel. Includes an input for Ngrok API Key.
*   **Error Logs:** Scrollable log viewer with filter options (placeholders).
*   **Modular & Responsive UI:** Built with React, Next.js, Tailwind CSS, and shadcn/ui.
*   **Skeleton Loaders:** Provides visual feedback during data fetching.

## Prerequisites

### For the Local Dongle Server (Ubuntu Linux or WSL)

This server needs to run on a machine that can directly connect to your Huawei dongles.

*   **Operating System:** Ubuntu Linux (recommended) or Windows with [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install).
*   **Node.js** (LTS version recommended) and **npm** (or Yarn).
*   **Python 3** and **pip**.
*   **System Utilities:** `curl`, `net-tools` (for `ifconfig`), `iproute2` (for `ip route` and `ip rule`).
*   **`3proxy`**: Essential for the proxy functionality.

### For the Next.js Dashboard (Any OS)

*   **Node.js** (LTS version recommended) and **npm** (or Yarn).
*   **Web Browser.**

## 1. Local Dongle Server Setup

This section details how to set up the `dongle-proxy-server` on your chosen Linux environment (native Ubuntu or Ubuntu via WSL).

### A. Install Prerequisites

#### On Ubuntu Linux (Native)

\`\`\`bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install Python 3 and pip
sudo apt install -y python3 python3-pip

# Install system utilities
sudo apt install -y curl net-tools iproute2

# Install 3proxy
sudo apt install -y 3proxy
\`\`\`

#### On Windows Subsystem for Linux (WSL)

1.  **Enable WSL on Windows:**
    Open PowerShell or Command Prompt **as Administrator** and run:
    \`\`\`powershell
    wsl --install
    \`\`\`
    Restart your computer if prompted.

2.  **Set up WSL Ubuntu:**
    Open the newly installed Ubuntu application. Follow the prompts to create a username and password for your Linux environment.

3.  **Install Prerequisites inside WSL Ubuntu Terminal:**
    \`\`\`bash
    # Update package list
    sudo apt update && sudo apt upgrade -y

    # Install Node.js and npm
    sudo apt install -y nodejs npm

    # Install Python 3 and pip
    sudo apt install -y python3 python3-pip

    # Install system utilities
    sudo apt install -y curl net-tools iproute2

    # Install 3proxy
    sudo apt install -y 3proxy
    \`\`\`

### B. Server Code Setup

1.  **Create Server Directory:**
    Create a directory for your dongle server.
    \`\`\`bash
    # Inside your Ubuntu/WSL terminal
    mkdir ~/dongle-proxy-server
    cd ~/dongle-proxy-server
    \`\`\`

2.  **Copy Server Files:**
    *   Place your `dongle-server.js` script into this directory.
    *   Create the `package.json` file (provided above) in this directory.
    *   Create the `config.js` file in this directory.

3.  **Create `config.js`:**
    \`\`\`javascript
    // ~/dongle-proxy-server/config.js
    module.exports = {
        proxyServerDirectory: '/etc/3proxy/', // Recommended path for 3proxy config files on Ubuntu/WSL
        changeIpScript: '/home/YOUR_WSL_OR_LINUX_USERNAME/dongle-proxy-server/change_ip.py', // Path to your Python script
        pingTimeout: 2, // Ping timeout in seconds
        checkInterval: 3000, // Interval for continuous checks in milliseconds
        maxDevices: 10, // Maximum number of dongles you plan to use
        defaultIP: '192.168.8.1', // Default IP of your dongle
        serverPort: 3001 // Port for the local dongle management API
    };
    \`\`\`
    **Adjust `proxyServerDirectory` and `changeIpScript` to your actual paths and username within your Linux/WSL environment.**

4.  **Prepare Python IP Change Script:**
    Create a file named `change_ip.py` at the path specified in `config.js` (e.g., `/home/YOUR_WSL_OR_LINUX_USERNAME/dongle-proxy-server/change_ip.py`). This script should contain the logic to change the dongle's IP address.

    \`\`\`python
    # /home/YOUR_WSL_OR_LINUX_USERNAME/dongle-proxy-server/change_ip.py
    import argparse
    import subprocess

    def change_ip(gateway_ip):
        print(f"Attempting to change IP for dongle at gateway: {gateway_ip}")
        # --- REPLACE THIS WITH YOUR ACTUAL IP CHANGE LOGIC ---
        # This might involve:
        # 1. Sending AT commands to the dongle via a serial port.
        # 2. Making HTTP requests to the dongle's internal API to trigger a reconnect.
        # 3. Restarting the network interface associated with the dongle.
        #
        # Example (conceptual - might not work directly for your dongle):
        # try:
        #     # Example: Restarting a network interface (replace 'eth1' with your dongle's interface)
        #     subprocess.run(['sudo', 'ifdown', 'eth1'], check=True)
        #     subprocess.run(['sudo', 'ifup', 'eth1'], check=True)
        #     print(f"Interface for {gateway_ip} restarted.")
        # except subprocess.CalledProcessError as e:
        #     print(f"Error restarting interface: {e}")
        #     return False
        # --- END REPLACE ---
        print(f"IP change process for {gateway_ip} completed (check dongle status).")
        return True

    if __name__ == "__main__":
        parser = argparse.ArgumentParser(description="Change IP of a Huawei dongle.")
        parser.add_argument("--gateway", required=True, help="Gateway IP of the dongle (e.g., 192.168.8.1)")
        args = parser.parse_args()
        change_ip(args.gateway)
    \`\`\`
    Make the Python script executable:
    \`\`\`bash
    chmod +x /home/YOUR_WSL_OR_LINUX_USERNAME/dongle-proxy-server/change_ip.py
    \`\`\`

### C. Install and Run the Local Dongle Server

Navigate to your `~/dongle-proxy-server/` directory in your Ubuntu/WSL terminal.

1.  **Install Dependencies:**
    \`\`\`bash
    npm run install-deps
    \`\`\`
    This command will install both Node.js and Python dependencies.

2.  **Run the Server in Different Modes:**

    *   **Mode 1 (Setup Dongles - Initial IP Assignment):**
        \`\`\`bash
        npm run setup-dongles
        \`\`\`
        Plug in your USB modems one at a time. Wait until the script confirms the IP address has been changed before plugging in the next one.

    *   **Mode 2 (Generate Config Files for 3proxy):**
        \`\`\`bash
        npm run generate-configs
        \`\`\`
        This mode creates `3proxy.cfg` and `startproxy.sh` files in your `proxyServerDirectory`.

        **After running Mode 2, you MUST perform these manual, critical steps inside your Ubuntu/WSL terminal:**
        *   **Edit `rt_tables`:** The script will output instructions to add entries to `/etc/iproute2/rt_tables`. Open this file with `sudo nano /etc/iproute2/rt_tables` and append the lines provided by the script. This is crucial for `3proxy` to route traffic correctly.
        *   **Make `startproxy.sh` Executable:**
            \`\`\`bash
            sudo chmod +x /etc/3proxy/startproxy.sh
            \`\`\`
        *   **Run the Proxy (after `rt_tables` is updated):**
            \`\`\`bash
            sudo /etc/3proxy/startproxy.sh
            \`\`\`
            This command will start the `3proxy` service.

    *   **Mode 3 (Start Proxy Monitor & API - Default):**
        \`\`\`bash
        npm start
        \`\`\`
        This is the mode you'll typically run to start the API server that your Next.js dashboard will communicate with. It also continuously monitors dongle status and manages IP rotation. You might want to set this up as a systemd service for automatic startup.

## 2. Next.js Dashboard Setup

This part of the setup runs on your development machine (can be the same Ubuntu/Windows machine or a different one).

1.  **Create Next.js Project:**
    If you don't have the project already, create a new Next.js application:
    \`\`\`bash
    npx create-next-app@latest huawei-dongle-dashboard
    cd huawei-dongle-dashboard
    \`\`\`
    When prompted, select `Yes` for TypeScript, ESLint, Tailwind CSS, `src/` directory, and App Router.

2.  **Install Dependencies:**
    \`\`\`bash
    npm install xml2js @types/xml2js use-debounce # use-debounce is optional but recommended
    \`\`\`

3.  **Install shadcn/ui Components:**
    Initialize shadcn/ui and add the necessary components:
    \`\`\`bash
    npx shadcn@latest init
    npx shadcn@latest add button card dropdown-menu input label radio-group select sheet skeleton switch table textarea
    npx shadcn@latest add sidebar # This will add all sidebar related components
    npx shadcn@latest add breadcrumb # For the breadcrumb in the header
    npx shadcn@latest add badge # For Ngrok status
    npx shadcn@latest add toast # For notifications
    \`\`\`

4.  **Copy Dashboard Code:**
    *   Place the provided React component files (`header.tsx`, `app-sidebar.tsx`, `system-stats-panel.tsx`, `dongle-management-panel.tsx`, `proxy-management-panel.tsx`, `ngrok-integration-panel.tsx`, `error-logs-panel.tsx`) into your `src/components/` directory.
    *   Place the Server Action files (`dongle-actions.ts`, `dongle-proxy-actions.ts`) into `src/app/actions/`.
    *   Place the `config.ts` file into `src/lib/`.
    *   Replace the content of `src/app/layout.tsx` and `src/app/page.tsx` with the provided code.

5.  **Configure Local Server URL:**
    Open `src/lib/config.ts` and update `LOCAL_DONGLE_SERVER_URL` to point to your running local dongle server.

    *   **If running Next.js on the same Ubuntu/WSL machine:**
        \`\`\`typescript
        // src/lib/config.ts
        export const LOCAL_DONGLE_SERVER_URL = "http://localhost:3001";
        \`\`\`
    *   **If running Next.js on a different machine (e.g., Windows accessing WSL, or a separate PC):**
        \`\`\`typescript
        // src/lib/config.ts
        export const LOCAL_DONGLE_SERVER_URL = "http://YOUR_UBUNTU_MACHINE_IP:3001"; // e.g., "http://192.168.1.100:3001"
        \`\`\`
    **If you are deploying your Next.js app to Vercel, you will need to use Ngrok to expose your local server and use the Ngrok public URL here.**

6.  **Add Toast Provider to Layout:**
    Ensure your `src/app/layout.tsx` includes the `Toaster` component for notifications:
    \`\`\`tsx
    // src/app/layout.tsx
    import { Toaster } from "@/components/ui/toaster" // Add this import

    export default async function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode
    }>) {
      // ... existing code
      return (
        <html lang="en">
          <body>
            {/* ... your existing layout content */}
            {children}
            <Toaster /> {/* Add this line */}
          </body>
        </html>
      )
    }
    \`\`\`

7.  **Run the Next.js Development Server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    Open your browser and navigate to `http://localhost:3000` to see the dashboard.

## Usage

Once both the local dongle server and the Next.js dashboard are running:

*   **Dongle Management:** The table will populate with devices detected by your local server. Use the "New IP" button to trigger an IP rotation for a specific dongle.
*   **Dongle Mode Switch:** Select a mode and click "Switch Dongle Mode" to change the dongle's operating mode.
*   **Ngrok Integration:** Enter your Ngrok API key and monitor the tunnel status.
*   **System Stats & Logs:** These panels currently use placeholder data. You would integrate them with your local server's API to fetch real-time data.

## Troubleshooting

*   **"Failed to fetch" error in dashboard:**
    *   **Most common issue:** The Next.js dashboard cannot reach your `LOCAL_DONGLE_SERVER_URL`.
    *   **Check if local server is running:** Ensure `npm start` is active in your `~/dongle-proxy-server/` directory.
    *   **Verify `LOCAL_DONGLE_SERVER_URL`:** Double-check the IP address and port in `src/lib/config.ts`. Use the actual IP of the Ubuntu/WSL machine, not `localhost`, if running Next.js on a different device.
    *   **Firewall:** Ensure the firewall on your Ubuntu/WSL machine is not blocking connections to the local server's port (e.g., 3001). You might need to open the port: `sudo ufw allow 3001/tcp`.
    *   **Ngrok (for Vercel deployments):** If your Next.js app is deployed to Vercel, your local server MUST be exposed via Ngrok (or a similar service) and `LOCAL_DONGLE_SERVER_URL` must be updated to the public Ngrok URL.
*   **Dongle commands not working (check `dongle-server.js` console):**
    *   Check the console output of your `dongle-server.js` for errors.
    *   Ensure the `__RequestVerificationToken` and `Cookie` headers are correctly handled by the dongle's API.
    *   Verify the paths in your `config.js` (e.g., `proxyServerDirectory`, `changeIpScript`).
    *   Ensure the Python script (`change_ip.py`) is executable (`chmod +x`) and has necessary permissions to run system commands (e.g., `sudo` if required for `ifdown`/`ifup`).
*   **`3proxy` or `ifconfig`/`curl` commands failing (check `dongle-server.js` console):**
    *   These commands require proper system setup and permissions. Ensure `3proxy` is installed and configured correctly.
    *   The `startproxy.sh` script needs executable permissions (`chmod +x`).
    *   The `rt_tables` setup is crucial for `3proxy` to route traffic correctly. Double-check the entries you added to `/etc/iproute2/rt_tables`.

## Deployment to Vercel

If you plan to deploy the Next.js dashboard to Vercel:

*   The Next.js application itself will run as a serverless function.
*   **Your `dongle-server.js` MUST continue to run on your local Ubuntu Linux or WSL machine.**
*   To allow your Vercel-deployed dashboard to communicate with your local `dongle-server.js`, you will need to use a service like **Ngrok** to create a public tunnel to your local server's API port (e.g., 3001).
*   Once you have an Ngrok public URL, update `LOCAL_DONGLE_SERVER_URL` in `src/lib/config.ts` to this Ngrok URL.

\`\`\`
