import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { websocketService } from '../services/websocketService'
import api from '../services/api'

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  issueId?: number
  isRead: boolean
  createdAt: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    // Fetch initial notifications
    fetchNotifications()
    fetchUnreadCount()

    // Connect to WebSocket
    try {
      websocketService.connect(user.id.toString(), (notification: Notification) => {
        // Add new notification to list
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/notification-icon.png'
          })
        }
      })
    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }

    return () => {
      try {
        websocketService.disconnect()
      } catch (error) {
        console.error('WebSocket disconnect failed:', error)
      }
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread/count')
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    requestPermission,
  }
}
