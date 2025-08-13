'use client'

import React, { useState, useEffect } from 'react'
import { Bell, BellOff, X, Settings, Check, Trash2, Clock } from 'lucide-react'
import { Button } from './ui/Button'
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
  clearAllNotifications,
  NotificationData,
  requestNotificationPermissions,
  getNotificationPreferences,
  updateNotificationPreferences,
  NotificationPreferences
} from '../lib/notifications'

interface NotificationCenterProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ user, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    if (isOpen && user?.fid) {
      loadNotifications()
      loadPreferences()
      checkNotificationPermission()
    }
  }, [isOpen, user?.fid])

  const loadNotifications = () => {
    if (!user?.fid) return
    
    const userNotifications = getNotifications(user.fid)
    setNotifications(userNotifications)
    setUnreadCount(getUnreadCount(user.fid))
  }

  const loadPreferences = () => {
    if (!user?.fid) return
    
    const userPreferences = getNotificationPreferences(user.fid)
    setPreferences(userPreferences)
  }

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted')
    }
  }

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermissions()
    setPermissionGranted(granted)
    if (granted) {
      loadPreferences()
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    if (!user?.fid) return
    
    markAllNotificationsAsRead(user.fid)
    loadNotifications()
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId)
    loadNotifications()
  }

  const handleClearAll = () => {
    if (!user?.fid) return
    
    clearAllNotifications(user.fid)
    loadNotifications()
  }

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    if (!user?.fid || !preferences) return
    
    const updatedPreferences = { ...preferences, [key]: value }
    updateNotificationPreferences(user.fid, updatedPreferences)
    setPreferences(updatedPreferences)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'voice_message_received':
        return '🎤'
      case 'voice_message_sent':
        return '✅'
      case 'mention':
        return '@'
      case 'reaction':
        return '❤️'
      default:
        return '📢'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-farcaster-purple" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-farcaster-purple text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && preferences && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Notification Settings</h3>
            
            {!permissionGranted && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">Enable browser notifications to get alerts</p>
                <Button
                  onClick={handleRequestPermission}
                  size="sm"
                  className="btn-primary"
                >
                  Enable Notifications
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.voiceMessageNotifications}
                  onChange={(e) => handlePreferenceChange('voiceMessageNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-farcaster-purple focus:ring-farcaster-purple"
                />
                <span className="text-sm text-gray-700">Voice message notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.mentionNotifications}
                  onChange={(e) => handlePreferenceChange('mentionNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-farcaster-purple focus:ring-farcaster-purple"
                />
                <span className="text-sm text-gray-700">Mention notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.reactionNotifications}
                  onChange={(e) => handlePreferenceChange('reactionNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-farcaster-purple focus:ring-farcaster-purple"
                />
                <span className="text-sm text-gray-700">Reaction notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-farcaster-purple focus:ring-farcaster-purple"
                />
                <span className="text-sm text-gray-700">Push notifications</span>
              </label>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.senderDisplayName}
                        </p>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.type === 'voice_message_received' && 
                          `Sent you a ${notification.duration}s voice message`
                        }
                        {notification.type === 'voice_message_sent' && 
                          `Your ${notification.duration}s voice message was delivered`
                        }
                        {notification.type === 'mention' && 
                          'Mentioned you in a message'
                        }
                        {notification.type === 'reaction' && 
                          'Reacted to your message'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <Button
                onClick={handleMarkAllAsRead}
                variant="secondary"
                size="sm"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
              <Button
                onClick={handleClearAll}
                variant="secondary"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 