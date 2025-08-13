'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { 
  AuthKitProvider, 
  SignInButton, 
  useProfile, 
  useSignIn 
} from '@farcaster/auth-kit'
import { farcasterConfig } from '../lib/farcaster'

interface FarcasterAuthProps {
  onAuthenticated: (user: any) => void
}

function FarcasterAuthInner({ onAuthenticated }: FarcasterAuthProps) {
  const { isAuthenticated, profile } = useProfile()
  const { signIn, signOut, isConnected } = useSignIn({
    onSuccess: (res) => {
      console.log('Farcaster authentication successful:', res)
    },
    onError: (error) => {
      console.error('Farcaster authentication error:', error)
    }
  })

  const [showTestingMode, setShowTestingMode] = useState(false)

  useEffect(() => {
    if (isAuthenticated && profile) {
      const user = {
        id: profile.fid?.toString() || 'unknown',
        username: profile.username || 'unknown',
        displayName: profile.displayName || profile.username || 'Unknown User',
        avatar: profile.pfpUrl || `https://picsum.photos/200/200?random=${profile.fid}`,
        fid: profile.fid
      }
      onAuthenticated(user)
    }
  }, [isAuthenticated, profile, onAuthenticated])

  const handleTestingMode = () => {
    // Create a test user for development
    const testUser = {
      id: 'test-user',
      username: 'test.user',
      displayName: 'Test User',
      avatar: 'https://picsum.photos/200/200?random=999',
      fid: 99999
    }
    onAuthenticated(testUser)
  }

  return (
    <div className="space-y-4">
      <SignInButton />
      
      {isConnected && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Connected to Farcaster</p>
          <Button
            onClick={signOut}
            variant="secondary"
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <Button
        onClick={handleTestingMode}
        variant="secondary"
        className="w-full"
      >
        Test Mode (Skip Auth)
      </Button>
      
      <div className="text-xs text-gray-400 text-center bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Development Mode</p>
        <p>Use "Test Mode" to test real Farcaster user search without authentication.</p>
        <p className="mt-1 text-gray-500">Real auth requires HTTPS and proper domain setup.</p>
      </div>
    </div>
  )
}

export default function FarcasterAuth({ onAuthenticated }: FarcasterAuthProps) {
  return (
    <AuthKitProvider config={farcasterConfig}>
      <FarcasterAuthInner onAuthenticated={onAuthenticated} />
    </AuthKitProvider>
  )
} 