"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import "leaflet-draw"
import { useMapStore } from "@/store/map-store"
import { createNATOSymbol } from "@/lib/nato-symbols"

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

export function LeafletMapInner() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const drawControlRef = useRef<L.Control.Draw | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())

  const {
    activeFeatures,
    drawingMode,
    selectedFeature,
    addFeature,
    updateFeature,
    removeFeature,
    setSelectedFeature,
    layers,
    mapCenter,
    mapZoom,
  } = useMapStore()

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: true,
      attributionControl: true,
    })

    // Add base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map)

    // Add drawn items layer
    map.addLayer(drawnItemsRef.current!)

    // Initialize drawing controls
    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<strong>Error:</strong> Shape edges cannot cross!",
          },
          shapeOptions: {
            color: "#97009c",
          },
        },
        polyline: {
          shapeOptions: {
            color: "#f357a1",
            weight: 3,
          },
        },
        rectangle: {
          shapeOptions: {
            clickable: false,
          },
        },
        circle: {
          shapeOptions: {
            color: "#662d91",
          },
        },
        marker: true,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current!,
        remove: true,
      },
    })

    map.addControl(drawControl)
    drawControlRef.current = drawControl

    // Handle drawing events
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const { layer, layerType } = event
      const feature = {
        id: `feature_${Date.now()}`,
        type: "Feature" as const,
        geometry: layer.toGeoJSON().geometry,
        properties: {
          type: layerType,
          name: `New ${layerType}`,
          classification: "friendly",
          timestamp: new Date().toISOString(),
        },
      }

      drawnItemsRef.current!.addLayer(layer)
      addFeature(feature)
    })

    map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers
      layers.eachLayer((layer: any) => {
        // Update feature in store
        console.log("Feature edited:", layer)
      })
    })

    map.on(L.Draw.Event.DELETED, (event: any) => {
      const layers = event.layers
      layers.eachLayer((layer: any) => {
        // Remove feature from store
        console.log("Feature deleted:", layer)
      })
    })

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update features on map
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing features
    drawnItemsRef.current!.clearLayers()

    // Add features to map
    activeFeatures.forEach((feature) => {
      if (!layers[feature.properties.type]?.visible) return

      const layer = L.geoJSON(feature, {
        pointToLayer: (feature, latlng) => {
          const symbol = createNATOSymbol(feature.properties.classification, feature.properties.unitType)
          return L.marker(latlng, {
            icon: L.divIcon({
              html: symbol,
              className: "nato-symbol",
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          })
        },
        style: (feature) => {
          const classification = feature?.properties.classification
          return {
            color: getClassificationColor(classification),
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.3,
          }
        },
        onEachFeature: (feature, layer) => {
          // Add popup
          const popup = L.popup().setContent(`
            <div class="p-2">
              <h3 class="font-semibold">${feature.properties.name}</h3>
              <p class="text-sm text-gray-600">Type: ${feature.properties.type}</p>
              <p class="text-sm text-gray-600">Classification: ${feature.properties.classification}</p>
              <p class="text-sm text-gray-600">Time: ${new Date(feature.properties.timestamp).toLocaleString()}</p>
            </div>
          `)
          layer.bindPopup(popup)

          // Handle click
          layer.on("click", () => {
            setSelectedFeature(feature.id)
          })
        },
      })

      drawnItemsRef.current!.addLayer(layer)
    })
  }, [activeFeatures, layers, setSelectedFeature])

  return <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "400px" }} />
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