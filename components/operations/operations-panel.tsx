"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, MapPin } from "lucide-react"
import { OperationsList } from "./operations-list"
import { CreateOperationDialog } from "./create-operation-dialog"
import { OperationDetails } from "./operation-details"
import { UnitsPanel } from "./units-panel"
import { useOperationsStore } from "@/store/operations-store"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"

export function OperationsPanel() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedView, setSelectedView] = useState<"list" | "details" | "units">("list")

  const { user } = useAuthStore()
  const { currentOperationId, setCurrentOperation } = useDataStore()
  const { operations, selectedOperation, isLoading, loadOperations, selectOperation, getOperationStats } =
    useOperationsStore()

  useEffect(() => {
    loadOperations()
  }, [loadOperations])

  const canCreateOperations = user?.permissions.includes("manage_operations")
  const stats = selectedOperation ? getOperationStats(selectedOperation.id) : null

  const handleOperationSelect = (operationId: string) => {
    selectOperation(operationId)
    setCurrentOperation(operationId)
    setSelectedView("details")
  }

  return (
    <div className="h-full flex">
      {/* Main Operations Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Operations Management</h2>
              {selectedOperation && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedOperation.name}</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {canCreateOperations && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Operation
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 mt-4">
            <Button
              variant={selectedView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("list")}
            >
              Operations List
            </Button>
            {selectedOperation && (
              <>
                <Button
                  variant={selectedView === "details" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("details")}
                >
                  Details
                </Button>
                <Button
                  variant={selectedView === "units" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("units")}
                >
                  Units ({stats?.totalUnits || 0})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedView === "list" && (
            <OperationsList
              operations={operations}
              selectedId={selectedOperation?.id}
              onSelect={handleOperationSelect}
              isLoading={isLoading}
            />
          )}

          {selectedView === "details" && selectedOperation && <OperationDetails operation={selectedOperation} />}

          {selectedView === "units" && selectedOperation && <UnitsPanel operationId={selectedOperation.id} />}
        </div>
      </div>

      {/* Create Operation Dialog */}
      <CreateOperationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
