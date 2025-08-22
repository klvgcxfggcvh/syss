import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Unit {
  id: string
  name: string
  callSign: string
  type: "infantry" | "armor" | "artillery" | "aviation" | "logistics" | "medical" | "engineer" | "signal"
  size: number
  commander: string
  status: "active" | "standby" | "offline" | "maintenance"
  readiness: "ready" | "partial" | "not_ready"
  equipmentStatus: "operational" | "partial" | "maintenance"
  lastKnownPosition?: {
    coordinates: [number, number]
    timestamp: string
    accuracy?: number
  }
  lastUpdate: string
  operationId?: string
  parentUnit?: string
  subUnits: string[]
}

interface UnitsState {
  units: Unit[]
  isLoading: boolean
  lastError: string | null

  // Actions
  loadUnits: (operationId?: string) => Promise<void>
  createUnit: (unit: Omit<Unit, "id" | "lastUpdate">) => Promise<void>
  updateUnit: (id: string, updates: Partial<Unit>) => Promise<void>
  deleteUnit: (id: string) => Promise<void>
  updateUnitPosition: (id: string, position: { coordinates: [number, number]; timestamp: string }) => void
  getUnitsByOperation: (operationId: string) => Unit[]
  getUnitsByType: (type: Unit["type"]) => Unit[]
  getUnitsByStatus: (status: Unit["status"]) => Unit[]
}

export const useUnitsStore = create<UnitsState>()(
  persist(
    (set, get) => ({
      units: [],
      isLoading: false,
      lastError: null,

      loadUnits: async (operationId) => {
        set({ isLoading: true, lastError: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockUnits: Unit[] = [
            {
              id: "unit_alpha",
              name: "Alpha Company",
              callSign: "Alpha-1",
              type: "infantry",
              size: 120,
              commander: "Capt. Anderson",
              status: "active",
              readiness: "ready",
              equipmentStatus: "operational",
              lastKnownPosition: {
                coordinates: [38.7525, 9.0192],
                timestamp: new Date().toISOString(),
                accuracy: 5,
              },
              lastUpdate: new Date().toISOString(),
              operationId: "op_001",
              subUnits: ["unit_alpha_1", "unit_alpha_2", "unit_alpha_3"],
            },
            {
              id: "unit_bravo",
              name: "Bravo Company",
              callSign: "Bravo-1",
              type: "armor",
              size: 80,
              commander: "Maj. Thompson",
              status: "active",
              readiness: "ready",
              equipmentStatus: "operational",
              lastKnownPosition: {
                coordinates: [38.7625, 9.0292],
                timestamp: new Date(Date.now() - 300000).toISOString(),
                accuracy: 10,
              },
              lastUpdate: new Date(Date.now() - 300000).toISOString(),
              operationId: "op_001",
              subUnits: ["unit_bravo_1", "unit_bravo_2"],
            },
            {
              id: "unit_charlie",
              name: "Charlie Support",
              callSign: "Charlie-1",
              type: "logistics",
              size: 60,
              commander: "Lt. Wilson",
              status: "standby",
              readiness: "partial",
              equipmentStatus: "maintenance",
              lastKnownPosition: {
                coordinates: [38.7425, 9.0092],
                timestamp: new Date(Date.now() - 600000).toISOString(),
                accuracy: 15,
              },
              lastUpdate: new Date(Date.now() - 600000).toISOString(),
              operationId: "op_001",
              subUnits: [],
            },
            {
              id: "unit_delta",
              name: "Delta Engineers",
              callSign: "Delta-1",
              type: "engineer",
              size: 40,
              commander: "Capt. Brown",
              status: "active",
              readiness: "ready",
              equipmentStatus: "operational",
              lastKnownPosition: {
                coordinates: [38.7725, 9.0392],
                timestamp: new Date(Date.now() - 120000).toISOString(),
                accuracy: 8,
              },
              lastUpdate: new Date(Date.now() - 120000).toISOString(),
              operationId: "op_002",
              subUnits: ["unit_delta_1"],
            },
            {
              id: "unit_echo",
              name: "Echo Medical",
              callSign: "Echo-1",
              type: "medical",
              size: 25,
              commander: "Dr. Martinez",
              status: "offline",
              readiness: "not_ready",
              equipmentStatus: "maintenance",
              lastKnownPosition: {
                coordinates: [38.7325, 8.9992],
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                accuracy: 20,
              },
              lastUpdate: new Date(Date.now() - 7200000).toISOString(),
              operationId: "op_003",
              subUnits: [],
            },
          ]

          // Filter by operation if specified
          const filteredUnits = operationId ? mockUnits.filter((unit) => unit.operationId === operationId) : mockUnits

          set({ units: filteredUnits, isLoading: false })
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to load units",
            isLoading: false,
          })
        }
      },

      createUnit: async (unitData) => {
        set({ isLoading: true, lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newUnit: Unit = {
            ...unitData,
            id: `unit_${Date.now()}`,
            lastUpdate: new Date().toISOString(),
          }

          set((state) => ({
            units: [...state.units, newUnit],
            isLoading: false,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to create unit",
            isLoading: false,
          })
        }
      },

      updateUnit: async (id, updates) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            units: state.units.map((unit) =>
              unit.id === id ? { ...unit, ...updates, lastUpdate: new Date().toISOString() } : unit,
            ),
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to update unit",
          })
        }
      },

      deleteUnit: async (id) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            units: state.units.filter((unit) => unit.id !== id),
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to delete unit",
          })
        }
      },

      updateUnitPosition: (id, position) => {
        set((state) => ({
          units: state.units.map((unit) =>
            unit.id === id
              ? {
                  ...unit,
                  lastKnownPosition: {
                    ...position,
                    accuracy: unit.lastKnownPosition?.accuracy || 10,
                  },
                  lastUpdate: new Date().toISOString(),
                }
              : unit,
          ),
        }))
      },

      getUnitsByOperation: (operationId) => {
        return get().units.filter((unit) => unit.operationId === operationId)
      },

      getUnitsByType: (type) => {
        return get().units.filter((unit) => unit.type === type)
      },

      getUnitsByStatus: (status) => {
        return get().units.filter((unit) => unit.status === status)
      },
    }),
    {
      name: "units-storage",
      partialize: (state) => ({
        units: state.units,
      }),
    },
  ),
)
