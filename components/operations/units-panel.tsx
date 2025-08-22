"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Users, Search, Plus, MapPin, Radio, Battery } from "lucide-react"
import { useUnitsStore } from "@/store/units-store"

interface UnitsPanelProps {
  operationId: string
}

export function UnitsPanel({ operationId }: UnitsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { units, isLoading, loadUnits, getUnitsByOperation } = useUnitsStore()

  useEffect(() => {
    loadUnits(operationId)
  }, [operationId, loadUnits])

  const operationUnits = getUnitsByOperation(operationId)
  const filteredUnits = operationUnits.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.callSign.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "standby":
        return "secondary"
      case "offline":
        return "destructive"
      case "maintenance":
        return "outline"
      default:
        return "outline"
    }
  }

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case "ready":
        return "default"
      case "partial":
        return "secondary"
      case "not_ready":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assigned Units</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Assign Unit
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Units List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading units...</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "No units match your search" : "No units assigned to this operation"}
            </p>
          </div>
        ) : (
          filteredUnits.map((unit) => (
            <Card key={unit.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{unit.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Radio className="h-4 w-4" />
                      <span>{unit.callSign}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={getStatusColor(unit.status)}>{unit.status}</Badge>
                    <Badge variant={getReadinessColor(unit.readiness)} className="text-xs">
                      {unit.readiness.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Unit Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Type:</span>
                      <span>{unit.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Size:</span>
                      <span>{unit.size} personnel</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Commander:</span>
                      <span>{unit.commander}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4" />
                      <span>Equipment: {unit.equipmentStatus}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {unit.lastKnownPosition
                        ? `${unit.lastKnownPosition.coordinates[1].toFixed(4)}, ${unit.lastKnownPosition.coordinates[0].toFixed(4)}`
                        : "Position unknown"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last update: {new Date(unit.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Locate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Radio className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
