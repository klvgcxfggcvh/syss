import { create } from "zustand"
import { persist } from "zustand/middleware"

type CalendarType = "gregorian" | "ethiopic"

interface CalendarState {
  calendarType: CalendarType
  setCalendarType: (type: CalendarType) => void
  formatDate: (date: Date) => string
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      calendarType: "gregorian",

      setCalendarType: (type: CalendarType) => {
        set({ calendarType: type })
      },

      formatDate: (date: Date) => {
        const { calendarType } = get()

        if (calendarType === "ethiopic") {
          // Simplified Ethiopian calendar conversion
          // In a real implementation, you'd use a proper Ethiopian calendar library
          const ethiopianYear = date.getFullYear() - 7
          return `${ethiopianYear}/${date.getMonth() + 1}/${date.getDate()} (ET)`
        }

        return date.toLocaleDateString("en-US")
      },
    }),
    {
      name: "calendar-storage",
    },
  ),
)
