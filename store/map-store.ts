import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface MapFeature {
  id: string
  type: "Feature"
  geometry: {
    type: string
    coordinates: any
  }
  properties: {
    name: string
    type: string
    classification: "friendly" | "enemy" | "neutral" | "unknown"
    unitType?: string
    timestamp: string
    [key: string]: any
  }
}

export interface LayerConfig {
  visible: boolean
  color: string
  opacity: number
}

interface MapState {
  // Map configuration
  mapCenter: [number, number]
  mapZoom: number

  // Features and data
  activeFeatures: MapFeature[]
  selectedFeature: string | null

  // Layer management
  layers: Record<string, LayerConfig>
  timeFilter: string

  // Drawing state
  drawingMode: string | null
  isLoading: boolean

  // Actions
  setMapCenter: (center: [number, number]) => void
  setMapZoom: (zoom: number) => void
  addFeature: (feature: MapFeature) => void
  updateFeature: (id: string, updates: Partial<MapFeature>) => void
  removeFeature: (id: string) => void
  setSelectedFeature: (id: string | null) => void
  toggleLayer: (layerType: string) => void
  setTimeFilter: (filter: string) => void
  setDrawingMode: (mode: string | null) => void
  setLoading: (loading: boolean) => void
  exportGeoJSON: () => any
  importGeoJSON: (geoJSON: any) => void
  loadMockData: () => void
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      // Initial state
      mapCenter: [9.0192, 38.7525], // Addis Ababa coordinates
      mapZoom: 10,
      activeFeatures: [],
      selectedFeature: null,
      layers: {
        marker: { visible: true, color: "#0066cc", opacity: 0.8 },
        polygon: { visible: true, color: "#cc0000", opacity: 0.6 },
        polyline: { visible: true, color: "#00cc00", opacity: 0.8 },
        rectangle: { visible: true, color: "#ffcc00", opacity: 0.6 },
        circle: { visible: true, color: "#cc00cc", opacity: 0.6 },
      },
      timeFilter: "all",
      drawingMode: null,
      isLoading: false,

      // Actions
      setMapCenter: (center) => set({ mapCenter: center }),
      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      addFeature: (feature) =>
        set((state) => ({
          activeFeatures: [...state.activeFeatures, feature],
        })),

      updateFeature: (id, updates) =>
        set((state) => ({
          activeFeatures: state.activeFeatures.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

      removeFeature: (id) =>
        set((state) => ({
          activeFeatures: state.activeFeatures.filter((f) => f.id !== id),
          selectedFeature: state.selectedFeature === id ? null : state.selectedFeature,
        })),

      setSelectedFeature: (id) => set({ selectedFeature: id }),

      toggleLayer: (layerType) =>
        set((state) => ({
          layers: {
            ...state.layers,
            [layerType]: {
              ...state.layers[layerType],
              visible: !state.layers[layerType]?.visible,
            },
          },
        })),

      setTimeFilter: (filter) => set({ timeFilter: filter }),
      setDrawingMode: (mode) => set({ drawingMode: mode }),
      setLoading: (loading) => set({ isLoading: loading }),

      exportGeoJSON: () => {
        const { activeFeatures } = get()
        return {
          type: "FeatureCollection",
          features: activeFeatures,
        }
      },

      importGeoJSON: (geoJSON) => {
        if (geoJSON.type === "FeatureCollection" && Array.isArray(geoJSON.features)) {
          const features = geoJSON.features.map((f: any, index: number) => ({
            ...f,
            id: f.id || `imported_${Date.now()}_${index}`,
            properties: {
              ...f.properties,
              timestamp: f.properties.timestamp || new Date().toISOString(),
            },
          }))
          set((state) => ({
            activeFeatures: [...state.activeFeatures, ...features],
          }))
        }
      },

      loadMockData: () => {
        const mockFeatures: MapFeature[] = [
          {
            id: "unit_alpha",
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [38.7525, 9.0192],
            },
            properties: {
              name: "Unit Alpha",
              type: "marker",
              classification: "friendly",
              unitType: "infantry",
              timestamp: new Date().toISOString(),
            },
          },
          {
            id: "patrol_route_1",
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [38.74, 9.01],
                [38.75, 9.02],
                [38.76, 9.03],
              ],
            },
            properties: {
              name: "Patrol Route 1",
              type: "polyline",
              classification: "friendly",
              timestamp: new Date().toISOString(),
            },
          },
          {
            id: "aoi_sector_1",
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [38.73, 9.0],
                  [38.77, 9.0],
                  [38.77, 9.04],
                  [38.73, 9.04],
                  [38.73, 9.0],
                ],
              ],
            },
            properties: {
              name: "AOI Sector 1",
              type: "polygon",
              classification: "neutral",
              timestamp: new Date().toISOString(),
            },
          },
        ]

        set({ activeFeatures: mockFeatures })
      },
    }),
    {
      name: "map-storage",
      partialize: (state) => ({
        mapCenter: state.mapCenter,
        mapZoom: state.mapZoom,
        activeFeatures: state.activeFeatures,
        layers: state.layers,
        timeFilter: state.timeFilter,
      }),
    },
  ),
)
