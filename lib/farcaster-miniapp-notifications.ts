// Farcaster Miniapp Notification System
// Following Farcaster's native notification patterns and best practices

export interface FarcasterNotification {
  id: string
  type: 'cast' | 'reaction' | 'follow' | 'mention' | 'voice_message'
  fid: number
  username: string
  displayName: string
  avatar: string
  text?: string
  castHash?: string
  parentHash?: string
  timestamp: Date
  read: boolean
  metadata?: {
    app: 'freq'
    voiceMessageId?: string
    audioUrl?: string
    duration?: number
    recipients?: number[]
  }
}

export interface FarcasterNotificationPreferences {
  fid: number
  casts: boolean
  reactions: boolean
  follows: boolean
  mentions: boolean
  voiceMessages: boolean
  pushEnabled: boolean
  emailEnabled: boolean
}

// In-memory storage for Farcaster notifications
const farcasterNotifications: FarcasterNotification[] = []
const notificationPreferences: Map<number, FarcasterNotificationPreferences> = new Map()

// Default Farcaster notification preferences
const getDefaultFarcasterPreferences = (fid: number): FarcasterNotificationPreferences => ({
  fid,
  casts: true,
  reactions: true,
  follows: true,
  mentions: true,
  voiceMessages: true,
  pushEnabled: true,
  emailEnabled: false
})

// Create a Farcaster-style notification
export function createFarcasterNotification(data: Omit<FarcasterNotification, 'id' | 'timestamp' | 'read'>): FarcasterNotification {
  const notification: FarcasterNotification = {
    ...data,
    id: `farcaster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false
  }
  
  farcasterNotifications.push(notification)
  
  // Check if we should send immediate notification based on Farcaster patterns
  const preferences = getFarcasterNotificationPreferences(data.fid)
  if (shouldSendFarcasterNotification(notification, preferences)) {
    sendFarcasterStyleNotification(notification)
  }
  
  return notification
}

// Get Farcaster notifications for a user
export function getFarcasterNotifications(fid: number, limit: number = 50): FarcasterNotification[] {
  return farcasterNotifications
    .filter(n => n.fid === fid)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

// Mark Farcaster notification as read
export function markFarcasterNotificationAsRead(notificationId: string): boolean {
  const notification = farcasterNotifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    return true
  }
  return false
}

// Mark all Farcaster notifications as read for a user
export function markAllFarcasterNotificationsAsRead(fid: number): number {
  let count = 0
  farcasterNotifications.forEach(notification => {
    if (notification.fid === fid && !notification.read) {
      notification.read = true
      count++
    }
  })
  return count
}

// Get unread Farcaster notification count
export function getFarcasterUnreadCount(fid: number): number {
  return farcasterNotifications.filter(n => n.fid === fid && !n.read).length
}

// Get Farcaster notification preferences
export function getFarcasterNotificationPreferences(fid: number): FarcasterNotificationPreferences {
  return notificationPreferences.get(fid) || getDefaultFarcasterPreferences(fid)
}

// Update Farcaster notification preferences
export function updateFarcasterNotificationPreferences(fid: number, preferences: Partial<FarcasterNotificationPreferences>): void {
  const current = getFarcasterNotificationPreferences(fid)
  notificationPreferences.set(fid, { ...current, ...preferences })
}

// Check if notification should be sent based on Farcaster patterns
function shouldSendFarcasterNotification(notification: FarcasterNotification, preferences: FarcasterNotificationPreferences): boolean {
  switch (notification.type) {
    case 'cast':
      return preferences.casts
    case 'reaction':
      return preferences.reactions
    case 'follow':
      return preferences.follows
    case 'mention':
      return preferences.mentions
    case 'voice_message':
      return preferences.voiceMessages
    default:
      return true
  }
}

// Send Farcaster-style notification
function sendFarcasterStyleNotification(notification: FarcasterNotification): void {
  // Browser notification with Farcaster styling
  if ('Notification' in window && Notification.permission === 'granted') {
    const title = getFarcasterNotificationTitle(notification)
    const body = getFarcasterNotificationBody(notification)
    
    new Notification(title, {
      body,
      icon: notification.avatar || '/favicon.ico',
      badge: '/favicon.ico',
      tag: `farcaster-${notification.id}`,
      requireInteraction: false,
      silent: false,
      data: {
        type: 'farcaster_notification',
        notificationId: notification.id,
        castHash: notification.castHash,
        fid: notification.fid
      }
    })
  }
  
  // In-app Farcaster-style notification
  showFarcasterInAppNotification(notification)
}

// Get Farcaster notification title
function getFarcasterNotificationTitle(notification: FarcasterNotification): string {
  switch (notification.type) {
    case 'cast':
      return `${notification.displayName} (@${notification.username}) casted`
    case 'reaction':
      return `${notification.displayName} reacted to your cast`
    case 'follow':
      return `${notification.displayName} followed you`
    case 'mention':
      return `${notification.displayName} mentioned you`
    case 'voice_message':
      return `🎤 ${notification.displayName} sent you a voice message`
    default:
      return `New notification from ${notification.displayName}`
  }
}

// Get Farcaster notification body
function getFarcasterNotificationBody(notification: FarcasterNotification): string {
  switch (notification.type) {
    case 'cast':
      return notification.text || 'Tap to view the cast'
    case 'reaction':
      return 'Tap to see the reaction'
    case 'follow':
      return 'Tap to view their profile'
    case 'mention':
      return notification.text || 'Tap to view the mention'
    case 'voice_message':
      return `Tap to listen to the ${notification.metadata?.duration || 0}s voice message`
    default:
      return 'Tap to view details'
  }
}

// Show in-app Farcaster-style notification
function showFarcasterInAppNotification(notification: FarcasterNotification): void {
  // Create a Farcaster-style toast notification
  const toast = document.createElement('div')
  toast.className = 'farcaster-toast'
  toast.innerHTML = `
    <div class="farcaster-toast-content">
      <img src="${notification.avatar}" alt="${notification.displayName}" class="farcaster-toast-avatar" />
      <div class="farcaster-toast-text">
        <div class="farcaster-toast-title">${getFarcasterNotificationTitle(notification)}</div>
        <div class="farcaster-toast-body">${getFarcasterNotificationBody(notification)}</div>
      </div>
    </div>
  `
  
  // Add Farcaster-style CSS
  if (!document.getElementById('farcaster-toast-styles')) {
    const style = document.createElement('style')
    style.id = 'farcaster-toast-styles'
    style.textContent = `
      .farcaster-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 320px;
        animation: farcaster-toast-slide-in 0.3s ease-out;
      }
      
      .farcaster-toast-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      
      .farcaster-toast-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .farcaster-toast-text {
        flex: 1;
        min-width: 0;
      }
      
      .farcaster-toast-title {
        font-weight: 600;
        font-size: 14px;
        color: #111827;
        margin-bottom: 2px;
      }
      
      .farcaster-toast-body {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.4;
      }
      
      @keyframes farcaster-toast-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
    document.head.appendChild(style)
  }
  
  document.body.appendChild(toast)
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 5000)
}

// Create voice message notification in Farcaster style
export function createVoiceMessageNotification(
  senderFid: number,
  senderUsername: string,
  senderDisplayName: string,
  senderAvatar: string,
  recipientFid: number,
  voiceMessageId: string,
  audioUrl: string,
  duration: number,
  castHash?: string
): void {
  // Create notification for recipient
  createFarcasterNotification({
    type: 'voice_message',
    fid: recipientFid,
    username: senderUsername,
    displayName: senderDisplayName,
    avatar: senderAvatar,
    castHash,
    metadata: {
      app: 'freq',
      voiceMessageId,
      audioUrl,
      duration,
      recipients: [recipientFid]
    }
  })
}

// Handle Farcaster cast notifications
export function handleFarcasterCast(cast: any): void {
  // Check for mentions
  if (cast.text && cast.text.includes('@')) {
    const mentions = extractMentions(cast.text)
    mentions.forEach(mention => {
      createFarcasterNotification({
        type: 'mention',
        fid: mention.fid,
        username: cast.author.username,
        displayName: cast.author.displayName,
        avatar: cast.author.avatar,
        text: cast.text,
        castHash: cast.hash,
        parentHash: cast.parentHash
      })
    })
  }
}

// Extract mentions from cast text
function extractMentions(text: string): Array<{ fid: number, username: string }> {
  const mentions: Array<{ fid: number, username: string }> = []
  const mentionRegex = /@(\w+)/g
  let match
  
  while ((match = mentionRegex.exec(text)) !== null) {
    // In a real implementation, you'd look up the FID for the username
    // For now, we'll use a mock lookup
    const username = match[1]
    const mockFid = Math.floor(Math.random() * 100000) + 1000
    
    mentions.push({
      fid: mockFid,
      username
    })
  }
  
  return mentions
}

// Handle Farcaster reaction notifications
export function handleFarcasterReaction(reaction: any): void {
  createFarcasterNotification({
    type: 'reaction',
    fid: reaction.targetFid,
    username: reaction.author.username,
    displayName: reaction.author.displayName,
    avatar: reaction.author.avatar,
    castHash: reaction.targetCastHash
  })
}

// Handle Farcaster follow notifications
export function handleFarcasterFollow(follow: any): void {
  createFarcasterNotification({
    type: 'follow',
    fid: follow.targetFid,
    username: follow.follower.username,
    displayName: follow.follower.displayName,
    avatar: follow.follower.avatar
  })
}

// Request Farcaster notification permissions
export async function requestFarcasterNotificationPermissions(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }
  
  if (Notification.permission === 'granted') {
    return true
  }
  
  if (Notification.permission === 'denied') {
    console.warn('Farcaster notification permission denied')
    return false
  }
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// Delete Farcaster notification
export function deleteFarcasterNotification(notificationId: string): boolean {
  const index = farcasterNotifications.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    farcasterNotifications.splice(index, 1)
    return true
  }
  return false
}

// Clear all Farcaster notifications for a user
export function clearAllFarcasterNotifications(fid: number): number {
  const initialLength = farcasterNotifications.length
  const filtered = farcasterNotifications.filter(n => n.fid !== fid)
  const deleted = initialLength - filtered.length
  
  farcasterNotifications.length = 0
  farcasterNotifications.push(...filtered)
  
  return deleted
} 