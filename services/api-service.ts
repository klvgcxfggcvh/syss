import type { MapFeature } from "@/store/map-store"

export interface COPResponse {
  type: "FeatureCollection"
  features: MapFeature[]
  metadata: {
    timestamp: string
    operationId: string
    bbox?: [number, number, number, number]
    totalFeatures: number
  }
}

export interface PositionUpdate {
  featureId: string
  coordinates: [number, number]
  timestamp: string
  speed?: number
  heading?: number
  status?: string
}

export interface APIError {
  code: string
  message: string
  details?: any
}

class APIService {
  private baseUrl: string
  private operationId: string | null = null
  private authToken: string | null = null

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (process.env.NODE_ENV === "production" ? "https://api.army-cop.mil" : "/api")
  }

  setOperationId(operationId: string) {
    if (!operationId || operationId === "null" || operationId === "undefined") {
      console.warn("Invalid operation ID provided to API service:", operationId)
      this.operationId = null
      return
    }
    this.operationId = operationId
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  async fetchCOPData(
    params: {
      bbox?: [number, number, number, number]
      from?: string
      to?: string
    } = {},
  ): Promise<COPResponse> {
    if (!this.operationId) {
      throw new Error("Operation ID not set")
    }

    const searchParams = new URLSearchParams()
    if (params.bbox) {
      searchParams.set("bbox", params.bbox.join(","))
    }
    if (params.from) {
      searchParams.set("from", params.from)
    }
    if (params.to) {
      searchParams.set("to", params.to)
    }

    const url = `${this.baseUrl}/ops/${this.operationId}/cop?${searchParams}`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required")
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to fetch COP data:", error)
      if (process.env.NODE_ENV === "development") {
        return this.getMockCOPData(params)
      }
      throw error
    }
  }

  async createFeature(feature: Omit<MapFeature, "id">): Promise<MapFeature> {
    if (!this.operationId) {
      throw new Error("Operation ID not set")
    }

    const url = `${this.baseUrl}/ops/${this.operationId}/features`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feature),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required")
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to create feature:", error)
      if (process.env.NODE_ENV === "development") {
        return {
          ...feature,
          id: `mock_${Date.now()}`,
        } as MapFeature
      }
      throw error
    }
  }

  async updateFeature(id: string, updates: Partial<MapFeature>): Promise<MapFeature> {
    if (!this.operationId) {
      throw new Error("Operation ID not set")
    }

    const url = `${this.baseUrl}/ops/${this.operationId}/features/${id}`

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required")
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update feature:", error)
      throw error
    }
  }

  async deleteFeature(id: string): Promise<void> {
    if (!this.operationId) {
      throw new Error("Operation ID not set")
    }

    const url = `${this.baseUrl}/ops/${this.operationId}/features/${id}`

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required")
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to delete feature:", error)
      throw error
    }
  }

  private getAuthToken(): string {
    if (typeof window !== "undefined") {
      try {
        // Get the current auth state from localStorage (where Zustand persists it)
        const authStorage = localStorage.getItem("auth-storage")
        if (authStorage) {
          const authState = JSON.parse(authStorage)
          if (authState?.state?.token) {
            return authState.state.token
          }
        }
      } catch (error) {
        console.error("Failed to get auth token from storage:", error)
      }
    }

    // Development fallback
    if (process.env.NODE_ENV === "development") {
      return "mock-token"
    }

    throw new Error("No authentication token available")
  }

  private getMockCOPData(params: any): COPResponse {
    const mockFeatures: MapFeature[] = [
      {
        id: "unit_alpha_1",
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
          status: "active",
          speed: 5.2,
          heading: 45,
        },
      },
      {
        id: "unit_bravo_1",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [38.7425, 9.0292],
        },
        properties: {
          name: "Unit Bravo",
          type: "marker",
          classification: "friendly",
          unitType: "armor",
          timestamp: new Date().toISOString(),
          status: "moving",
          speed: 12.5,
          heading: 90,
        },
      },
      {
        id: "enemy_contact_1",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [38.7625, 9.0292],
        },
        properties: {
          name: "Enemy Contact",
          type: "marker",
          classification: "enemy",
          unitType: "unknown",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: "observed",
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
            [38.77, 9.04],
          ],
        },
        properties: {
          name: "Patrol Route Alpha",
          type: "polyline",
          classification: "friendly",
          timestamp: new Date().toISOString(),
          status: "planned",
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
              [38.78, 9.0],
              [38.78, 9.05],
              [38.73, 9.05],
              [38.73, 9.0],
            ],
          ],
        },
        properties: {
          name: "Area of Interest - Sector 1",
          type: "polygon",
          classification: "neutral",
          timestamp: new Date().toISOString(),
          priority: "high",
        },
      },
    ]

    return {
      type: "FeatureCollection",
      features: mockFeatures,
      metadata: {
        timestamp: new Date().toISOString(),
        operationId: this.operationId || "mock-operation",
        totalFeatures: mockFeatures.length,
      },
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }
}

export const apiService = new APIService()
