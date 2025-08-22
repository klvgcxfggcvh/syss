"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Map, Layers, Download, Upload, Ruler, Edit3, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { LayersPanel } from "./layers-panel"
import { MeasureTools } from "./measure-tools"
import { DrawingTools } from "./drawing-tools"
import { LeafletMap } from "./leaflet-map"
import { useMapStore } from "@/store/map-store"
import { useDataStore } from "@/store/data-store"
import { useI18nStore } from "@/store/i18n-store"

export function MapView() {
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showMeasureTools, setShowMeasureTools] = useState(false)
  const [showDrawingTools, setShowDrawingTools] = useState(false)
  const { t } = useI18nStore()
  const { isLoading, activeFeatures, selectedFeature, drawingMode, setDrawingMode, exportGeoJSON, importGeoJSON } =
    useMapStore()

  const {
    isOnline,
    isConnected,
    lastSync,
    syncInProgress,
    currentOperationId,
    isLoadingFeatures,
    lastError,
    loadCOPData,
    initializeRealtime,
    syncOfflineData,
    clearError,
  } = useDataStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentOperationId && isOnline) {
      initializeRealtime()
    }
  }, [currentOperationId, isOnline, initializeRealtime])

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/json") {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const geoJSON = JSON.parse(e.target?.result as string)
          importGeoJSON(geoJSON)
        } catch (error) {
          console.error("Failed to import GeoJSON:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleExport = () => {
    const geoJSON = exportGeoJSON()
    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cop-data-${new Date().toISOString().split("T")[0]}.geojson`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    if (isOnline) {
      loadCOPData()
    }
  }

  const handleSync = () => {
    syncOfflineData()
  }

  return (
    <div className="h-full flex">
      {/* Main Map Area */}
      <div className="flex-1 flex flex-col">
        {/* Map Toolbar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Map className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Tactical Map</h2>

              <div className="flex items-center space-x-2">
                <Badge variant={isLoadingFeatures ? "secondary" : "outline"}>
                  {isLoadingFeatures ? "Loading..." : "Live"}
                </Badge>

                {activeFeatures.length > 0 && <Badge variant="secondary">{activeFeatures.length} Features</Badge>}

                <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </Badge>

                {isConnected && (
                  <Badge variant="outline" className="text-green-600">
                    Real-time
                  </Badge>
                )}

                {syncInProgress && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Syncing</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={showLayersPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLayersPanel(!showLayersPanel)}
              >
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>

              <Button
                variant={showMeasureTools ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMeasureTools(!showMeasureTools)}
              >
                <Ruler className="h-4 w-4 mr-2" />
                Measure
              </Button>

              <Button
                variant={showDrawingTools ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDrawingTools(!showDrawingTools)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Draw
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={!isOnline || isLoadingFeatures}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingFeatures ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              {!isOnline && (
                <Button variant="outline" size="sm" onClick={handleSync} disabled={syncInProgress}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? "animate-spin" : ""}`} />
                  Sync
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {lastError && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
              Error: {lastError}
              <Button variant="ghost" size="sm" onClick={clearError} className="ml-2 h-auto p-1">
                ×
              </Button>
            </div>
          )}

          {lastSync && (
            <div className="mt-2 text-xs text-muted-foreground">Last sync: {new Date(lastSync).toLocaleString()}</div>
          )}

          {/* Drawing Tools Bar */}
          {showDrawingTools && (
            <div className="mt-3 pt-3 border-t">
              <DrawingTools />
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <LeafletMap />

          {/* Measure Tools Overlay */}
          {showMeasureTools && (
            <div className="absolute top-4 left-4 z-[1000]">
              <MeasureTools />
            </div>
          )}
        </div>
      </div>

      {/* Layers Panel */}
      {showLayersPanel && (
        <div className="w-80 border-l bg-card">
          <LayersPanel onClose={() => setShowLayersPanel(false)} />
        </div>
      )}

      {/* Hidden file input for import */}
      <input ref={fileInputRef} type="file" accept=".json,.geojson" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
