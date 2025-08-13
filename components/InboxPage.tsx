'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Trash2, User, Clock } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { getVoiceMessages, VoiceMessage } from '../lib/farcaster'
import { AudioStorageFactory, defaultAudioStorageConfig } from '../lib/audio-storage'

interface InboxPageProps {
  user: any
}

export default function InboxPage({ user }: InboxPageProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.fid) return
      
      setIsLoading(true)
      try {
        const voiceMessages = await getVoiceMessages(user.fid)
        setMessages(voiceMessages)
      } catch (error) {
        console.error('Error loading voice messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [user?.fid])

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

                  const handlePlayPause = async (messageId: string) => {
                  if (currentlyPlaying === messageId) {
                    // Pause current audio
                    const audio = audioElements[messageId]
                    if (audio) {
                      audio.pause()
                    }
                    setCurrentlyPlaying(null)
                  } else {
                    // Stop any currently playing audio
                    if (currentlyPlaying && audioElements[currentlyPlaying]) {
                      audioElements[currentlyPlaying].pause()
                    }

                    // Create or get audio element
                    let audio = audioElements[messageId]
                    if (!audio) {
                      const message = messages.find(m => m.id === messageId)
                      if (!message) return
                      
                      try {
                        // Handle secure audio storage
                        if (message.audioUrl.startsWith('local://')) {
                          // Local encrypted storage
                          const audioStorage = AudioStorageFactory.createStorage(defaultAudioStorageConfig)
                          const audioBlob = await (audioStorage as any).downloadAudio(message.audioUrl)
                          const audioUrl = URL.createObjectURL(audioBlob)
                          audio = new Audio(audioUrl)
                        } else if (message.audioUrl.startsWith('/uploads/')) {
                          // Shared encrypted storage - need access key
                          const audioStorage = AudioStorageFactory.createStorage(defaultAudioStorageConfig)
                          const accessKey = message.accessKey || 'default-key' // In real app, get from metadata
                          const audioBlob = await (audioStorage as any).downloadAudio(message.audioUrl, accessKey)
                          const audioUrl = URL.createObjectURL(audioBlob)
                          audio = new Audio(audioUrl)
                        } else {
                          // Regular URL
                          audio = new Audio(message.audioUrl)
                        }
                        
                        audio.addEventListener('ended', () => setCurrentlyPlaying(null))
                        setAudioElements(prev => ({ ...prev, [messageId]: audio }))
                      } catch (error) {
                        console.error('Error loading audio:', error)
                        alert('Error loading audio message')
                        return
                      }
                    }

                    // Play the audio
                    try {
                      await audio.play()
                      setCurrentlyPlaying(messageId)
                    } catch (error) {
                      console.error('Error playing audio:', error)
                    }
                  }
                }

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    if (currentlyPlaying === messageId) {
      setCurrentlyPlaying(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-farcaster-purple border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-500">Loading voice messages...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Voice Messages</h2>
        <span className="text-sm text-gray-500">{messages.length} messages</span>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No voice messages yet</h3>
          <p className="text-gray-500">When someone sends you a voice message, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="card">
              <div className="flex items-start space-x-3">
                <img
                  src={message.sender.avatar}
                  alt={message.sender.displayName}
                  className="w-12 h-12 rounded-full"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {message.sender.displayName}
                      </h3>
                      <p className="text-sm text-gray-500">@{message.sender.username}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(message.timestamp)}
                      </span>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handlePlayPause(message.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentlyPlaying === message.id
                          ? 'bg-red-500 text-white'
                          : 'bg-gradient-to-r from-farcaster-purple to-farcaster-pink text-white'
                      }`}
                    >
                      {currentlyPlaying === message.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full voice-wave transition-all duration-300 ${
                            currentlyPlaying === message.id ? 'animate-pulse' : ''
                          }`}
                          style={{ width: currentlyPlaying === message.id ? '60%' : '0%' }}
                        />
                      </div>
                    </div>
                    
                    <span className="text-sm text-gray-500 min-w-[2rem]">
                      {formatDuration(message.duration)}
                    </span>
                  </div>
                  
                  {message.castHash && (
                    <div className="mt-2 text-xs text-gray-400">
                      Cast: {message.castHash.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 