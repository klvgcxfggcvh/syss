import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Operation {
  id: string
  name: string
  description: string
  location: string
  status: "planning" | "active" | "completed" | "suspended"
  priority: "low" | "medium" | "high"
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
  assignedUnits: string[]
  aoi?: {
    type: "Polygon"
    coordinates: number[][][]
  } | null
  createdBy: string
  commander?: string
}

interface OperationsState {
  operations: Operation[]
  selectedOperation: Operation | null
  isLoading: boolean
  lastError: string | null

  // Actions
  loadOperations: () => Promise<void>
  createOperation: (operation: Omit<Operation, "id" | "createdAt" | "updatedAt" | "createdBy">) => Promise<void>
  updateOperation: (id: string, updates: Partial<Operation>) => Promise<void>
  deleteOperation: (id: string) => Promise<void>
  selectOperation: (id: string) => void
  assignUnit: (operationId: string, unitId: string) => Promise<void>
  unassignUnit: (operationId: string, unitId: string) => Promise<void>
  getOperationStats: (operationId: string) => {
    totalUnits: number
    activeUnits: number
    completedTasks: number
    pendingTasks: number
  } | null
}

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set, get) => ({
      operations: [],
      selectedOperation: null,
      isLoading: false,
      lastError: null,

      loadOperations: async () => {
        set({ isLoading: true, lastError: null })

        try {
          // Simulate API call - replace with actual API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockOperations: Operation[] = [
            {
              id: "op_001",
              name: "Operation Thunder",
              description:
                "Secure the northern border region and establish forward operating bases for ongoing security operations.",
              location: "Northern Border Region",
              status: "active",
              priority: "high",
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date().toISOString(),
              assignedUnits: ["unit_alpha", "unit_bravo", "unit_charlie"],
              aoi: {
                type: "Polygon",
                coordinates: [
                  [
                    [38.7, 9.0],
                    [38.8, 9.0],
                    [38.8, 9.1],
                    [38.7, 9.1],
                    [38.7, 9.0],
                  ],
                ],
              },
              createdBy: "admin",
              commander: "Col. Smith",
            },
            {
              id: "op_002",
              name: "Operation Shield",
              description: "Humanitarian assistance and disaster relief operations in flood-affected areas.",
              location: "Eastern Province",
              status: "planning",
              priority: "medium",
              startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date().toISOString(),
              assignedUnits: ["unit_delta"],
              aoi: null,
              createdBy: "admin",
              commander: "Maj. Johnson",
            },
            {
              id: "op_003",
              name: "Operation Peacekeep",
              description: "Completed peacekeeping mission in the southern region with full objectives achieved.",
              location: "Southern Region",
              status: "completed",
              priority: "high",
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              assignedUnits: ["unit_echo", "unit_foxtrot"],
              aoi: {
                type: "Polygon",
                coordinates: [
                  [
                    [38.6, 8.9],
                    [38.9, 8.9],
                    [38.9, 9.2],
                    [38.6, 9.2],
                    [38.6, 8.9],
                  ],
                ],
              },
              createdBy: "admin",
              commander: "Lt. Col. Davis",
            },
          ]

          set({ operations: mockOperations, isLoading: false })
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to load operations",
            isLoading: false,
          })
        }
      },

      createOperation: async (operationData) => {
        set({ isLoading: true, lastError: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newOperation: Operation = {
            ...operationData,
            id: `op_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "current_user", // Replace with actual user ID
          }

          set((state) => ({
            operations: [...state.operations, newOperation],
            isLoading: false,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to create operation",
            isLoading: false,
          })
        }
      },

      updateOperation: async (id, updates) => {
        set({ lastError: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            operations: state.operations.map((op) =>
              op.id === id ? { ...op, ...updates, updatedAt: new Date().toISOString() } : op,
            ),
            selectedOperation:
              state.selectedOperation?.id === id
                ? { ...state.selectedOperation, ...updates, updatedAt: new Date().toISOString() }
                : state.selectedOperation,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to update operation",
          })
        }
      },

      deleteOperation: async (id) => {
        set({ lastError: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            operations: state.operations.filter((op) => op.id !== id),
            selectedOperation: state.selectedOperation?.id === id ? null : state.selectedOperation,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to delete operation",
          })
        }
      },

      selectOperation: (id) => {
        const operation = get().operations.find((op) => op.id === id)
        set({ selectedOperation: operation || null })
      },

      assignUnit: async (operationId, unitId) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            operations: state.operations.map((op) =>
              op.id === operationId
                ? { ...op, assignedUnits: [...op.assignedUnits, unitId], updatedAt: new Date().toISOString() }
                : op,
            ),
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to assign unit",
          })
        }
      },

      unassignUnit: async (operationId, unitId) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            operations: state.operations.map((op) =>
              op.id === operationId
                ? {
                    ...op,
                    assignedUnits: op.assignedUnits.filter((id) => id !== unitId),
                    updatedAt: new Date().toISOString(),
                  }
                : op,
            ),
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to unassign unit",
          })
        }
      },

      getOperationStats: (operationId) => {
        const operation = get().operations.find((op) => op.id === operationId)
        if (!operation) return null

        // Mock stats - in real implementation, calculate from actual data
        return {
          totalUnits: operation.assignedUnits.length,
          activeUnits: Math.floor(operation.assignedUnits.length * 0.8),
          completedTasks: Math.floor(Math.random() * 10),
          pendingTasks: Math.floor(Math.random() * 5),
        }
      },
    }),
    {
      name: "operations-storage",
      partialize: (state) => ({
        operations: state.operations,
        selectedOperation: state.selectedOperation,
      }),
    },
  ),
)
