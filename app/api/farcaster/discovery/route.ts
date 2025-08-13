import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('q')
    
    // Return discovery information for Freq mini-app
    const discoveryData = {
      apps: [
        {
          id: 'freq-voice-chat',
          name: 'Freq',
          description: 'Voice messages on Farcaster. Send and receive voice messages with other Farcaster users.',
          url: 'https://freq-bcxg8x5e2-thedude-da236722.vercel.app',
          domain: 'freq.voice',
          icon: '/icon-192.png',
          version: '1.0.0',
          verified: true,
          featured: true,
          categories: ['social', 'communication', 'voice', 'farcaster'],
          tags: ['voice', 'audio', 'messaging', 'farcaster', 'social', 'communication'],
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
          author: {
            name: 'Freq Team',
            url: 'https://freq.voice'
          },
          privacy: {
            dataRetention: '15 days',
            encryption: 'AES-256',
            dataSharing: 'none'
          },
          stats: {
            users: 0, // Will be updated when we have real data
            rating: 5.0,
            reviews: 0
          },
          screenshots: [
            {
              src: '/screenshot-1.png',
              alt: 'Freq voice messaging interface'
            },
            {
              src: '/screenshot-2.png',
              alt: 'Voice message inbox'
            }
          ]
        }
      ],
      total: 1,
      category: category || 'all',
      query: query || ''
    }
    
    // Filter by category if specified
    if (category && category !== 'all') {
      discoveryData.apps = discoveryData.apps.filter(app => 
        app.categories.includes(category)
      )
      discoveryData.total = discoveryData.apps.length
    }
    
    // Filter by query if specified
    if (query) {
      const searchTerm = query.toLowerCase()
      discoveryData.apps = discoveryData.apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) ||
        app.description.toLowerCase().includes(searchTerm) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      discoveryData.total = discoveryData.apps.length
    }
    
    return NextResponse.json(discoveryData)
    
  } catch (error) {
    console.error('Error in Farcaster mini-app discovery:', error)
    return NextResponse.json(
      { error: 'Failed to discover mini-apps' },
      { status: 500 }
    )
  }
}




