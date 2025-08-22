"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Clock, User, AlertTriangle, CheckCircle, Play, Pause } from "lucide-react"
import type { Task } from "@/store/tasks-store"
import { useTasksStore } from "@/store/tasks-store"
import { useCalendarStore } from "@/store/calendar-store"
import { useAuthStore } from "@/store/auth-store"

interface TasksListProps {
  tasks: Task[]
  selectedId?: string
  onSelect: (id: string) => void
  isLoading: boolean
}

export function TasksList({ tasks, selectedId, onSelect, isLoading }: TasksListProps) {
  const { formatDate } = useCalendarStore()
  const { user } = useAuthStore()
  const { updateTaskStatus } = useTasksStore()

  const canUpdateTasks = user?.permissions.includes("update_tasks") || user?.permissions.includes("assign_tasks")

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
        return <Clock className="h-3 w-3" />
      case "in_progress":
        return <Play className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "overdue":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Pause className="h-3 w-3" />
    }
  }

  const handleStatusUpdate = async (taskId: string, newStatus: Task["status"]) => {
    await updateTaskStatus(taskId, newStatus)
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">No Tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>No tasks have been assigned yet.</p>
            <p className="text-sm mt-2">Create a new task to get started.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedId === task.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect(task.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(new Date(task.dueDate))}</span>
                  </div>
                  {task.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location Set</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge variant={getStatusColor(task.status)} className="flex items-center space-x-1">
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status.replace("_", " ")}</span>
                </Badge>
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {task.priority} priority
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

            {/* Progress Bar */}
            {task.status === "in_progress" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{task.progress || 0}%</span>
                </div>
                <Progress value={task.progress || 0} className="h-2" />
              </div>
            )}

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Created: {formatDate(new Date(task.createdAt))}</span>
              {task.startedAt && <span>Started: {formatDate(new Date(task.startedAt))}</span>}
              {task.completedAt && <span>Completed: {formatDate(new Date(task.completedAt))}</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {task.location && (
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Show on Map
                  </Button>
                )}
              </div>

              {canUpdateTasks && (
                <div className="flex items-center space-x-1">
                  {task.status === "assigned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusUpdate(task.id, "in_progress")
                      }}
                    >
                      Start
                    </Button>
                  )}
                  {task.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusUpdate(task.id, "completed")
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
