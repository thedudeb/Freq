import { NextRequest, NextResponse } from 'next/server'

// Mock audio data for development/testing
const mockAudioData = {
  '1': {
    duration: 15,
    format: 'audio/webm',
    size: 1024000, // 1MB
    content: 'mock-audio-1-content'
  },
  '2': {
    duration: 8,
    format: 'audio/webm', 
    size: 512000, // 512KB
    content: 'mock-audio-2-content'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Check if mock audio exists
    if (!mockAudioData[id as keyof typeof mockAudioData]) {
      return NextResponse.json(
        { error: 'Mock audio not found' },
        { status: 404 }
      )
    }
    
    // Create a mock audio blob (simulated audio data)
    const mockAudio = mockAudioData[id as keyof typeof mockAudioData]
    const audioBlob = new Blob([mockAudio.content], { type: mockAudio.format })
    
    // Return the mock audio file
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': mockAudio.format,
        'Content-Length': mockAudio.size.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Error serving mock audio:', error)
    return NextResponse.json(
      { error: 'Failed to serve mock audio' },
      { status: 500 }
    )
  }
}
