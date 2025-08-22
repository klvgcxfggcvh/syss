"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MessageSquare, Phone, Video } from "lucide-react"
import { useMessagingStore } from "@/store/messaging-store"
import { useAuthStore } from "@/store/auth-store"

export function ContactsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { contacts, fetchContacts, startConversation } = useMessagingStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.unit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleStartChat = (contact: any) => {
    startConversation({
      type: "direct",
      participants: [
        { id: user?.id || "", name: user?.name || "", role: user?.role || "" },
        { id: contact.id, name: contact.name, role: contact.role },
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(contact.status)}`}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    <p className="text-xs text-muted-foreground">{contact.unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleStartChat(contact)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {contact.status.toUpperCase()}
                </Badge>
                {contact.lastSeen && (
                  <span className="text-xs text-muted-foreground">
                    Last seen: {new Date(contact.lastSeen).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No contacts found</div>
        )}
      </div>
    </div>
  )
}
