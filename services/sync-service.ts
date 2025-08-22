import { apiService } from "./api-service"
import { indexedDBService, type OfflineAction } from "./indexeddb-service"
import { useMapStore } from "@/store/map-store"

class SyncService {
  private syncInProgress = false
  private syncInterval: NodeJS.Timeout | null = null

  async initialize() {
    await indexedDBService.initialize()
    this.startPeriodicSync()

    // Listen for online/offline events
    window.addEventListener("online", () => {
      console.log("Connection restored, starting sync...")
      this.syncPendingActions()
    })

    window.addEventListener("offline", () => {
      console.log("Connection lost, enabling offline mode...")
    })
  }

  private startPeriodicSync() {
    // Sync every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.syncPendingActions()
      }
    }, 30000)
  }

  async syncPendingActions(): Promise<void> {
    if (this.syncInProgress) return

    this.syncInProgress = true

    try {
      if (!indexedDBService) {
        console.warn("IndexedDB service not available, skipping sync")
        return
      }

      const pendingActions = await indexedDBService.getPendingActions()
      console.log(`Syncing ${pendingActions.length} pending actions...`)

      for (const action of pendingActions) {
        if (!action || !action.id || !action.type) {
          console.warn("Invalid action found, skipping:", action)
          continue
        }

        try {
          await this.syncAction(action)
          await indexedDBService.markActionSynced(action.id)
          console.log(`Synced action: ${action.type} ${action.featureId}`)
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error)
          // Continue with other actions
        }
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case "create":
        await apiService.createFeature(action.data)
        break
      case "update":
        await apiService.updateFeature(action.featureId, action.data)
        break
      case "delete":
        await apiService.deleteFeature(action.featureId)
        break
      default:
        console.warn(`Unknown action type: ${action.type}`)
    }
  }

  async queueOfflineAction(type: "create" | "update" | "delete", featureId: string, data: any): Promise<void> {
    await indexedDBService.addOfflineAction({
      type,
      featureId,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    })

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncPendingActions()
    }
  }

  async loadOfflineData(operationId: string): Promise<void> {
    if (!operationId || operationId === "null" || operationId === "undefined" || typeof operationId !== "string") {
      console.warn("Cannot load offline data: Invalid operation ID:", operationId)
      return
    }

    try {
      const features = await indexedDBService.getFeatures(operationId)
      if (features.length > 0) {
        const mapStore = useMapStore.getState()
        features.forEach((feature) => {
          if (feature && feature.id) {
            mapStore.addFeature(feature)
          }
        })
        console.log(`Loaded ${features.length} features from offline storage`)
      }
    } catch (error) {
      console.error("Failed to load offline data:", error)
    }
  }

  async saveDataForOffline(operationId: string): Promise<void> {
    if (!operationId || operationId === "null" || operationId === "undefined" || typeof operationId !== "string") {
      console.warn("Cannot save offline data: Invalid operation ID:", operationId)
      return
    }

    try {
      const mapStore = useMapStore.getState()
      const validFeatures = mapStore.activeFeatures.filter((feature) => feature && feature.id)

      if (validFeatures.length > 0) {
        await indexedDBService.saveFeatures(validFeatures, operationId)
        console.log(`Saved ${validFeatures.length} features for offline use`)
      }
    } catch (error) {
      console.error("Failed to save data for offline:", error)
    }
  }

  isOnline(): boolean {
    return navigator.onLine
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }

    window.removeEventListener("online", this.syncPendingActions)
    window.removeEventListener("offline", () => {})
  }
}

export const syncService = new SyncService()
