import { create } from "zustand"
import { persist } from "zustand/middleware"

type Language = "en" | "am"

interface Translations {
  [key: string]: {
    en: string
    am: string
  }
}

const translations: Translations = {
  "common.loading": {
    en: "Loading...",
    am: "በመጫን ላይ...",
  },
  "common.save": {
    en: "Save",
    am: "አስቀምጥ",
  },
  "common.cancel": {
    en: "Cancel",
    am: "ሰርዝ",
  },
  "nav.map": {
    en: "Map View",
    am: "ካርታ እይታ",
  },
  "nav.operations": {
    en: "Operations",
    am: "ስራዎች",
  },
  "nav.tasking": {
    en: "Tasking",
    am: "ተግባር ሰጪ",
  },
  "nav.reports": {
    en: "Reports",
    am: "ሪፖርቶች",
  },
  "nav.messaging": {
    en: "Messages",
    am: "መልዕክቶች",
  },
  "nav.replay": {
    en: "Replay & AAR",
    am: "እንደገና ማጫወት እና ግምገማ",
  },
}

interface I18nState {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: "en",

      setLanguage: (language: Language) => {
        set({ language })
      },

      t: (key: string) => {
        const { language } = get()
        return translations[key]?.[language] || key
      },
    }),
    {
      name: "i18n-storage",
    },
  ),
)
