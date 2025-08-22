import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  username: string
  role: "HQ" | "UNIT" | "OBSERVER"
  permissions: string[]
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  initialize: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

// Mock user database
const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin",
    user: {
      id: "1",
      name: "HQ Commander",
      username: "admin",
      role: "HQ",
      permissions: ["read", "write", "assign_tasks", "manage_operations"],
    },
  },
  unit1: {
    password: "unit1",
    user: {
      id: "2",
      name: "Unit Alpha Leader",
      username: "unit1",
      role: "UNIT",
      permissions: ["read", "write", "update_tasks"],
    },
  },
  obs1: {
    password: "obs1",
    user: {
      id: "3",
      name: "Observer One",
      username: "obs1",
      role: "OBSERVER",
      permissions: ["read"],
    },
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      initialize: async () => {
        // Simulate checking stored auth state
        const state = get()
        if (state.token && state.user) {
          set({ isAuthenticated: true })
        }
      },

      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockUser = mockUsers[username]
        if (mockUser && mockUser.password === password) {
          const token = `mock-token-${Date.now()}`
          set({
            isAuthenticated: true,
            user: mockUser.user,
            token,
          })
        } else {
          throw new Error("Invalid credentials")
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
