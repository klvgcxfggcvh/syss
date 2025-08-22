"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "./sidebar"
import { OperationsPanel } from "../operations/operations-panel"
import { TaskingPanel } from "../tasking/tasking-panel"
import { ReportsPanel } from "../reports/reports-panel"
import { MessagingPanel } from "../messaging/messaging-panel"
import { ReplayPanel } from "../replay/replay-panel"

const MapView = dynamic(() => import("../map/map-view").then((m) => m.MapView), {
	ssr: false,
	loading: () => <div className="w-full h-full" />,
})

export type DashboardView = "map" | "operations" | "tasking" | "reports" | "messaging" | "replay"

export function Dashboard() {
	const [activeView, setActiveView] = useState<DashboardView>("map")

	const renderMainContent = () => {
		switch (activeView) {
			case "map":
				return <MapView />
			case "operations":
				return <OperationsPanel />
			case "tasking":
				return <TaskingPanel />
			case "reports":
				return <ReportsPanel />
			case "messaging":
				return <MessagingPanel />
			case "replay":
				return <ReplayPanel />
			default:
				return <MapView />
		}
	}

	return (
		<div className="flex h-[calc(100vh-73px)]">
			<Sidebar activeView={activeView} onViewChange={setActiveView} />
			<main className="flex-1 overflow-hidden">{renderMainContent()}</main>
		</div>
	)
}
