"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { useTasksStore } from "@/store/tasks-store"
import { useUnitsStore } from "@/store/units-store"
import { useDataStore } from "@/store/data-store"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    hasLocation: false,
    locationName: "",
    coordinates: [0, 0] as [number, number],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createTask } = useTasksStore()
  const { units } = useUnitsStore()
  const { currentOperationId } = useDataStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOperationId) return

    setIsSubmitting(true)

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        operationId: currentOperationId,
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        status: "assigned",
        dueDate: formData.dueDate.toISOString(),
        location: formData.hasLocation
          ? {
              name: formData.locationName,
              coordinates: formData.coordinates,
            }
          : undefined,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        hasLocation: false,
        locationName: "",
        coordinates: [0, 0],
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Secure checkpoint Alpha"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed task instructions and objectives..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned To *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.callSign})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.dueDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasLocation"
                checked={formData.hasLocation}
                onCheckedChange={(checked) => setFormData({ ...formData, hasLocation: checked })}
              />
              <Label htmlFor="hasLocation" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Add Location</span>
              </Label>
            </div>

            {formData.hasLocation && (
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input
                    id="locationName"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    placeholder="Checkpoint Alpha"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.coordinates[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: [Number.parseFloat(e.target.value) || 0, formData.coordinates[1]],
                        })
                      }
                      placeholder="38.7525"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.coordinates[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: [formData.coordinates[0], Number.parseFloat(e.target.value) || 0],
                        })
                      }
                      placeholder="9.0192"
                    />
                  </div>
                </div>

                <Button type="button" variant="outline" size="sm" className="w-full bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Select on Map
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
