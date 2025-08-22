"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, Clock, Users, Edit, Save, X, AlertTriangle } from "lucide-react"
import type { Operation } from "@/store/operations-store"
import { useOperationsStore } from "@/store/operations-store"
import { useCalendarStore } from "@/store/calendar-store"
import { useAuthStore } from "@/store/auth-store"

interface OperationDetailsProps {
  operation: Operation
}

export function OperationDetails({ operation }: OperationDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(operation.description)

  const { updateOperation } = useOperationsStore()
  const { formatDate } = useCalendarStore()
  const { user } = useAuthStore()

  const canEdit = user?.permissions.includes("manage_operations")

  const handleSave = async () => {
    await updateOperation(operation.id, { description: editedDescription })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedDescription(operation.description)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "planning":
        return "outline"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto">
      {/* Operation Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{operation.name}</CardTitle>
              <div className="flex items-center space-x-4">
                <Badge variant={getStatusColor(operation.status)} className="flex items-center space-x-1">
                  {operation.status === "suspended" && <AlertTriangle className="h-3 w-3" />}
                  <span className="capitalize">{operation.status}</span>
                </Badge>
                <Badge variant={getPriorityColor(operation.priority)}>Priority: {operation.priority}</Badge>
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Operation
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location:</span>
                <span>{operation.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Start Date:</span>
                <span>{formatDate(new Date(operation.startDate))}</span>
              </div>
              {operation.endDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">End Date:</span>
                  <span>{formatDate(new Date(operation.endDate))}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4" />
                <span className="font-medium">Assigned Units:</span>
                <span>{operation.assignedUnits.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(new Date(operation.createdAt))}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Description</h3>
              {canEdit && !isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter operation description..."
                />
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{operation.description || "No description provided."}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Area of Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Area of Interest (AOI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {operation.aoi ? (
            <div className="space-y-2">
              <p className="text-sm">AOI coordinates defined</p>
              <Button variant="outline" size="sm">
                View on Map
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No AOI defined for this operation</p>
              {canEdit && (
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Define AOI
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Units Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Assigned Units ({operation.assignedUnits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {operation.assignedUnits.length > 0 ? (
            <div className="space-y-2">
              {operation.assignedUnits.slice(0, 5).map((unitId) => (
                <div key={unitId} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-medium">Unit {unitId}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
              {operation.assignedUnits.length > 5 && (
                <p className="text-sm text-muted-foreground">And {operation.assignedUnits.length - 5} more units...</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                View All Units
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No units assigned to this operation</p>
              {canEdit && (
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Units
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
