import { create } from "zustand"

interface Location {
  name: string
  coordinates: { lat: number; lng: number }
}

interface Report {
  id: string
  title: string
  type: "sitrep" | "conrep" | "intsum"
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW"
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "ARCHIVED"
  content: string
  author: string
  authorId: string
  location?: Location
  createdAt: string
  updatedAt: string
}

interface ReportsStore {
  reports: Report[]
  selectedReport: Report | null
  loading: boolean
  error: string | null

  // Actions
  fetchReports: () => Promise<void>
  createReport: (report: Omit<Report, "id">) => Promise<void>
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  selectReport: (report: Report | null) => void
}

// Mock data
const mockReports: Report[] = [
  {
    id: "1",
    title: "Daily SITREP - Northern Sector",
    type: "sitrep",
    priority: "HIGH",
    status: "SUBMITTED",
    content: `SITUATION:
- Current Status: All units operational
- Enemy Activity: Light reconnaissance observed
- Friendly Forces: 2nd Battalion maintaining positions

MISSION:
- Current Mission: Secure northern approach
- Progress: 75% complete

EXECUTION:
- Actions Taken: Established checkpoints
- Next Steps: Patrol schedule adjustment

LOGISTICS:
- Supply Status: Adequate for 72 hours
- Personnel Status: 95% strength

COMMAND:
- Current Location: FOB Alpha
- Communications: All nets operational`,
    author: "Major Smith",
    authorId: "user1",
    location: {
      name: "Northern Sector",
      coordinates: { lat: 9.032, lng: 38.7469 },
    },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    title: "Contact Report - Suspicious Activity",
    type: "conrep",
    priority: "URGENT",
    status: "REVIEWED",
    content: `CONTACT DETAILS:
- Date/Time: 15 Jan 2024, 1430 hrs
- Location: Grid 123456
- Grid Reference: 38.7469°N, 9.0320°E

ENEMY/CONTACT:
- Type: Civilian vehicle
- Size: 3 individuals
- Activity: Photography of checkpoint
- Equipment: Camera, mobile phones

ACTION TAKEN:
- Response: Vehicle stopped and searched
- Outcome: Individuals questioned and released

ASSESSMENT:
- Threat Level: LOW
- Recommendations: Increase surveillance`,
    author: "Sergeant Johnson",
    authorId: "user2",
    location: {
      name: "Checkpoint Bravo",
      coordinates: { lat: 9.025, lng: 38.75 },
    },
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T15:00:00Z",
  },
]

export const useReportsStore = create<ReportsStore>((set, get) => ({
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,

  fetchReports: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({ reports: mockReports, loading: false })
    } catch (error) {
      set({ error: "Failed to fetch reports", loading: false })
    }
  },

  createReport: async (reportData) => {
    set({ loading: true, error: null })
    try {
      const newReport: Report = {
        ...reportData,
        id: Date.now().toString(),
      }

      set((state) => ({
        reports: [newReport, ...state.reports],
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to create report", loading: false })
    }
  },

  updateReport: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      set((state) => ({
        reports: state.reports.map((report) => (report.id === id ? { ...report, ...updates } : report)),
        selectedReport:
          state.selectedReport?.id === id ? { ...state.selectedReport, ...updates } : state.selectedReport,
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to update report", loading: false })
    }
  },

  deleteReport: async (id) => {
    set({ loading: true, error: null })
    try {
      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
        selectedReport: state.selectedReport?.id === id ? null : state.selectedReport,
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to delete report", loading: false })
    }
  },

  selectReport: (report) => {
    set({ selectedReport: report })
  },
}))
