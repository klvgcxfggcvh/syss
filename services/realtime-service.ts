import type { PositionUpdate } from "./api-service"

export type RealtimeEventType =
  | "position_update"
  | "feature_created"
  | "feature_updated"
  | "feature_deleted"
  | "task_assigned"
  | "message_received"

export interface RealtimeEvent {
  type: RealtimeEventType
  data: any
  timestamp: string
  operationId: string
}

export type RealtimeEventHandler = (event: RealtimeEvent) => void

class RealtimeService {
  private eventSource: EventSource | null = null
  private websocket: WebSocket | null = null
  private handlers: Map<RealtimeEventType, Set<RealtimeEventHandler>> = new Map()
  private operationId: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  setOperationId(operationId: string) {
    if (!operationId || operationId === "null" || operationId === "undefined") {
      console.warn("Invalid operation ID provided to realtime service:", operationId)
      this.operationId = null
      return
    }
    this.operationId = operationId
  }

  connect() {
    if (!this.operationId || this.operationId === "null" || this.operationId === "undefined") {
      console.warn("Cannot connect realtime service: Operation ID not set or invalid")
      return
    }

    this.connectSSE()
    this.connectWebSocket()
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }

    this.reconnectAttempts = 0
  }

  private connectSSE() {
    const sseUrl = `/api/ops/${this.operationId}/stream/positions`

    try {
      this.eventSource = new EventSource(sseUrl)

      this.eventSource.onopen = () => {
        console.log("SSE connection established")
        this.reconnectAttempts = 0
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleEvent({
            type: "position_update",
            data,
            timestamp: new Date().toISOString(),
            operationId: this.operationId!,
          })
        } catch (error) {
          console.error("Failed to parse SSE message:", error)
        }
      }

      this.eventSource.onerror = (error) => {
        console.error("SSE connection error:", error)
        this.handleReconnect()
      }

      // Simulate position updates for development
      this.simulatePositionUpdates()
    } catch (error) {
      console.error("Failed to establish SSE connection:", error)
      this.simulatePositionUpdates()
    }
  }

  private connectWebSocket() {
    const wsUrl = `ws://localhost:8080/ws/ops/${this.operationId}`

    try {
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        console.log("WebSocket connection established")
        this.reconnectAttempts = 0
      }

      this.websocket.onmessage = (event) => {
        try {
          const eventData = JSON.parse(event.data)
          this.handleEvent(eventData)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.websocket.onerror = (error) => {
        console.error("WebSocket connection error:", error)
      }

      this.websocket.onclose = () => {
        console.log("WebSocket connection closed")
        this.handleReconnect()
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      )

      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.error("Max reconnection attempts reached")
    }
  }

  private simulatePositionUpdates() {
    // Simulate real-time position updates for development
    const mockUnits = ["unit_alpha_1", "unit_bravo_1", "unit_charlie_1"]

    setInterval(() => {
      const unitId = mockUnits[Math.floor(Math.random() * mockUnits.length)]
      const baseCoords = [38.7525, 9.0192]
      const offset = (Math.random() - 0.5) * 0.01

      const positionUpdate: PositionUpdate = {
        featureId: unitId,
        coordinates: [baseCoords[0] + offset, baseCoords[1] + offset],
        timestamp: new Date().toISOString(),
        speed: Math.random() * 10,
        heading: Math.random() * 360,
        status: "moving",
      }

      this.handleEvent({
        type: "position_update",
        data: positionUpdate,
        timestamp: new Date().toISOString(),
        operationId: this.operationId!,
      })
    }, 5000) // Update every 5 seconds
  }

  private handleEvent(event: RealtimeEvent) {
    const handlers = this.handlers.get(event.type)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    }
  }

  on(eventType: RealtimeEventType, handler: RealtimeEventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler)
  }

  off(eventType: RealtimeEventType, handler: RealtimeEventHandler) {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  sendMessage(type: string, data: any) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type, data }))
    } else {
      console.warn("WebSocket not connected, cannot send message")
    }
  }
}

export const realtimeService = new RealtimeService()
