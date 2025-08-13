import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
    
    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      )
    }
    
    // In production, this would fetch notifications from Farcaster Hub
    // For now, return mock notifications
    const mockNotifications = [
      {
        id: '1',
        type: 'voice_message',
        sender: {
          fid: 2,
          username: 'dwr',
          displayName: 'Dan Romero'
        },
        content: 'Voice message received',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false
      },
      {
        id: '2', 
        type: 'mention',
        sender: {
          fid: 3,
          username: 'vbuterin',
          displayName: 'Vitalik Buterin'
        },
        content: 'Mentioned you in a cast',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: false
      }
    ]
    
    return NextResponse.json({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length
    })
    
  } catch (error) {
    console.error('Error fetching Farcaster notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
