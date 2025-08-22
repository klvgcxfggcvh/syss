"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useTasksStore } from "@/store/tasks-store"

export function TaskFilters() {
  const { filters, setFilter, clearFilters, getFilteredTasks } = useTasksStore()

  const filteredCount = getFilteredTasks().length

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => setFilter("status", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Priority:</span>
          <Select
            value={filters.priority || "all"}
            onValueChange={(value) => setFilter("priority", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Assigned To:</span>
          <Select
            value={filters.assignedTo || "all"}
            onValueChange={(value) => setFilter("assignedTo", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              <SelectItem value="unit_alpha">Unit Alpha</SelectItem>
              <SelectItem value="unit_bravo">Unit Bravo</SelectItem>
              <SelectItem value="unit_charlie">Unit Charlie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Object.entries(filters).some(([_, value]) => value !== null) && (
            <>
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.status && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Status: {filters.status}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilter("status", null)} />
                </Badge>
              )}
              {filters.priority && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Priority: {filters.priority}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilter("priority", null)} />
                </Badge>
              )}
              {filters.assignedTo && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Unit: {filters.assignedTo}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilter("assignedTo", null)} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </>
          )}
        </div>

        <Badge variant="outline">{filteredCount} tasks shown</Badge>
      </div>
    </div>
  )
}
