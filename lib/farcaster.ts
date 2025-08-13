// Farcaster configuration for production
export const farcasterConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_FARCASTER_RPC_URL || 'https://mainnet.optimism.io',
  domain: process.env.NEXT_PUBLIC_FARCASTER_DOMAIN || 'freq.voice',
  siweUri: process.env.NEXT_PUBLIC_FARCASTER_SIWE_URI || 'https://freq.voice',
  hubUrl: process.env.NEXT_PUBLIC_FARCASTER_HUB_URL || 'https://hub.farcaster.xyz',
}

export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  avatar: string
  bio?: string
  followersCount?: number
  followingCount?: number
}

export interface VoiceMessage {
  id: string
  sender: FarcasterUser
  recipient: FarcasterUser
  audioUrl: string
  duration: number
  timestamp: Date
  castHash?: string
  accessKey?: string // For encrypted audio access
}

// Search for Farcaster users using Hub REST API
export async function searchUsers(query: string): Promise<FarcasterUser[]> {
  try {
    if (query.length < 2) return []
    
    // For development/testing, return some real Farcaster users
    // In production, this would use the actual Hub API
    const mockRealUsers: FarcasterUser[] = [
      { 
        fid: 194, 
        username: 'dwr', 
        displayName: 'Dan Romero', 
        avatar: 'https://picsum.photos/200/200?random=194',
        bio: 'Founder of Farcaster',
        followersCount: 50000,
        followingCount: 1000
      },
      { 
        fid: 2, 
        username: 'vbuterin', 
        displayName: 'Vitalik Buterin', 
        avatar: 'https://picsum.photos/200/200?random=2',
        bio: 'Ethereum co-founder',
        followersCount: 100000,
        followingCount: 500
      },
      { 
        fid: 3, 
        username: 'dankrad', 
        displayName: 'Dankrad Feist', 
        avatar: 'https://picsum.photos/200/200?random=3',
        bio: 'Ethereum researcher',
        followersCount: 25000,
        followingCount: 800
      }
    ]
    
    // Filter users based on search query
    const filteredUsers = mockRealUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase())
    )
    
    return filteredUsers
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

// Get user info by FID using Hub REST API
export async function getUserByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(`${farcasterConfig.hubUrl}/v1/userInfo?fid=${fid}`)
    
    if (response.ok) {
      const user = await response.json()
      if (user && user.data) {
        return {
          fid: user.data.fid,
          username: user.data.username || '',
          displayName: user.data.displayName || '',
          avatar: user.data.pfp?.url || `https://picsum.photos/200/200?random=${user.data.fid}`,
          bio: user.data.bio?.text,
          followersCount: user.data.followerCount,
          followingCount: user.data.followingCount,
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Send a voice message as a cast
export async function sendVoiceMessage(
  senderFid: number,
  recipientFid: number,
  audioUrl: string,
  duration: number,
  signer: any
): Promise<string | null> {
  try {
    // Create a cast with the voice message
    const castText = `🎤 Voice message for @${recipientFid} (${duration}s)`
    
    // In a real implementation, you would:
    // 1. Upload audio to IPFS or similar storage
    // 2. Create a cast with the audio URL
    // 3. Sign and submit the cast
    
    const cast = {
      text: castText,
      embeds: [{
        url: audioUrl,
        castId: undefined
      }],
      mentions: [recipientFid],
      parentCastId: undefined,
      parentUrl: undefined,
    }
    
    // For now, return a mock cast hash
    const mockCastHash = `0x${Math.random().toString(16).substring(2, 10)}`
    
    console.log('Voice message sent:', {
      senderFid,
      recipientFid,
      audioUrl,
      duration,
      castHash: mockCastHash
    })
    
    return mockCastHash
  } catch (error) {
    console.error('Error sending voice message:', error)
    return null
  }
}

// Get voice messages for a user
export async function getVoiceMessages(userFid: number): Promise<VoiceMessage[]> {
  try {
    // In a real implementation, you would:
    // 1. Query casts mentioning the user
    // 2. Filter for voice messages
    // 3. Parse audio URLs and metadata
    
    // For now, return mock data
    const mockMessages: VoiceMessage[] = [
      {
        id: '1',
        sender: {
          username: 'bob.freq',
          displayName: 'Bob',
          avatar: 'https://picsum.photos/200/200?random=2',
          fid: 23456
        },
        recipient: {
          fid: userFid,
          username: 'alice.freq',
          displayName: 'Alice',
          avatar: 'https://picsum.photos/200/200?random=1',
        },
        audioUrl: '/api/mock-audio/1',
        duration: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        castHash: '0x1234567890abcdef',
      },
      {
        id: '2',
        sender: {
          username: 'charlie.freq',
          displayName: 'Charlie',
          avatar: 'https://picsum.photos/200/200?random=3',
          fid: 34567
        },
        recipient: {
          fid: userFid,
          username: 'alice.freq',
          displayName: 'Alice',
          avatar: 'https://picsum.photos/200/200?random=1',
        },
        audioUrl: '/api/mock-audio/2',
        duration: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        castHash: '0xabcdef1234567890',
      }
    ]
    
    return mockMessages
  } catch (error) {
    console.error('Error getting voice messages:', error)
    return []
  }
} 