"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Play, Pause, SkipBack, SkipForward, RotateCcw, Download, BarChart3 } from "lucide-react"
import { TimelineView } from "./timeline-view"
import { AARReport } from "./aar-report"
import { EventsFilter } from "./events-filter"
import { useReplayStore } from "@/store/replay-store"

export function ReplayPanel() {
  const {
    isPlaying,
    currentTime,
    startTime,
    endTime,
    playbackSpeed,
    selectedEvents,
    replayData,
    togglePlayback,
    setCurrentTime,
    setPlaybackSpeed,
    setTimeRange,
    fetchReplayData,
    generateAAR,
  } = useReplayStore()

  const [showAAR, setShowAAR] = useState(false)

  useEffect(() => {
    fetchReplayData()
  }, [fetchReplayData])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  const handleSkipBack = () => {
    const newTime = Math.max(startTime, currentTime - 300000) // 5 minutes back
    setCurrentTime(newTime)
  }

  const handleSkipForward = () => {
    const newTime = Math.min(endTime, currentTime + 300000) // 5 minutes forward
    setCurrentTime(newTime)
  }

  const handleReset = () => {
    setCurrentTime(startTime)
  }

  const progress = ((currentTime - startTime) / (endTime - startTime)) * 100

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Replay & After Action Review
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowAAR(!showAAR)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {showAAR ? "Hide AAR" : "Generate AAR"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Time Range Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Time Range</span>
            <span>{formatDuration(endTime - startTime)}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>{formatTime(startTime)}</span>
            <div className="flex-1 bg-muted rounded-full h-2 relative">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(endTime)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSkipBack}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={togglePlayback} size="sm">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSkipForward}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Time Scrubber */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Time</span>
              <span>{formatTime(currentTime)}</span>
            </div>
            <Slider
              value={[currentTime]}
              onValueChange={handleTimeChange}
              min={startTime}
              max={endTime}
              step={60000} // 1 minute steps
              className="w-full"
            />
          </div>

          {/* Playback Speed */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Playback Speed</span>
            <div className="flex items-center space-x-2">
              {[0.5, 1, 2, 4, 8].map((speed) => (
                <Button
                  key={speed}
                  variant={playbackSpeed === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant={isPlaying ? "default" : "secondary"}>{isPlaying ? "Playing" : "Paused"}</Badge>
              <Badge variant="outline">{playbackSpeed}x Speed</Badge>
            </div>
            <div className="text-muted-foreground">{selectedEvents.length} events selected</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="timeline" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="aar">AAR Report</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="flex-1 overflow-hidden mt-4">
            <TimelineView />
          </TabsContent>

          <TabsContent value="events" className="flex-1 overflow-hidden mt-4">
            <EventsFilter />
          </TabsContent>

          <TabsContent value="aar" className="flex-1 overflow-hidden mt-4">
            <AARReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
