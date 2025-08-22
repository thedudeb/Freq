'use client'

import React, { useState, useEffect } from 'react'
import { Mic, Inbox, Send, User, Bell } from 'lucide-react'
import InboxPage from '../components/InboxPage'
import SendPage from '../components/SendPage'
import FarcasterAuth from '../components/FarcasterAuth'
import PasswordGate from '../components/PasswordGate'
import FarcasterNotificationCenter from '../components/FarcasterNotificationCenter'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ fid: number | undefined; username: string; displayName?: string; avatar?: string } | null>(null)
  const [hasBetaAccess, setHasBetaAccess] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  useEffect(() => {
    // Check if user has beta access
    const betaAccess = localStorage.getItem('freq-beta-access')
    if (betaAccess === 'true') {
      setHasBetaAccess(true)
    }
  }, [])

  useEffect(() => {
    // Update unread notification count when user changes
    if (user?.fid) {
      const updateUnreadCount = () => {
        const { getFarcasterUnreadCount } = require('../lib/farcaster-miniapp-notifications')
        setUnreadNotificationCount(getFarcasterUnreadCount(user.fid))
      }
      
      updateUnreadCount()
      // Update every 30 seconds
      const interval = setInterval(updateUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user?.fid])

  const handleBetaAccess = () => {
    setHasBetaAccess(true)
  }

  if (!hasBetaAccess) {
    return <PasswordGate onAuthenticated={handleBetaAccess} />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-farcaster-purple to-farcaster-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Freq</h1>
            <p className="text-gray-600">Voice messages on Farcaster</p>
          </div>
          
          <FarcasterAuth 
            onAuthenticated={(user) => {
              setIsAuthenticated(true)
              setUser(user)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-farcaster-purple to-farcaster-pink rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Freq</h1>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsNotificationCenterOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-farcaster-purple text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Switch Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('freq-beta-access')
                  setHasBetaAccess(false)
                  setIsAuthenticated(false)
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Exit Beta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === 'inbox'
                  ? 'bg-gradient-to-r from-farcaster-purple to-farcaster-pink text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span className="font-medium">Inbox</span>
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === 'send'
                  ? 'bg-gradient-to-r from-farcaster-purple to-farcaster-pink text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {activeTab === 'inbox' ? (
          <InboxPage user={user} />
        ) : (
          <SendPage user={user} />
        )}
      </main>

      {/* Farcaster Notification Center */}
      <FarcasterNotificationCenter
        user={user}
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  )
} 