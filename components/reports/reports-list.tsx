"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Clock, User, MapPin } from "lucide-react"
import { useReportsStore } from "@/store/reports-store"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

interface ReportsListProps {
  type: "all" | "sitrep" | "conrep" | "intsum"
}

export function ReportsList({ type }: ReportsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { reports, selectedReport, selectReport, fetchReports } = useReportsStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = type === "all" || report.type === type
    return matchesSearch && matchesType
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-500"
      case "SUBMITTED":
        return "bg-blue-500"
      case "REVIEWED":
        return "bg-green-500"
      case "ARCHIVED":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              selectedReport?.id === report.id && "ring-2 ring-primary",
            )}
            onClick={() => selectReport(report)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{report.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{report.content}</p>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-2">
                  <Badge variant="secondary" className={cn("text-xs", getPriorityColor(report.priority))}>
                    {report.priority}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(report.status))}>
                    {report.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {report.author}
                  </div>
                  {report.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {report.location.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && <div className="text-center py-8 text-muted-foreground">No reports found</div>}
      </div>
    </div>
  )
}
