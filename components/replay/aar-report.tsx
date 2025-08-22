"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Download,
  Share,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useReplayStore } from "@/store/replay-store"

export function AARReport() {
  const { replayData, selectedEvents, generateAAR } = useReplayStore()
  const [aarData, setAarData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedEvents.length > 0) {
      handleGenerateAAR()
    }
  }, [selectedEvents])

  const handleGenerateAAR = async () => {
    setLoading(true)
    try {
      const data = await generateAAR(selectedEvents)
      setAarData(data)
    } catch (error) {
      console.error("Failed to generate AAR:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating AAR Report...</p>
        </div>
      </div>
    )
  }

  if (!aarData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No AAR Data Available</h3>
          <p className="text-muted-foreground mb-4">
            Select events from the timeline or events tab to generate an After Action Review report.
          </p>
          <Button onClick={handleGenerateAAR} disabled={selectedEvents.length === 0}>
            Generate AAR Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">After Action Review</h2>
          <p className="text-sm text-muted-foreground">
            Analysis of {selectedEvents.length} events from {new Date(aarData.timeRange.start).toLocaleDateString()} to{" "}
            {new Date(aarData.timeRange.end).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="h-full">
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatDuration(aarData.timeRange.end - aarData.timeRange.start)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Units Involved</span>
                  </div>
                  <p className="text-2xl font-bold">{aarData.metrics.unitsInvolved}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{aarData.metrics.tasksCompleted}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Incidents</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{aarData.metrics.incidents}</p>
                </CardContent>
              </Card>
            </div>

            {/* Mission Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objective</h4>
                  <p className="text-sm text-muted-foreground">{aarData.summary.objective}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Outcome</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={aarData.summary.success ? "default" : "destructive"}>
                      {aarData.summary.success ? "SUCCESS" : "PARTIAL SUCCESS"}
                    </Badge>
                    <span className="text-sm">{aarData.summary.outcome}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Events</h4>
                  <ul className="space-y-1">
                    {aarData.summary.keyEvents.map((event: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aarData.timeline.phases.map((phase: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{phase.name}</h4>
                        <Badge variant="outline">{formatDuration(phase.duration)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{new Date(phase.startTime).toLocaleTimeString()}</span>
                        <span>-</span>
                        <span>{new Date(phase.endTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    What Went Well
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aarData.performance.positives.map((item: string, index: number) => (
                      <li key={index} className="text-sm flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aarData.performance.improvements.map((item: string, index: number) => (
                      <li key={index} className="text-sm flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Unit Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aarData.performance.units.map((unit: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{unit.name}</h4>
                        <p className="text-sm text-muted-foreground">{unit.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            unit.performance >= 80 ? "default" : unit.performance >= 60 ? "secondary" : "destructive"
                          }
                        >
                          {unit.performance}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {unit.tasksCompleted}/{unit.totalTasks} tasks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lessons Learned</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aarData.lessons.map((lesson: any, index: number) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {lesson.category}
                      </Badge>
                      <Badge
                        variant={
                          lesson.priority === "HIGH"
                            ? "destructive"
                            : lesson.priority === "MEDIUM"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {lesson.priority} Priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aarData.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge
                          variant={
                            rec.priority === "HIGH"
                              ? "destructive"
                              : rec.priority === "MEDIUM"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Responsible: {rec.responsible}</span>
                        <span>Due: {new Date(rec.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
