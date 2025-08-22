import type { MapFeature } from "@/store/map-store"

export interface OfflineAction {
  id: string
  type: "create" | "update" | "delete"
  featureId: string
  data: any
  timestamp: string
  synced: boolean
}

export interface CachedData {
  id: string
  type: "features" | "operations" | "tasks" | "reports" | "messages"
  data: any
  timestamp: string
  operationId: string
}

class IndexedDBService {
  private db: IDBDatabase | null = null
  private dbName = "army-cop-db"
  private dbVersion = 1

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Features store
        if (!db.objectStoreNames.contains("features")) {
          const featuresStore = db.createObjectStore("features", { keyPath: "id" })
          featuresStore.createIndex("operationId", "operationId", { unique: false })
          featuresStore.createIndex("timestamp", "timestamp", { unique: false })
          featuresStore.createIndex("type", "type", { unique: false })
        }

        // Offline actions store
        if (!db.objectStoreNames.contains("offline_actions")) {
          const actionsStore = db.createObjectStore("offline_actions", { keyPath: "id" })
          actionsStore.createIndex("synced", "synced", { unique: false })
          actionsStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Cached data store
        if (!db.objectStoreNames.contains("cached_data")) {
          const cachedStore = db.createObjectStore("cached_data", { keyPath: "id" })
          cachedStore.createIndex("type", "type", { unique: false })
          cachedStore.createIndex("operationId", "operationId", { unique: false })
          cachedStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Operations store
        if (!db.objectStoreNames.contains("operations")) {
          const operationsStore = db.createObjectStore("operations", { keyPath: "id" })
          operationsStore.createIndex("status", "status", { unique: false })
        }

        // Tasks store
        if (!db.objectStoreNames.contains("tasks")) {
          const tasksStore = db.createObjectStore("tasks", { keyPath: "id" })
          tasksStore.createIndex("operationId", "operationId", { unique: false })
          tasksStore.createIndex("status", "status", { unique: false })
          tasksStore.createIndex("assignedTo", "assignedTo", { unique: false })
        }

        // Reports store
        if (!db.objectStoreNames.contains("reports")) {
          const reportsStore = db.createObjectStore("reports", { keyPath: "id" })
          reportsStore.createIndex("operationId", "operationId", { unique: false })
          reportsStore.createIndex("type", "type", { unique: false })
          reportsStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Messages store
        if (!db.objectStoreNames.contains("messages")) {
          const messagesStore = db.createObjectStore("messages", { keyPath: "id" })
          messagesStore.createIndex("operationId", "operationId", { unique: false })
          messagesStore.createIndex("channelId", "channelId", { unique: false })
          messagesStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  // Features operations
  async saveFeatures(features: MapFeature[], operationId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const transaction = this.db.transaction(["features"], "readwrite")
    const store = transaction.objectStore("features")

    const promises = features.map((feature) => {
      const featureWithOperation = {
        ...feature,
        operationId,
        cachedAt: new Date().toISOString(),
      }
      return new Promise<void>((resolve, reject) => {
        const request = store.put(featureWithOperation)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    })

    await Promise.all(promises)
  }

  async getFeatures(operationId: string): Promise<MapFeature[]> {
    if (!this.db) throw new Error("Database not initialized")

    if (!operationId || operationId === "null" || operationId === "undefined" || typeof operationId !== "string") {
      console.warn("Invalid operationId provided to getFeatures:", operationId)
      return []
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["features"], "readonly")
      const store = transaction.objectStore("features")
      const index = store.index("operationId")

      try {
        const request = index.getAll(operationId)

        request.onsuccess = () => {
          const features = request.result.map(({ operationId, cachedAt, ...feature }) => feature)
          resolve(features)
        }

        request.onerror = () => {
          console.error("Failed to get features:", request.error)
          resolve([]) // Return empty array instead of rejecting
        }
      } catch (error) {
        console.error("Invalid key for getFeatures:", error)
        resolve([])
      }
    })
  }

  async deleteFeature(featureId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["features"], "readwrite")
      const store = transaction.objectStore("features")
      const request = store.delete(featureId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Offline actions operations
  async addOfflineAction(action: Omit<OfflineAction, "id">): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const actionWithId: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_actions"], "readwrite")
      const store = transaction.objectStore("offline_actions")
      const request = store.add(actionWithId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingActions(): Promise<OfflineAction[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_actions"], "readonly")
      const store = transaction.objectStore("offline_actions")

      const request = store.openCursor()
      const pendingActions: OfflineAction[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const action = cursor.value as OfflineAction
          if (!action.synced) {
            pendingActions.push(action)
          }
          cursor.continue()
        } else {
          resolve(pendingActions)
        }
      }

      request.onerror = () => {
        console.error("Failed to get pending actions:", request.error)
        resolve([]) // Return empty array instead of rejecting
      }
    })
  }

  async markActionSynced(actionId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_actions"], "readwrite")
      const store = transaction.objectStore("offline_actions")
      const getRequest = store.get(actionId)

      getRequest.onsuccess = () => {
        const action = getRequest.result
        if (action) {
          action.synced = true
          const putRequest = store.put(action)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Generic cached data operations
  async saveCachedData(data: Omit<CachedData, "id">): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const cachedData: CachedData = {
      ...data,
      id: `${data.type}_${data.operationId}_${Date.now()}`,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readwrite")
      const store = transaction.objectStore("cached_data")
      const request = store.put(cachedData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedData(type: string, operationId: string): Promise<CachedData[]> {
    if (!this.db) throw new Error("Database not initialized")

    if (!operationId || operationId === "null" || operationId === "undefined" || typeof operationId !== "string") {
      console.warn("Invalid operationId provided to getCachedData:", operationId)
      return []
    }

    if (!type || typeof type !== "string") {
      console.warn("Invalid type provided to getCachedData:", type)
      return []
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readonly")
      const store = transaction.objectStore("cached_data")

      const request = store.openCursor()
      const filteredData: CachedData[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const item = cursor.value as CachedData
          if (item.type === type && item.operationId === operationId) {
            filteredData.push(item)
          }
          cursor.continue()
        } else {
          resolve(filteredData)
        }
      }

      request.onerror = () => {
        console.error("Failed to get cached data:", request.error)
        resolve([]) // Return empty array instead of rejecting
      }
    })
  }

  // Cleanup old data
  async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const cutoffDate = new Date(Date.now() - maxAge).toISOString()
    const stores = ["features", "cached_data", "offline_actions"]

    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], "readwrite")
        const store = transaction.objectStore(storeName)
        const index = store.index("timestamp")
        const range = IDBKeyRange.upperBound(cutoffDate)
        const request = index.openCursor(range)

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    }
  }
}

export const indexedDBService = new IndexedDBService()
