import { SystemStatsPanel } from "@/components/system-stats-panel"
import { DongleManagementPanel } from "@/components/dongle-management-panel"
import { ProxyManagementPanel } from "@/components/proxy-management-panel"
import { NgrokIntegrationPanel } from "@/components/ngrok-integration-panel"
import { ErrorLogsPanel } from "@/components/error-logs-panel"

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <SystemStatsPanel />
      <DongleManagementPanel />
      <ProxyManagementPanel />
      <NgrokIntegrationPanel />
      <ErrorLogsPanel />
    </div>
  )
}
