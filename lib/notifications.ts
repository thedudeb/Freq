// Notification system for Freq voice messages
// Following Farcaster Miniapps best practices

export interface NotificationData {
  id: string
  type: 'voice_message_received' | 'voice_message_sent' | 'mention' | 'reaction'
  recipientFid: number
  senderFid: number
  senderUsername: string
  senderDisplayName: string
  messageId: string
  castHash?: string
  audioUrl: string
  duration: number
  timestamp: Date
  read: boolean
  metadata?: {
    app: 'freq'
    version: '1.0.0'
    platform: 'web'
  }
}

export interface NotificationPreferences {
  fid: number
  voiceMessageNotifications: boolean
  mentionNotifications: boolean
  reactionNotifications: boolean
  pushNotifications: boolean
  emailNotifications: boolean
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
}

// In-memory storage for notifications (in production, use a database)
const notifications: NotificationData[] = []
const notificationPreferences: Map<number, NotificationPreferences> = new Map()

// Default notification preferences
const getDefaultPreferences = (fid: number): NotificationPreferences => ({
  fid,
  voiceMessageNotifications: true,
  mentionNotifications: true,
  reactionNotifications: true,
  pushNotifications: true,
  emailNotifications: false,
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00"
  }
})

// Create a new notification
export function createNotification(data: Omit<NotificationData, 'id' | 'read' | 'timestamp'>): NotificationData {
  const notification: NotificationData = {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false,
    metadata: {
      app: 'freq',
      version: '1.0.0',
      platform: 'web'
    }
  }
  
  notifications.push(notification)
  
  // Check if we should send immediate notification
  const preferences = getNotificationPreferences(data.recipientFid)
  if (shouldSendNotification(notification, preferences)) {
    sendImmediateNotification(notification, preferences)
  }
  
  return notification
}

// Get notifications for a user
export function getNotifications(fid: number, limit: number = 50): NotificationData[] {
  return notifications
    .filter(n => n.recipientFid === fid)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string): boolean {
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    return true
  }
  return false
}

// Mark all notifications as read for a user
export function markAllNotificationsAsRead(fid: number): number {
  let count = 0
  notifications.forEach(notification => {
    if (notification.recipientFid === fid && !notification.read) {
      notification.read = true
      count++
    }
  })
  return count
}

// Get unread notification count
export function getUnreadCount(fid: number): number {
  return notifications.filter(n => n.recipientFid === fid && !n.read).length
}

// Get notification preferences
export function getNotificationPreferences(fid: number): NotificationPreferences {
  return notificationPreferences.get(fid) || getDefaultPreferences(fid)
}

// Update notification preferences
export function updateNotificationPreferences(fid: number, preferences: Partial<NotificationPreferences>): void {
  const current = getNotificationPreferences(fid)
  notificationPreferences.set(fid, { ...current, ...preferences })
}

// Check if notification should be sent based on preferences and quiet hours
function shouldSendNotification(notification: NotificationData, preferences: NotificationPreferences): boolean {
  // Check if notifications are enabled for this type
  if (notification.type === 'voice_message_received' && !preferences.voiceMessageNotifications) {
    return false
  }
  
  if (notification.type === 'mention' && !preferences.mentionNotifications) {
    return false
  }
  
  if (notification.type === 'reaction' && !preferences.reactionNotifications) {
    return false
  }
  
  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    if (isInQuietHours(currentTime, preferences.quietHours.start, preferences.quietHours.end)) {
      return false
    }
  }
  
  return true
}

// Check if current time is in quiet hours
function isInQuietHours(currentTime: string, startTime: string, endTime: string): boolean {
  const current = timeToMinutes(currentTime)
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  
  if (start <= end) {
    // Same day (e.g., 09:00 to 17:00)
    return current >= start && current <= end
  } else {
    // Overnight (e.g., 22:00 to 08:00)
    return current >= start || current <= end
  }
}

// Convert time string to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Send immediate notification (browser notification, toast, etc.)
function sendImmediateNotification(notification: NotificationData, preferences: NotificationPreferences): void {
  // Browser notification
  if (preferences.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
    const title = getNotificationTitle(notification)
    const body = getNotificationBody(notification)
    const icon = '/favicon.ico' // Add your app icon
    
    new Notification(title, {
      body,
      icon,
      tag: notification.id,
      requireInteraction: false,
      silent: false
    })
  }
  
  // In-app toast notification (you can implement this with a toast library)
  showInAppNotification(notification)
}

// Get notification title
function getNotificationTitle(notification: NotificationData): string {
  switch (notification.type) {
    case 'voice_message_received':
      return `🎤 New voice message from ${notification.senderDisplayName}`
    case 'voice_message_sent':
      return `✅ Voice message sent to ${notification.senderDisplayName}`
    case 'mention':
      return `@${notification.senderUsername} mentioned you`
    case 'reaction':
      return `❤️ ${notification.senderDisplayName} reacted to your message`
    default:
      return 'New notification from Freq'
  }
}

// Get notification body
function getNotificationBody(notification: NotificationData): string {
  switch (notification.type) {
    case 'voice_message_received':
      return `Tap to listen to the ${notification.duration}s voice message`
    case 'voice_message_sent':
      return `Your ${notification.duration}s voice message was delivered`
    case 'mention':
      return 'Tap to view the message'
    case 'reaction':
      return 'Tap to see the reaction'
    default:
      return 'Tap to view details'
  }
}

// Show in-app notification (toast)
function showInAppNotification(notification: NotificationData): void {
  // This would integrate with your toast notification system
  // For now, we'll use a simple console log
  console.log('In-app notification:', getNotificationTitle(notification))
  
  // You can implement this with libraries like react-hot-toast or react-toastify
  // Example:
  // toast.success(getNotificationTitle(notification), {
  //   description: getNotificationBody(notification),
  //   action: {
  //     label: 'View',
  //     onClick: () => navigateToNotification(notification)
  //   }
  // })
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }
  
  if (Notification.permission === 'granted') {
    return true
  }
  
  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied')
    return false
  }
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// Delete notification
export function deleteNotification(notificationId: string): boolean {
  const index = notifications.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications.splice(index, 1)
    return true
  }
  return false
}

// Clear all notifications for a user
export function clearAllNotifications(fid: number): number {
  const initialLength = notifications.length
  const filtered = notifications.filter(n => n.recipientFid !== fid)
  const deleted = initialLength - filtered.length
  
  // Clear the array and add back non-matching notifications
  notifications.length = 0
  notifications.push(...filtered)
  
  return deleted
} 