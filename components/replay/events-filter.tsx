"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, X, MapPin, MessageSquare, FileText, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { useReplayStore } from "@/store/replay-store"

export function EventsFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])

  const { replayData, selectedEvents, setSelectedEvents } = useReplayStore()

  const eventTypes = [
    { id: "movement", label: "Movement", icon: MapPin, color: "bg-blue-500" },
    { id: "message", label: "Messages", icon: MessageSquare, color: "bg-green-500" },
    { id: "report", label: "Reports", icon: FileText, color: "bg-purple-500" },
    { id: "task", label: "Tasks", icon: CheckCircle, color: "bg-orange-500" },
    { id: "contact", label: "Contacts", icon: AlertTriangle, color: "bg-red-500" },
    { id: "personnel", label: "Personnel", icon: Users, color: "bg-yellow-500" },
  ]

  const units = [
    "2nd Battalion",
    "Alpha Company",
    "Bravo Company",
    "Charlie Company",
    "1st Platoon",
    "2nd Platoon",
    "3rd Platoon",
  ]

  const filteredEvents = (replayData.events || []).filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type)
    const matchesUnit = selectedUnits.length === 0 || selectedUnits.includes(event.unit)

    return matchesSearch && matchesType && matchesUnit
  })

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleUnitToggle = (unit: string) => {
    setSelectedUnits((prev) => (prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]))
  }

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedUnits([])
  }

  const selectAllVisible = () => {
    const visibleEventIds = filteredEvents.map((event) => event.id)
    setSelectedEvents(visibleEventIds)
  }

  const clearSelection = () => {
    setSelectedEvents([])
  }

  return (
    <div className="h-full p-4 space-y-4">
      {/* Search and Actions */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={selectAllVisible}>
              Select All ({filteredEvents.length})
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedTypes.length > 0 || selectedUnits.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => handleTypeToggle(type)}>
                {eventTypes.find((t) => t.id === type)?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedUnits.map((unit) => (
              <Badge key={unit} variant="secondary" className="cursor-pointer" onClick={() => handleUnitToggle(unit)}>
                {unit}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Filters */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Event Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventTypes.map((type) => {
                const Icon = type.icon
                const count = (replayData.events || []).filter((e) => e.type === type.id).length

                return (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={() => handleTypeToggle(type.id)}
                    />
                    <Label htmlFor={type.id} className="flex items-center space-x-2 cursor-pointer flex-1">
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${type.color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{type.label}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {count}
                      </Badge>
                    </Label>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Units
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {units.map((unit) => {
                const count = (replayData.events || []).filter((e) => e.unit === unit).length

                return (
                  <div key={unit} className="flex items-center space-x-2">
                    <Checkbox
                      id={unit}
                      checked={selectedUnits.includes(unit)}
                      onCheckedChange={() => handleUnitToggle(unit)}
                    />
                    <Label htmlFor={unit} className="flex items-center justify-between cursor-pointer flex-1">
                      <span className="text-sm">{unit}</span>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </Label>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleEventToggle(event.id)}
                  >
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleEventToggle(event.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {event.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No events match the current filters
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
