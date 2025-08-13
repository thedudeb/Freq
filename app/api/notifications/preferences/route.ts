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
    
    // Return default notification preferences
    return NextResponse.json({
      voiceMessages: true,
      mentions: true,
      reactions: true,
      follows: true,
      casts: false
    })
    
  } catch (error) {
    console.error('Error getting notification preferences:', error)
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fid, preferences } = body
    
    if (!fid || !preferences) {
      return NextResponse.json(
        { error: 'FID and preferences are required' },
        { status: 400 }
      )
    }
    
    // In production, save to database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Preferences updated'
    })
    
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}
