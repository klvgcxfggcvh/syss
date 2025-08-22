"use client"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, MessageSquare, FileText, Users, AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react"
import { useReplayStore } from "@/store/replay-store"
import { cn } from "@/lib/utils"

export function TimelineView() {
  const { replayData, currentTime, selectedEvents, setCurrentTime } = useReplayStore()
  const timelineRef = useRef<HTMLDivElement>(null)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "movement":
        return <MapPin className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      case "task":
        return <CheckCircle className="h-4 w-4" />
      case "contact":
        return <AlertTriangle className="h-4 w-4" />
      case "personnel":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "movement":
        return "bg-blue-500"
      case "message":
        return "bg-green-500"
      case "report":
        return "bg-purple-500"
      case "task":
        return "bg-orange-500"
      case "contact":
        return "bg-red-500"
      case "personnel":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const groupEventsByDate = (events: any[]) => {
    const groups: { [key: string]: any[] } = {}

    events.forEach((event) => {
      const date = formatDate(event.timestamp)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(event)
    })

    return groups
  }

  const eventGroups = groupEventsByDate(replayData.events || [])

  const handleEventClick = (event: any) => {
    setCurrentTime(event.timestamp)
  }

  const isEventActive = (eventTime: number) => {
    return Math.abs(eventTime - currentTime) < 60000 // Within 1 minute
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Event Timeline</h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter Events
        </Button>
      </div>

      <ScrollArea className="h-full" ref={timelineRef}>
        <div className="space-y-6">
          {Object.entries(eventGroups).map(([date, events]) => (
            <div key={date}>
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="text-sm">
                  {date}
                </Badge>
                <div className="flex-1 h-px bg-border ml-4" />
              </div>

              <div className="space-y-3 ml-4">
                {events.map((event, index) => (
                  <Card
                    key={`${event.id}-${index}`}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      isEventActive(event.timestamp) && "ring-2 ring-primary shadow-lg",
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white",
                            getEventColor(event.type),
                          )}
                        >
                          {getEventIcon(event.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">{event.title}</h4>
                            <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {event.type.toUpperCase()}
                              </Badge>
                              {event.unit && (
                                <Badge variant="secondary" className="text-xs">
                                  {event.unit}
                                </Badge>
                              )}
                            </div>

                            {event.location && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(eventGroups).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No events found for the selected time range</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
