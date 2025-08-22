"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Plus, Filter } from "lucide-react"
import { TasksList } from "./tasks-list"
import { CreateTaskDialog } from "./create-task-dialog"
import { TaskDetails } from "./task-details"
import { TaskFilters } from "./task-filters"
import { useTasksStore } from "@/store/tasks-store"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"

export function TaskingPanel() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedView, setSelectedView] = useState<"list" | "details">("list")

  const { user } = useAuthStore()
  const { currentOperationId } = useDataStore()
  const { tasks, selectedTask, isLoading, loadTasks, selectTask, getTaskStats } = useTasksStore()

  useEffect(() => {
    if (currentOperationId) {
      loadTasks(currentOperationId)
    }
  }, [currentOperationId, loadTasks])

  const canCreateTasks = user?.permissions.includes("assign_tasks")
  const stats = currentOperationId ? getTaskStats(currentOperationId) : null

  const handleTaskSelect = (taskId: string) => {
    selectTask(taskId)
    setSelectedView("details")
  }

  return (
    <div className="h-full flex">
      {/* Main Tasking Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Task Management</h2>
              {stats && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{stats.total} Total</Badge>
                  <Badge variant="default">{stats.inProgress} Active</Badge>
                  <Badge variant="secondary">{stats.completed} Done</Badge>
                  {stats.overdue > 0 && <Badge variant="destructive">{stats.overdue} Overdue</Badge>}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {canCreateTasks && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 mt-4">
            <Button
              variant={selectedView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("list")}
            >
              Tasks List
            </Button>
            {selectedTask && (
              <Button
                variant={selectedView === "details" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView("details")}
              >
                Task Details
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <TaskFilters />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedView === "list" && (
            <TasksList tasks={tasks} selectedId={selectedTask?.id} onSelect={handleTaskSelect} isLoading={isLoading} />
          )}

          {selectedView === "details" && selectedTask && <TaskDetails task={selectedTask} />}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
