import { NextRequest, NextResponse } from 'next/server'
import { readFile, unlink, readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const { id } = params
    
    // Validate audio ID
    if (!id || !id.startsWith('audio_')) {
      return NextResponse.json(
        { error: 'Invalid audio ID' },
        { status: 400 }
      )
    }
    
    // Check if audio file exists
    const uploadsDir = join(process.cwd(), 'uploads')
    const audioPath = join(uploadsDir, `${id}.webm`)
    const metadataPath = join(uploadsDir, `${id}.json`)
    
    if (!existsSync(audioPath)) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      )
    }
    
    // Check if metadata exists and read expiration
    if (existsSync(metadataPath)) {
      try {
        const metadataContent = await readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent)
        
        // Check if file has expired
        if (metadata.expiresAt) {
          const expirationDate = new Date(metadata.expiresAt)
          const now = new Date()
          
          if (now > expirationDate) {
            // File has expired, delete it
            try {
              await unlink(audioPath)
              await unlink(metadataPath)
            } catch (deleteError) {
              console.error('Error deleting expired file:', deleteError)
            }
            
            return NextResponse.json(
              { error: 'Audio file has expired and been deleted' },
              { status: 410 } // Gone
            )
          }
        }
      } catch (metadataError) {
        console.error('Error reading metadata:', metadataError)
        // Continue without expiration check if metadata is corrupted
      }
    }
    
    // Read the encrypted audio file
    const audioBuffer = await readFile(audioPath)
    
    // Return the encrypted audio file
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${id}.webm"`,
        'Cache-Control': 'private, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Error downloading audio:', error)
    return NextResponse.json(
      { error: 'Failed to download audio' },
      { status: 500 }
    )
  }
}

// Cleanup expired files (can be called periodically)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const { id } = params
    
    const uploadsDir = join(process.cwd(), 'uploads')
    const audioPath = join(uploadsDir, `${id}.webm`)
    const metadataPath = join(uploadsDir, `${id}.json`)
    
    // Delete both audio and metadata files
    if (existsSync(audioPath)) {
      await unlink(audioPath)
    }
    
    if (existsSync(metadataPath)) {
      await unlink(metadataPath)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Audio file deleted'
    })
    
  } catch (error) {
    console.error('Error deleting audio:', error)
    return NextResponse.json(
      { error: 'Failed to delete audio' },
      { status: 500 }
    )
  }
}
