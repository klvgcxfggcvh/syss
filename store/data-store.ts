import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiService } from "@/services/api-service"
import { realtimeService, type RealtimeEvent } from "@/services/realtime-service"
import { syncService } from "@/services/sync-service"

interface DataState {
  // Connection status
  isOnline: boolean
  isConnected: boolean
  lastSync: string | null
  syncInProgress: boolean

  // Current operation
  currentOperationId: string | null

  // Data loading states
  isLoadingFeatures: boolean
  isLoadingOperations: boolean

  // Error handling
  lastError: string | null

  // Actions
  setOnlineStatus: (online: boolean) => void
  setCurrentOperation: (operationId: string) => void
  loadCOPData: (params?: { bbox?: [number, number, number, number]; from?: string; to?: string }) => Promise<void>
  initializeRealtime: () => void
  disconnectRealtime: () => void
  handleRealtimeEvent: (event: RealtimeEvent) => void
  syncOfflineData: () => Promise<void>
  clearError: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isConnected: false,
      lastSync: null,
      syncInProgress: false,
      currentOperationId: null,
      isLoadingFeatures: false,
      isLoadingOperations: false,
      lastError: null,

      // Actions
      setOnlineStatus: (online) => {
        set({ isOnline: online })
        if (online) {
          get().syncOfflineData()
        }
      },

      setCurrentOperation: (operationId) => {
        set({ currentOperationId: operationId })
        apiService.setOperationId(operationId)
        realtimeService.setOperationId(operationId)

        if (operationId && operationId !== "null" && operationId !== "undefined") {
          // Load offline data first
          syncService.loadOfflineData(operationId)

          // Then load fresh data if online
          if (get().isOnline) {
            get().loadCOPData()
          }

          // Initialize realtime connection
          if (get().isOnline) {
            get().initializeRealtime()
          }
        } else {
          console.warn("Invalid operation ID provided:", operationId)
          // Disconnect realtime if invalid operation
          get().disconnectRealtime()
        }
      },

      loadCOPData: async (params = {}) => {
        const { currentOperationId, isOnline } = get()
        if (!currentOperationId) return

        set({ isLoadingFeatures: true, lastError: null })

        try {
          const response = await apiService.fetchCOPData(params)

          // Update map store with new features
          const { useMapStore } = await import("@/store/map-store")
          const mapStore = useMapStore.getState()

          // Clear existing features and add new ones
          mapStore.activeFeatures.forEach((f) => mapStore.removeFeature(f.id))
          response.features.forEach((feature) => mapStore.addFeature(feature))

          // Save for offline use
          if (isOnline) {
            await syncService.saveDataForOffline(currentOperationId)
          }

          set({
            lastSync: new Date().toISOString(),
            isLoadingFeatures: false,
          })
        } catch (error) {
          console.error("Failed to load COP data:", error)
          set({
            lastError: error instanceof Error ? error.message : "Failed to load data",
            isLoadingFeatures: false,
          })
        }
      },

      initializeRealtime: () => {
        const { currentOperationId } = get()
        if (!currentOperationId || currentOperationId === "null" || currentOperationId === "undefined") {
          console.warn("Cannot initialize realtime: No valid operation selected")
          return
        }

        // Set up event handlers
        realtimeService.on("position_update", get().handleRealtimeEvent)
        realtimeService.on("feature_created", get().handleRealtimeEvent)
        realtimeService.on("feature_updated", get().handleRealtimeEvent)
        realtimeService.on("feature_deleted", get().handleRealtimeEvent)

        // Connect to realtime services
        realtimeService.connect()
        set({ isConnected: true })
      },

      disconnectRealtime: () => {
        realtimeService.disconnect()
        set({ isConnected: false })
      },

      handleRealtimeEvent: async (event: RealtimeEvent) => {
        const { useMapStore } = await import("@/store/map-store")
        const mapStore = useMapStore.getState()

        switch (event.type) {
          case "position_update":
            const positionUpdate = event.data
            const existingFeature = mapStore.activeFeatures.find((f) => f.id === positionUpdate.featureId)
            if (existingFeature) {
              mapStore.updateFeature(positionUpdate.featureId, {
                geometry: {
                  ...existingFeature.geometry,
                  coordinates: positionUpdate.coordinates,
                },
                properties: {
                  ...existingFeature.properties,
                  timestamp: positionUpdate.timestamp,
                  speed: positionUpdate.speed,
                  heading: positionUpdate.heading,
                  status: positionUpdate.status,
                },
              })
            }
            break

          case "feature_created":
            mapStore.addFeature(event.data)
            break

          case "feature_updated":
            mapStore.updateFeature(event.data.id, event.data)
            break

          case "feature_deleted":
            mapStore.removeFeature(event.data.id)
            break

          default:
            console.log("Unhandled realtime event:", event.type)
        }
      },

      syncOfflineData: async () => {
        set({ syncInProgress: true })
        try {
          await syncService.syncPendingActions()
          set({ lastSync: new Date().toISOString() })
        } catch (error) {
          console.error("Sync failed:", error)
          set({ lastError: "Sync failed" })
        } finally {
          set({ syncInProgress: false })
        }
      },

      clearError: () => set({ lastError: null }),
    }),
    {
      name: "data-storage",
      partialize: (state) => ({
        currentOperationId: state.currentOperationId,
        lastSync: state.lastSync,
      }),
    },
  ),
)

// Initialize sync service and online/offline listeners
if (typeof window !== "undefined") {
  syncService.initialize()

  window.addEventListener("online", () => {
    useDataStore.getState().setOnlineStatus(true)
  })

  window.addEventListener("offline", () => {
    useDataStore.getState().setOnlineStatus(false)
  })
}
