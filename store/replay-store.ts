import { create } from "zustand"

interface ReplayEvent {
  id: string
  timestamp: number
  type: "movement" | "message" | "report" | "task" | "contact" | "personnel"
  title: string
  description: string
  unit?: string
  location?: string
  data?: any
}

interface ReplayData {
  events: ReplayEvent[]
  units: any[]
  messages: any[]
  reports: any[]
  tasks: any[]
}

interface AARData {
  timeRange: { start: number; end: number }
  metrics: {
    unitsInvolved: number
    tasksCompleted: number
    incidents: number
  }
  summary: {
    objective: string
    outcome: string
    success: boolean
    keyEvents: string[]
  }
  timeline: {
    phases: Array<{
      name: string
      description: string
      startTime: number
      endTime: number
      duration: number
    }>
  }
  performance: {
    positives: string[]
    improvements: string[]
    units: Array<{
      name: string
      role: string
      performance: number
      tasksCompleted: number
      totalTasks: number
    }>
  }
  lessons: Array<{
    title: string
    description: string
    category: string
    priority: "HIGH" | "MEDIUM" | "LOW"
  }>
  recommendations: Array<{
    title: string
    description: string
    priority: "HIGH" | "MEDIUM" | "LOW"
    responsible: string
    dueDate: string
  }>
}

interface ReplayStore {
  // Playback state
  isPlaying: boolean
  currentTime: number
  startTime: number
  endTime: number
  playbackSpeed: number

  // Data
  replayData: ReplayData
  selectedEvents: string[]

  // Loading state
  loading: boolean
  error: string | null

  // Actions
  togglePlayback: () => void
  setCurrentTime: (time: number) => void
  setPlaybackSpeed: (speed: number) => void
  setTimeRange: (start: number, end: number) => void
  setSelectedEvents: (events: string[]) => void
  fetchReplayData: () => Promise<void>
  generateAAR: (eventIds: string[]) => Promise<AARData>
}

// Mock data
const mockEvents: ReplayEvent[] = [
  {
    id: "1",
    timestamp: Date.now() - 7200000, // 2 hours ago
    type: "movement",
    title: "Unit Movement - Alpha Company",
    description: "Alpha Company moved from FOB Alpha to Checkpoint Bravo",
    unit: "Alpha Company",
    location: "Checkpoint Bravo",
  },
  {
    id: "2",
    timestamp: Date.now() - 6600000, // 1h 50m ago
    type: "message",
    title: "Communication - Status Update",
    description: "Alpha Company reported arrival at checkpoint",
    unit: "Alpha Company",
  },
  {
    id: "3",
    timestamp: Date.now() - 5400000, // 1h 30m ago
    type: "contact",
    title: "Enemy Contact - Suspicious Activity",
    description: "Suspicious vehicle observed near checkpoint",
    unit: "Alpha Company",
    location: "Checkpoint Bravo",
  },
  {
    id: "4",
    timestamp: Date.now() - 4800000, // 1h 20m ago
    type: "report",
    title: "SITREP - Northern Sector",
    description: "Situation report submitted by Alpha Company",
    unit: "Alpha Company",
  },
  {
    id: "5",
    timestamp: Date.now() - 3600000, // 1 hour ago
    type: "task",
    title: "Task Completion - Patrol Route",
    description: "Patrol route Alpha-1 completed successfully",
    unit: "1st Platoon",
  },
  {
    id: "6",
    timestamp: Date.now() - 1800000, // 30 minutes ago
    type: "personnel",
    title: "Personnel Update - Medical Evacuation",
    description: "Medical evacuation requested for injured personnel",
    unit: "Bravo Company",
    location: "Grid 123456",
  },
]

const mockReplayData: ReplayData = {
  events: mockEvents,
  units: [],
  messages: [],
  reports: [],
  tasks: [],
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
  // Initial state
  isPlaying: false,
  currentTime: Date.now() - 7200000, // Start 2 hours ago
  startTime: Date.now() - 7200000,
  endTime: Date.now(),
  playbackSpeed: 1,
  replayData: { events: [], units: [], messages: [], reports: [], tasks: [] },
  selectedEvents: [],
  loading: false,
  error: null,

  togglePlayback: () => {
    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  setCurrentTime: (time) => {
    set({ currentTime: time })
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed })
  },

  setTimeRange: (start, end) => {
    set({ startTime: start, endTime: end, currentTime: start })
  },

  setSelectedEvents: (events) => {
    set({ selectedEvents: events })
  },

  fetchReplayData: async () => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({
        replayData: mockReplayData,
        loading: false,
      })
    } catch (error) {
      set({ error: "Failed to fetch replay data", loading: false })
    }
  },

  generateAAR: async (eventIds) => {
    const { replayData } = get()
    const selectedEventData = replayData.events.filter((e) => eventIds.includes(e.id))

    // Simulate AAR generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aarData: AARData = {
      timeRange: {
        start: Math.min(...selectedEventData.map((e) => e.timestamp)),
        end: Math.max(...selectedEventData.map((e) => e.timestamp)),
      },
      metrics: {
        unitsInvolved: new Set(selectedEventData.map((e) => e.unit).filter(Boolean)).size,
        tasksCompleted: selectedEventData.filter((e) => e.type === "task").length,
        incidents: selectedEventData.filter((e) => e.type === "contact").length,
      },
      summary: {
        objective: "Secure northern sector and maintain checkpoint operations",
        outcome: "Mission completed with minor incidents. All objectives achieved.",
        success: true,
        keyEvents: [
          "Alpha Company successfully deployed to Checkpoint Bravo",
          "Suspicious activity detected and investigated",
          "All patrol routes completed on schedule",
          "Medical evacuation conducted efficiently",
        ],
      },
      timeline: {
        phases: [
          {
            name: "Deployment Phase",
            description: "Initial unit movement and positioning",
            startTime: Date.now() - 7200000,
            endTime: Date.now() - 6000000,
            duration: 1200000,
          },
          {
            name: "Operations Phase",
            description: "Active patrol and checkpoint operations",
            startTime: Date.now() - 6000000,
            endTime: Date.now() - 2400000,
            duration: 3600000,
          },
          {
            name: "Incident Response",
            description: "Response to suspicious activity and medical emergency",
            startTime: Date.now() - 2400000,
            endTime: Date.now(),
            duration: 2400000,
          },
        ],
      },
      performance: {
        positives: [
          "Rapid deployment and positioning of units",
          "Effective communication throughout operation",
          "Quick response to suspicious activity",
          "Efficient medical evacuation procedures",
        ],
        improvements: [
          "Earlier detection of suspicious activity needed",
          "Communication delays during incident response",
          "Medical supplies inventory management",
        ],
        units: [
          {
            name: "Alpha Company",
            role: "Primary Operations",
            performance: 85,
            tasksCompleted: 4,
            totalTasks: 5,
          },
          {
            name: "Bravo Company",
            role: "Support Operations",
            performance: 78,
            tasksCompleted: 2,
            totalTasks: 3,
          },
          {
            name: "1st Platoon",
            role: "Patrol Operations",
            performance: 92,
            tasksCompleted: 3,
            totalTasks: 3,
          },
        ],
      },
      lessons: [
        {
          title: "Early Warning Systems",
          description: "Need for improved surveillance and early warning capabilities",
          category: "Intelligence",
          priority: "HIGH",
        },
        {
          title: "Medical Response Coordination",
          description: "Medical evacuation procedures worked well but can be optimized",
          category: "Medical",
          priority: "MEDIUM",
        },
        {
          title: "Communication Protocols",
          description: "Some communication delays observed during high-stress situations",
          category: "Communications",
          priority: "MEDIUM",
        },
      ],
      recommendations: [
        {
          title: "Install Additional Surveillance Equipment",
          description: "Deploy additional cameras and sensors around checkpoint perimeter",
          priority: "HIGH",
          responsible: "Engineering Unit",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Conduct Communication Drills",
          description: "Regular training on communication protocols during emergencies",
          priority: "MEDIUM",
          responsible: "Training Command",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Update Medical Supply Inventory",
          description: "Review and restock medical supplies based on recent usage",
          priority: "MEDIUM",
          responsible: "Medical Unit",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }

    return aarData
  },
}))
