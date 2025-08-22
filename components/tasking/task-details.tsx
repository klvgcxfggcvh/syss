"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Edit,
  Save,
  X,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import type { Task } from "@/store/tasks-store"
import { useTasksStore } from "@/store/tasks-store"
import { useCalendarStore } from "@/store/calendar-store"
import { useAuthStore } from "@/store/auth-store"

interface TaskDetailsProps {
  task: Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [progressUpdate, setProgressUpdate] = useState(task.progress || 0)
  const [statusUpdate, setStatusUpdate] = useState("")

  const { updateTask, updateTaskStatus, addTaskUpdate } = useTasksStore()
  const { formatDate } = useCalendarStore()
  const { user } = useAuthStore()

  const canEdit = user?.permissions.includes("assign_tasks")
  const canUpdate = user?.permissions.includes("update_tasks") || user?.id === task.assignedTo

  const handleSave = async () => {
    await updateTask(task.id, { description: editedDescription })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedDescription(task.description)
    setIsEditing(false)
  }

  const handleStatusUpdate = async (newStatus: Task["status"]) => {
    await updateTaskStatus(task.id, newStatus)
  }

  const handleProgressUpdate = async () => {
    await updateTask(task.id, { progress: progressUpdate })
  }

  const handleAddUpdate = async () => {
    if (statusUpdate.trim()) {
      await addTaskUpdate(task.id, statusUpdate.trim())
      setStatusUpdate("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "outline"
      case "in_progress":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "overdue":
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <Play className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Pause className="h-4 w-4" />
    }
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto">
      {/* Task Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex items-center space-x-4">
                <Badge variant={getStatusColor(task.status)} className="flex items-center space-x-1">
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status.replace("_", " ")}</span>
                </Badge>
                <Badge variant={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">Assigned To:</span>
                <span>{task.assignedTo}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Due Date:</span>
                <span>{formatDate(new Date(task.dueDate))}</span>
              </div>
              {task.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location:</span>
                  <span>{task.location.name}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(new Date(task.createdAt))}</span>
              </div>
              {task.startedAt && (
                <div className="flex items-center space-x-2 text-sm">
                  <Play className="h-4 w-4" />
                  <span className="font-medium">Started:</span>
                  <span>{formatDate(new Date(task.startedAt))}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Completed:</span>
                  <span>{formatDate(new Date(task.completedAt))}</span>
                </div>
              )}
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
                  placeholder="Enter task description..."
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
              <p className="text-sm text-muted-foreground">{task.description || "No description provided."}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress & Status Updates */}
      {canUpdate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress & Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            {task.status === "in_progress" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Progress</Label>
                  <span className="text-sm text-muted-foreground">{progressUpdate}%</span>
                </div>
                <Progress value={progressUpdate} className="h-3" />
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={progressUpdate}
                    onChange={(e) => setProgressUpdate(Number.parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Button size="sm" onClick={handleProgressUpdate}>
                    Update
                  </Button>
                </div>
              </div>
            )}

            {/* Status Actions */}
            <div className="flex items-center space-x-2">
              {task.status === "assigned" && (
                <Button onClick={() => handleStatusUpdate("in_progress")}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Task
                </Button>
              )}
              {task.status === "in_progress" && (
                <>
                  <Button onClick={() => handleStatusUpdate("completed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Task
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusUpdate("assigned")}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Task
                  </Button>
                </>
              )}
            </div>

            <Separator />

            {/* Add Status Update */}
            <div className="space-y-2">
              <Label>Add Status Update</Label>
              <div className="flex space-x-2">
                <Textarea
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  placeholder="Provide status update..."
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={handleAddUpdate} disabled={!statusUpdate.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location */}
      {task.location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Task Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{task.location.name}</p>
              <p className="text-sm text-muted-foreground">
                Coordinates: {task.location.coordinates[1].toFixed(6)}, {task.location.coordinates[0].toFixed(6)}
              </p>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Show on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Updates History */}
      {task.updates && task.updates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Status Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.updates.map((update, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{update.message}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>By: {update.author}</span>
                    <span>{formatDate(new Date(update.timestamp))}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
