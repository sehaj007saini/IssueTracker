import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class WebSocketService {
  private client: Client | null = null
  private connected = false

  connect(userId: string, onNotification: (notification: any) => void) {
    if (this.connected) return

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log('STOMP: ' + str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    this.client.onConnect = () => {
      console.log('WebSocket Connected!')
      this.connected = true

      // Subscribe to user-specific notifications
      this.client?.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        const notification = JSON.parse(message.body)
        onNotification(notification)
      })

      // Subscribe to broadcast notifications
      this.client?.subscribe('/topic/announcements', (message) => {
        const notification = JSON.parse(message.body)
        onNotification(notification)
      })
    }

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame)
    }

    this.client.activate()
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.connected = false
      console.log('WebSocket Disconnected!')
    }
  }

  isConnected() {
    return this.connected
  }
}

export const websocketService = new WebSocketService()
