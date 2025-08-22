"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: string
  type: "text" | "image" | "file"
  status?: "sent" | "delivered" | "read"
}

interface Conversation {
  id: string
  name: string
  type: "direct" | "group"
  participants: Array<{ id: string; name: string; role: string }>
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}

interface ChatWindowProps {
  conversation: Conversation
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = formatDate(message.timestamp)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(conversation.messages)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{conversation.name}</h3>
        <p className="text-sm text-muted-foreground">
          {conversation.type === "group"
            ? `${conversation.participants.length} participants`
            : conversation.participants.find((p) => p.id !== user?.id)?.role || "Direct Message"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="text-xs">
                {date}
              </Badge>
            </div>

            <div className="space-y-3">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id

                return (
                  <div
                    key={message.id}
                    className={cn("flex items-start space-x-2", isOwnMessage ? "flex-row-reverse space-x-reverse" : "")}
                  >
                    {!isOwnMessage && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {message.senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn("max-w-xs lg:max-w-md", isOwnMessage ? "items-end" : "items-start")}>
                      {!isOwnMessage && <p className="text-xs text-muted-foreground mb-1">{message.senderName}</p>}

                      <Card className={cn(isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <CardContent className="p-3">
                          <p className="text-sm">{message.content}</p>
                        </CardContent>
                      </Card>

                      <div
                        className={cn(
                          "flex items-center space-x-1 mt-1 text-xs text-muted-foreground",
                          isOwnMessage ? "justify-end" : "justify-start",
                        )}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwnMessage && message.status && <span className="capitalize">• {message.status}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {conversation.messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
