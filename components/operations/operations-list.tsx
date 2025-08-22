"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import type { Operation } from "@/store/operations-store"
import { useCalendarStore } from "@/store/calendar-store"

interface OperationsListProps {
  operations: Operation[]
  selectedId?: string
  onSelect: (id: string) => void
  isLoading: boolean
}

export function OperationsList({ operations, selectedId, onSelect, isLoading }: OperationsListProps) {
  const { formatDate } = useCalendarStore()

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

  if (operations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">No Operations</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>No operations have been created yet.</p>
            <p className="text-sm mt-2">Contact your HQ to create a new operation.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {operations.map((operation) => (
        <Card
          key={operation.id}
          className={`cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedId === operation.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect(operation.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{operation.name}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{operation.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date(operation.startDate))}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge
                  variant={
                    operation.status === "active"
                      ? "default"
                      : operation.status === "completed"
                        ? "secondary"
                        : operation.status === "planning"
                          ? "outline"
                          : "destructive"
                  }
                  className="flex items-center space-x-1"
                >
                  {operation.status === "active" && <CheckCircle className="h-3 w-3" />}
                  {operation.status === "suspended" && <AlertTriangle className="h-3 w-3" />}
                  {operation.status === "planning" && <Clock className="h-3 w-3" />}
                  <span className="capitalize">{operation.status}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Priority: {operation.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{operation.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{operation.assignedUnits.length} Units</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>AOI: {operation.aoi ? "Defined" : "Not Set"}</span>
                </div>
              </div>

              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
