import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Vercel has a 4.5MB limit, so we need to handle this
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB limit for Vercel

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as File
    const metadata = formData.get('metadata') as string

    if (!audio || !metadata) {
      return NextResponse.json(
        { error: 'Audio file and metadata are required' },
        { status: 400 }
      )
    }

    // Check file size
    if (audio.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File too large for Vercel deployment',
          maxSize: '4MB',
          actualSize: `${Math.round(audio.size / 1024 / 1024 * 100) / 100}MB`,
          recommendation: 'Consider using Railway or DigitalOcean for larger files'
        },
        { status: 413 }
      )
    }

    // Parse metadata
    const audioMetadata = JSON.parse(metadata)
    
    // Generate unique ID for the audio file
    const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Calculate expiration date (15 days from now)
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 15)
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save the encrypted audio file
    const audioPath = join(uploadsDir, `${audioId}.webm`)
    const audioBuffer = Buffer.from(await audio.arrayBuffer())
    await writeFile(audioPath, audioBuffer)
    
    // Save metadata with expiration
    const metadataPath = join(uploadsDir, `${audioId}.json`)
    const metadataWithExpiration = {
      ...audioMetadata,
      id: audioId,
      uploadedAt: new Date().toISOString(),
      expiresAt: expirationDate.toISOString(),
      expiresInDays: 15,
      fileSize: audio.size,
      maxFileSize: MAX_FILE_SIZE
    }
    await writeFile(metadataPath, JSON.stringify(metadataWithExpiration, null, 2))
    
    // Return success response with expiration info
    return NextResponse.json({
      id: audioId,
      url: `/api/audio/download/${audioId}`,
      metadata: metadataWithExpiration,
      expiresAt: expirationDate.toISOString(),
      expiresInDays: 15,
      fileSize: audio.size,
      maxFileSize: MAX_FILE_SIZE,
      warning: 'Vercel deployment - files may not persist between deployments'
    })
    
  } catch (error) {
    console.error('Error uploading audio:', error)
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    )
  }
}
