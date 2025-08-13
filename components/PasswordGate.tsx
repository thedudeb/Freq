'use client'

import React, { useState } from 'react'
import { Mic, Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordGateProps {
  onAuthenticated: () => void
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === 'Freq420!') {
      localStorage.setItem('freq-beta-access', 'true')
      onAuthenticated()
    } else {
      setError('Incorrect password')
      setPassword('')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-farcaster-purple to-farcaster-pink">
      <div className="card max-w-md w-full text-center bg-white shadow-xl">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-farcaster-purple to-farcaster-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freq</h1>
          <p className="text-gray-600 mb-4">Voice messages on Farcaster</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Beta Access Required</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter beta password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farcaster-purple focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gradient-to-r from-farcaster-purple to-farcaster-pink text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : 'Enter Beta'}
          </button>
        </form>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>This is a beta version of Freq</p>
          <p>Contact us for access</p>
        </div>
      </div>
    </div>
  )
}
