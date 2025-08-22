import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Task {
  id: string
  title: string
  description: string
  operationId: string
  assignedTo: string
  assignedBy: string
  status: "assigned" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high"
  dueDate: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  progress?: number
  location?: {
    name: string
    coordinates: [number, number]
  }
  updates?: Array<{
    message: string
    author: string
    timestamp: string
  }>
}

interface TaskFilters {
  status: string | null
  priority: string | null
  assignedTo: string | null
  operationId: string | null
}

interface TasksState {
  tasks: Task[]
  selectedTask: Task | null
  filters: TaskFilters
  isLoading: boolean
  lastError: string | null

  // Actions
  loadTasks: (operationId: string) => Promise<void>
  createTask: (task: Omit<Task, "id" | "createdAt" | "assignedBy">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  updateTaskStatus: (id: string, status: Task["status"]) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  selectTask: (id: string) => void
  addTaskUpdate: (id: string, message: string) => Promise<void>
  setFilter: (key: keyof TaskFilters, value: string | null) => void
  clearFilters: () => void
  getFilteredTasks: () => Task[]
  getTaskStats: (operationId: string) => {
    total: number
    assigned: number
    inProgress: number
    completed: number
    overdue: number
  }
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTask: null,
      filters: {
        status: null,
        priority: null,
        assignedTo: null,
        operationId: null,
      },
      isLoading: false,
      lastError: null,

      loadTasks: async (operationId) => {
        set({ isLoading: true, lastError: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockTasks: Task[] = [
            {
              id: "task_001",
              title: "Secure Checkpoint Alpha",
              description:
                "Establish and maintain security at checkpoint Alpha. Monitor all vehicle and personnel movement. Report any suspicious activity immediately.",
              operationId: "op_001",
              assignedTo: "unit_alpha",
              assignedBy: "admin",
              status: "in_progress",
              priority: "high",
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              progress: 65,
              location: {
                name: "Checkpoint Alpha",
                coordinates: [38.7525, 9.0192],
              },
              updates: [
                {
                  message: "Checkpoint established, beginning patrol operations",
                  author: "unit_alpha",
                  timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                },
                {
                  message: "First patrol completed, no incidents reported",
                  author: "unit_alpha",
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
              ],
            },
            {
              id: "task_002",
              title: "Patrol Route Bravo",
              description:
                "Conduct regular patrols along designated Route Bravo. Maintain communication every 30 minutes.",
              operationId: "op_001",
              assignedTo: "unit_bravo",
              assignedBy: "admin",
              status: "assigned",
              priority: "medium",
              dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              location: {
                name: "Route Bravo",
                coordinates: [38.7625, 9.0292],
              },
            },
            {
              id: "task_003",
              title: "Supply Convoy Escort",
              description: "Provide security escort for supply convoy from base to forward operating post.",
              operationId: "op_001",
              assignedTo: "unit_charlie",
              assignedBy: "admin",
              status: "completed",
              priority: "high",
              dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 100,
              updates: [
                {
                  message: "Convoy departed on schedule",
                  author: "unit_charlie",
                  timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                  message: "Convoy arrived safely at destination",
                  author: "unit_charlie",
                  timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
              ],
            },
            {
              id: "task_004",
              title: "Equipment Maintenance",
              description: "Perform scheduled maintenance on all vehicles and communication equipment.",
              operationId: "op_001",
              assignedTo: "unit_delta",
              assignedBy: "admin",
              status: "overdue",
              priority: "medium",
              dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "task_005",
              title: "Reconnaissance Mission",
              description: "Conduct reconnaissance of suspected enemy positions in grid square 1234.",
              operationId: "op_002",
              assignedTo: "unit_echo",
              assignedBy: "admin",
              status: "assigned",
              priority: "high",
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              location: {
                name: "Grid Square 1234",
                coordinates: [38.7725, 9.0392],
              },
            },
          ]

          // Filter by operation
          const filteredTasks = mockTasks.filter((task) => task.operationId === operationId)

          set({ tasks: filteredTasks, isLoading: false })
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to load tasks",
            isLoading: false,
          })
        }
      },

      createTask: async (taskData) => {
        set({ isLoading: true, lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newTask: Task = {
            ...taskData,
            id: `task_${Date.now()}`,
            createdAt: new Date().toISOString(),
            assignedBy: "current_user", // Replace with actual user ID
          }

          set((state) => ({
            tasks: [...state.tasks, newTask],
            isLoading: false,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to create task",
            isLoading: false,
          })
        }
      },

      updateTask: async (id, updates) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
            selectedTask: state.selectedTask?.id === id ? { ...state.selectedTask, ...updates } : state.selectedTask,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to update task",
          })
        }
      },

      updateTaskStatus: async (id, status) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          const updates: Partial<Task> = { status }

          if (status === "in_progress" && !get().tasks.find((t) => t.id === id)?.startedAt) {
            updates.startedAt = new Date().toISOString()
          }

          if (status === "completed") {
            updates.completedAt = new Date().toISOString()
            updates.progress = 100
          }

          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
            selectedTask: state.selectedTask?.id === id ? { ...state.selectedTask, ...updates } : state.selectedTask,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to update task status",
          })
        }
      },

      deleteTask: async (id) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to delete task",
          })
        }
      },

      selectTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        set({ selectedTask: task || null })
      },

      addTaskUpdate: async (id, message) => {
        set({ lastError: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          const newUpdate = {
            message,
            author: "current_user", // Replace with actual user
            timestamp: new Date().toISOString(),
          }

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    updates: [...(task.updates || []), newUpdate],
                  }
                : task,
            ),
            selectedTask:
              state.selectedTask?.id === id
                ? {
                    ...state.selectedTask,
                    updates: [...(state.selectedTask.updates || []), newUpdate],
                  }
                : state.selectedTask,
          }))
        } catch (error) {
          set({
            lastError: error instanceof Error ? error.message : "Failed to add task update",
          })
        }
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }))
      },

      clearFilters: () => {
        set({
          filters: {
            status: null,
            priority: null,
            assignedTo: null,
            operationId: null,
          },
        })
      },

      getFilteredTasks: () => {
        const { tasks, filters } = get()
        return tasks.filter((task) => {
          if (filters.status && task.status !== filters.status) return false
          if (filters.priority && task.priority !== filters.priority) return false
          if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false
          if (filters.operationId && task.operationId !== filters.operationId) return false
          return true
        })
      },

      getTaskStats: (operationId) => {
        const tasks = get().tasks.filter((task) => task.operationId === operationId)
        const now = new Date()

        return {
          total: tasks.length,
          assigned: tasks.filter((t) => t.status === "assigned").length,
          inProgress: tasks.filter((t) => t.status === "in_progress").length,
          completed: tasks.filter((t) => t.status === "completed").length,
          overdue: tasks.filter((t) => t.status !== "completed" && new Date(t.dueDate) < now).length,
        }
      },
    }),
    {
      name: "tasks-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        selectedTask: state.selectedTask,
        filters: state.filters,
      }),
    },
  ),
)
