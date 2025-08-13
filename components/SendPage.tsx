'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, Search, User, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { searchUsers, sendVoiceMessage, FarcasterUser } from '../lib/farcaster'
import { createVoiceMessageNotification } from '../lib/farcaster-miniapp-notifications'
import { AudioStorageFactory, defaultAudioStorageConfig } from '../lib/audio-storage'

interface SendPageProps {
  user: any
}

export default function SendPage({ user }: SendPageProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<FarcasterUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FarcasterUser[]>([])
  const [isSending, setIsSending] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchUsers(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addUser = (user: FarcasterUser) => {
    if (!selectedUsers.find(u => u.fid === user.fid)) {
      setSelectedUsers(prev => [...prev, user])
    }
    setSearchQuery('')
    setSearchResults([])
  }

  const removeUser = (fid: number) => {
    setSelectedUsers(prev => prev.filter(u => u.fid !== fid))
  }

  const handleSend = async () => {
    if (!audioBlob || selectedUsers.length === 0 || !user?.fid) return

    setIsSending(true)
    try {
      // Create secure audio storage
      const audioStorage = AudioStorageFactory.createStorage(defaultAudioStorageConfig)
      
      // Upload audio with encryption and sharing
      const uploadResult = await audioStorage.uploadAudio(audioBlob, {
        duration: recordingTime,
        format: 'audio/webm',
        size: audioBlob.size,
        timestamp: new Date(),
        senderFid: user.fid,
        recipientFid: selectedUsers[0].fid, // For now, just use first recipient
      })
      
      console.log('Audio uploaded securely with access key:', (uploadResult as any).accessKey)
      
      // Send to each selected user
      for (const recipient of selectedUsers) {
        const castHash = await sendVoiceMessage(
          user.fid,
          recipient.fid,
          uploadResult.url,
          recordingTime,
          null // signer would be passed here
        )
        
        if (castHash) {
          console.log(`Voice message sent to ${recipient.username}: ${castHash}`)
          
          // Create Farcaster-style voice message notification
          createVoiceMessageNotification(
            user.fid,
            user.username,
            user.displayName,
            user.avatar,
            recipient.fid,
            uploadResult.metadata.id,
            uploadResult.url,
            recordingTime,
            castHash
          )
        }
      }
      
      // Reset form
      setAudioBlob(null)
      setAudioUrl(null)
      setSelectedUsers([])
      setRecordingTime(0)
      
      alert('Voice message sent successfully!')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Send Voice Message</h2>
        
        {/* Recipients */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">To:</label>
          
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedUsers.map(user => (
                <div key={user.fid} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                  <img src={user.avatar} alt={user.displayName} className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium">{user.displayName}</span>
                  <button
                    onClick={() => removeUser(user.fid)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Farcaster users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farcaster-purple focus:border-transparent"
            />
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map(user => (
                <button
                  key={user.fid}
                  onClick={() => addUser(user)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                >
                  <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium text-gray-900">{user.displayName}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                    {user.bio && (
                      <div className="text-xs text-gray-400 truncate">{user.bio}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <div className="text-center py-2">
              <div className="w-4 h-4 border-2 border-farcaster-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          )}
        </div>
      </div>

      {/* Recording Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Voice Message:</label>
        
        {!audioBlob ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-farcaster-purple to-farcaster-pink text-white hover:opacity-90'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>
            
            {isRecording && (
              <div className="text-lg font-semibold text-red-500">
                {formatTime(recordingTime)}
              </div>
            )}
            
            <p className="text-gray-500 mt-2">
              {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center space-x-4">
              <button
                onClick={playRecording}
                className="w-12 h-12 bg-gradient-to-r from-farcaster-purple to-farcaster-pink rounded-full flex items-center justify-center text-white"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full voice-wave rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-sm text-gray-500 mt-1">Recording complete</p>
              </div>
              
              <button
                onClick={() => {
                  setAudioBlob(null)
                  setAudioUrl(null)
                  setRecordingTime(0)
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={!audioBlob || selectedUsers.length === 0 || isSending}
        className="w-full"
      >
        {isSending ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Voice Message</span>
          </div>
        )}
      </Button>
    </div>
  )
} 