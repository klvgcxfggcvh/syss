import { create } from "zustand"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: string
  type: "text" | "image" | "file"
  status?: "sent" | "delivered" | "read"
}

interface Participant {
  id: string
  name: string
  role: string
}

interface Conversation {
  id: string
  name: string
  type: "direct" | "group"
  participants: Participant[]
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}

interface Contact {
  id: string
  name: string
  role: string
  unit: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen?: string
}

interface MessagingStore {
  conversations: Conversation[]
  activeConversation: Conversation | null
  contacts: Contact[]
  unreadCount: number
  loading: boolean
  error: string | null

  // Actions
  fetchConversations: () => Promise<void>
  fetchContacts: () => Promise<void>
  sendMessage: (conversationId: string, message: Omit<Message, "id">) => Promise<void>
  setActiveConversation: (conversation: Conversation | null) => void
  startConversation: (params: { type: "direct" | "group"; participants: Participant[] }) => void
  markAsRead: (conversationId: string) => void
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: "user1",
    name: "Major Smith",
    role: "Battalion Commander",
    unit: "2nd Battalion",
    status: "online",
  },
  {
    id: "user2",
    name: "Captain Johnson",
    role: "Company Commander",
    unit: "Alpha Company",
    status: "away",
  },
  {
    id: "user3",
    name: "Lieutenant Brown",
    role: "Platoon Leader",
    unit: "1st Platoon",
    status: "online",
  },
  {
    id: "user4",
    name: "Sergeant Davis",
    role: "Squad Leader",
    unit: "3rd Squad",
    status: "busy",
  },
]

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Command Staff",
    type: "group",
    participants: [
      { id: "user1", name: "Major Smith", role: "Battalion Commander" },
      { id: "user2", name: "Captain Johnson", role: "Company Commander" },
      { id: "user3", name: "Lieutenant Brown", role: "Platoon Leader" },
    ],
    messages: [
      {
        id: "1",
        content: "Morning briefing at 0800 hours",
        senderId: "user1",
        senderName: "Major Smith",
        timestamp: "2024-01-15T07:30:00Z",
        type: "text",
        status: "read",
      },
      {
        id: "2",
        content: "Roger that, sir. Alpha Company ready.",
        senderId: "user2",
        senderName: "Captain Johnson",
        timestamp: "2024-01-15T07:32:00Z",
        type: "text",
        status: "read",
      },
    ],
    lastMessage: {
      id: "2",
      content: "Roger that, sir. Alpha Company ready.",
      senderId: "user2",
      senderName: "Captain Johnson",
      timestamp: "2024-01-15T07:32:00Z",
      type: "text",
      status: "read",
    },
    unreadCount: 0,
  },
  {
    id: "2",
    name: "Captain Johnson",
    type: "direct",
    participants: [
      { id: "current-user", name: "Current User", role: "HQ" },
      { id: "user2", name: "Captain Johnson", role: "Company Commander" },
    ],
    messages: [
      {
        id: "3",
        content: "Need status update on patrol routes",
        senderId: "current-user",
        senderName: "Current User",
        timestamp: "2024-01-15T09:15:00Z",
        type: "text",
        status: "delivered",
      },
      {
        id: "4",
        content: "Working on it now, will have report in 30 minutes",
        senderId: "user2",
        senderName: "Captain Johnson",
        timestamp: "2024-01-15T09:18:00Z",
        type: "text",
        status: "read",
      },
    ],
    lastMessage: {
      id: "4",
      content: "Working on it now, will have report in 30 minutes",
      senderId: "user2",
      senderName: "Captain Johnson",
      timestamp: "2024-01-15T09:18:00Z",
      type: "text",
      status: "read",
    },
    unreadCount: 1,
  },
]

export const useMessagingStore = create<MessagingStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  contacts: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchConversations: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
      set({
        conversations: mockConversations,
        unreadCount: totalUnread,
        loading: false,
      })
    } catch (error) {
      set({ error: "Failed to fetch conversations", loading: false })
    }
  },

  fetchContacts: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      set({ contacts: mockContacts, loading: false })
    } catch (error) {
      set({ error: "Failed to fetch contacts", loading: false })
    }
  },

  sendMessage: async (conversationId, messageData) => {
    try {
      const newMessage: Message = {
        ...messageData,
        id: Date.now().toString(),
        status: "sent",
      }

      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: newMessage,
              }
            : conv,
        ),
        activeConversation:
          state.activeConversation?.id === conversationId
            ? {
                ...state.activeConversation,
                messages: [...state.activeConversation.messages, newMessage],
                lastMessage: newMessage,
              }
            : state.activeConversation,
      }))

      // Simulate message delivery
      setTimeout(() => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
                  ),
                }
              : conv,
          ),
          activeConversation:
            state.activeConversation?.id === conversationId
              ? {
                  ...state.activeConversation,
                  messages: state.activeConversation.messages.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
                  ),
                }
              : state.activeConversation,
        }))
      }, 1000)
    } catch (error) {
      set({ error: "Failed to send message" })
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation })
    if (conversation && conversation.unreadCount > 0) {
      // Mark as read
      get().markAsRead(conversation.id)
    }
  },

  startConversation: (params) => {
    const existingConv = get().conversations.find(
      (conv) =>
        conv.type === params.type &&
        conv.participants.length === params.participants.length &&
        conv.participants.every((p) => params.participants.some((pp) => pp.id === p.id)),
    )

    if (existingConv) {
      set({ activeConversation: existingConv })
      return
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name:
        params.type === "direct"
          ? params.participants.find((p) => p.id !== "current-user")?.name || "Direct Message"
          : "New Group",
      type: params.type,
      participants: params.participants,
      messages: [],
      unreadCount: 0,
    }

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversation: newConversation,
    }))
  },

  markAsRead: (conversationId) => {
    set((state) => {
      const conversation = state.conversations.find((c) => c.id === conversationId)
      const unreadReduction = conversation?.unreadCount || 0

      return {
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
        unreadCount: Math.max(0, state.unreadCount - unreadReduction),
      }
    })
  },
}))
