"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ruler, Move, Square } from "lucide-react"

export function MeasureTools() {
  const [measureMode, setMeasureMode] = useState<"distance" | "area" | null>(null)
  const [measurements, setMeasurements] = useState<
    Array<{
      id: string
      type: "distance" | "area"
      value: number
      unit: string
    }>
  >([])

  const clearMeasurements = () => {
    setMeasurements([])
    setMeasureMode(null)
  }

  return (
    <Card className="w-64">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Ruler className="h-4 w-4 mr-2" />
          Measurement Tools
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex space-x-2">
          <Button
            variant={measureMode === "distance" ? "default" : "outline"}
            size="sm"
            onClick={() => setMeasureMode(measureMode === "distance" ? null : "distance")}
          >
            <Move className="h-4 w-4 mr-1" />
            Distance
          </Button>
          <Button
            variant={measureMode === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setMeasureMode(measureMode === "area" ? null : "area")}
          >
            <Square className="h-4 w-4 mr-1" />
            Area
          </Button>
        </div>

        {measureMode && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            Click on the map to start measuring {measureMode}
          </div>
        )}

        {measurements.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Measurements:</div>
            {measurements.map((measurement) => (
              <div key={measurement.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{measurement.type}:</span>
                <Badge variant="secondary">
                  {measurement.value.toFixed(2)} {measurement.unit}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={clearMeasurements}>
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
