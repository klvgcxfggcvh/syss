"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Eye, EyeOff, Clock, Filter } from "lucide-react"
import { useMapStore } from "@/store/map-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LayersPanelProps {
  onClose: () => void
}

export function LayersPanel({ onClose }: LayersPanelProps) {
  const { layers, toggleLayer, timeFilter, setTimeFilter, activeFeatures } = useMapStore()
  const [filterBy, setFilterBy] = useState<string>("all")

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
  ]

  const getFeatureCount = (layerType: string) => {
    return activeFeatures.filter((f) => f.properties.type === layerType).length
  }

  const getClassificationCount = (classification: string) => {
    return activeFeatures.filter((f) => f.properties.classification === classification).length
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Map Layers</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Time Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time Filter</span>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Layer Types */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Feature Types</span>
          </div>

          {Object.entries(layers).map(([layerType, layer]) => (
            <div key={layerType} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch checked={layer.visible} onCheckedChange={() => toggleLayer(layerType)} />
                <div className="flex items-center space-x-2">
                  {layer.visible ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm capitalize">{layerType}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getFeatureCount(layerType)}
              </Badge>
            </div>
          ))}
        </div>

        <Separator />

        {/* Classification Filter */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Classifications</span>

          {["friendly", "enemy", "neutral", "unknown"].map((classification) => (
            <div key={classification} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getClassificationColor(classification),
                  }}
                />
                <span className="text-sm capitalize">{classification}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {getClassificationCount(classification)}
              </Badge>
            </div>
          ))}
        </div>

        <Separator />

        {/* Layer Actions */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Show All Layers
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Hide All Layers
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

function getClassificationColor(classification: string): string {
  switch (classification) {
    case "friendly":
      return "#0066cc"
    case "enemy":
      return "#cc0000"
    case "neutral":
      return "#00cc00"
    case "unknown":
      return "#ffcc00"
    default:
      return "#666666"
  }
}
