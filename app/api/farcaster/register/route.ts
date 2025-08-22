import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return the mini-app registration information
    return NextResponse.json({
      name: 'Freq',
      description: 'Voice messages on Farcaster. Send and receive voice messages with other Farcaster users.',
      url: 'https://freq-bcxg8x5e2-thedude-da236722.vercel.app',
      domain: 'freq.voice',
      version: '1.0.0',
      verified: true,
      permissions: [
        'user:read',
        'cast:read',
        'cast:write',
        'reaction:read',
        'reaction:write',
        'follow:read',
        'follow:write'
      ],
      features: [
        'voice-messaging',
        'real-time-audio',
        'encrypted-storage',
        'auto-expiration',
        'farcaster-auth',
        'notifications'
      ],
      categories: [
        'social',
        'communication',
        'voice',
        'farcaster'
      ],
      author: {
        name: 'Freq Team',
        url: 'https://freq.voice'
      },
      privacy: {
        dataRetention: '15 days',
        encryption: 'AES-256',
        dataSharing: 'none'
      },
      support: {
        url: 'https://freq.voice/support',
        email: 'support@freq.voice'
      }
    })
    
  } catch (error) {
    console.error('Error in Farcaster mini-app registration:', error)
    return NextResponse.json(
      { error: 'Failed to register mini-app' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle mini-app registration requests
    console.log('Farcaster mini-app registration request:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Freq mini-app registered successfully',
      appId: 'freq-voice-chat',
      status: 'active'
    })
    
  } catch (error) {
    console.error('Error in Farcaster mini-app registration:', error)
    return NextResponse.json(
      { error: 'Failed to register mini-app' },
      { status: 500 }
    )
  }
}








