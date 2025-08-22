"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Square, Circle, Edit3, Trash2, Move } from "lucide-react"
import { useMapStore } from "@/store/map-store"

export function DrawingTools() {
  const { drawingMode, setDrawingMode, selectedFeature, removeFeature } = useMapStore()

  const drawingModes = [
    { id: "marker", icon: MapPin, label: "Point" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "polygon", icon: Edit3, label: "Polygon" },
    { id: "polyline", icon: Move, label: "Line" },
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Draw:</span>

      {drawingModes.map((mode) => {
        const Icon = mode.icon
        return (
          <Button
            key={mode.id}
            variant={drawingMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setDrawingMode(drawingMode === mode.id ? null : mode.id)}
          >
            <Icon className="h-4 w-4 mr-1" />
            {mode.label}
          </Button>
        )
      })}

      <Separator orientation="vertical" className="h-6" />

      {selectedFeature && (
        <Button variant="destructive" size="sm" onClick={() => removeFeature(selectedFeature)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}

      {drawingMode && (
        <Badge variant="secondary" className="ml-2">
          Drawing Mode: {drawingModes.find((m) => m.id === drawingMode)?.label}
        </Badge>
      )}
    </div>
  )
}
