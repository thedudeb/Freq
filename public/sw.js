// Service Worker for Freq notifications
// This handles push notifications and background sync

const CACHE_NAME = 'freq-v1'
const NOTIFICATION_TAG = 'freq-notification'

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/manifest.json'
      ])
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'New notification from Freq',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: NOTIFICATION_TAG,
    requireInteraction: false,
    silent: false,
    data: {
      url: data.url || '/',
      notificationId: data.notificationId,
      type: data.type
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon.ico'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Freq', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          // Send message to update notification state
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            notificationId: event.notification.data.notificationId
          })
          return
        }
      }

      // Open app if not already open
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications())
  }
})

// Sync notifications in background
async function syncNotifications() {
  try {
    // Fetch new notifications from server
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      
      // Show notification for new items
      if (data.notifications && data.notifications.length > 0) {
        data.notifications.forEach(notification => {
          self.registration.showNotification(
            `🎤 New voice message from ${notification.senderDisplayName}`,
            {
              body: `Tap to listen to the ${notification.duration}s voice message`,
              icon: '/favicon.ico',
              tag: `notification-${notification.id}`,
              data: {
                notificationId: notification.id,
                type: notification.type
              }
            }
          )
        })
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Message event for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return

  // Skip API requests
  if (event.request.url.includes('/api/')) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    })
  )
}) 