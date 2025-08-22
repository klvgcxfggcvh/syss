"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, User, Calendar, MapPin, Edit, Save, X, Download, Share } from "lucide-react"
import { useReportsStore } from "@/store/reports-store"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

interface ReportDetailsProps {
  report: any
}

export function ReportDetails({ report }: ReportDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(report.content)
  const [editedStatus, setEditedStatus] = useState(report.status)

  const { updateReport } = useReportsStore()
  const { user } = useAuthStore()

  const canEdit = user?.role === "HQ" || report.authorId === user?.id

  const handleSave = async () => {
    await updateReport(report.id, {
      content: editedContent,
      status: editedStatus,
      updatedAt: new Date().toISOString(),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(report.content)
    setEditedStatus(report.status)
    setIsEditing(false)
  }

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
    <div className="h-full p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2" />
                {report.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {report.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(report.createdAt).toLocaleString()}
                </div>
                {report.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {report.location.name}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={cn("text-xs", getPriorityColor(report.priority))}>
                {report.priority}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", getStatusColor(isEditing ? editedStatus : report.status))}
              >
                {isEditing ? editedStatus : report.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editedStatus} onValueChange={setEditedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                  <SelectItem value="REVIEWED">REVIEWED</SelectItem>
                  <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <div className="bg-muted/50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm font-mono">{report.content}</pre>
              </div>
            )}
          </div>

          {report.updatedAt !== report.createdAt && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              Last updated: {new Date(report.updatedAt).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
