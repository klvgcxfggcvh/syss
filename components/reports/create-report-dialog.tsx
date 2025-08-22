"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, User } from "lucide-react"
import { useReportsStore } from "@/store/reports-store"
import { useAuthStore } from "@/store/auth-store"

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReportDialog({ open, onOpenChange }: CreateReportDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    priority: "",
    content: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
  })

  const { createReport } = useReportsStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await createReport({
      ...formData,
      author: user?.name || "Unknown",
      authorId: user?.id || "",
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: formData.location
        ? {
            name: formData.location,
            coordinates: formData.coordinates,
          }
        : undefined,
    })

    setFormData({
      title: "",
      type: "",
      priority: "",
      content: "",
      location: "",
      coordinates: { lat: 0, lng: 0 },
    })

    onOpenChange(false)
  }

  const reportTemplates = {
    sitrep: {
      title: "Situation Report - [Date/Time]",
      content: `SITUATION:
- Current Status:
- Enemy Activity:
- Friendly Forces:

MISSION:
- Current Mission:
- Progress:

EXECUTION:
- Actions Taken:
- Next Steps:

LOGISTICS:
- Supply Status:
- Personnel Status:

COMMAND:
- Current Location:
- Communications:`,
    },
    conrep: {
      title: "Contact Report - [Location]",
      content: `CONTACT DETAILS:
- Date/Time:
- Location:
- Grid Reference:

ENEMY/CONTACT:
- Type:
- Size:
- Activity:
- Equipment:

ACTION TAKEN:
- Response:
- Outcome:

ASSESSMENT:
- Threat Level:
- Recommendations:`,
    },
    intsum: {
      title: "Intelligence Summary - [Date]",
      content: `INTELLIGENCE SUMMARY:
- Period Covered:
- Area of Interest:

KEY DEVELOPMENTS:
- Enemy Activity:
- Significant Events:

ANALYSIS:
- Threat Assessment:
- Pattern Analysis:

RECOMMENDATIONS:
- Immediate Actions:
- Future Considerations:`,
    },
  }

  const handleTemplateSelect = (type: string) => {
    const template = reportTemplates[type as keyof typeof reportTemplates]
    if (template) {
      setFormData((prev) => ({
        ...prev,
        type,
        title: template.title,
        content: template.content,
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, type: value }))
                  handleTemplateSelect(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sitrep">SITREP (Situation Report)</SelectItem>
                  <SelectItem value="conrep">CONREP (Contact Report)</SelectItem>
                  <SelectItem value="intsum">INTSUM (Intelligence Summary)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URGENT">URGENT</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter report title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Report Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter report content"
              rows={12}
              required
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Author: {user?.name || "Unknown"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Date: {new Date().toLocaleDateString()}
              </div>
              {formData.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location: {formData.location}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
