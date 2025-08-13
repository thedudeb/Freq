import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'uploads')
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        message: 'No uploads directory found',
        deletedCount: 0
      })
    }
    
    // Read all files in uploads directory
    const files = await readdir(uploadsDir)
    const metadataFiles = files.filter(file => file.endsWith('.json'))
    
    let deletedCount = 0
    const now = new Date()
    
    // Check each metadata file for expiration
    for (const metadataFile of metadataFiles) {
      try {
        const metadataPath = join(uploadsDir, metadataFile)
        const metadataContent = await readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent)
        
        // Check if file has expired
        if (metadata.expiresAt) {
          const expirationDate = new Date(metadata.expiresAt)
          
          if (now > expirationDate) {
            // File has expired, delete both audio and metadata
            const audioId = metadata.id || metadataFile.replace('.json', '')
            const audioPath = join(uploadsDir, `${audioId}.webm`)
            
            // Delete audio file if it exists
            if (existsSync(audioPath)) {
              await unlink(audioPath)
            }
            
            // Delete metadata file
            await unlink(metadataPath)
            
            deletedCount++
            console.log(`Deleted expired audio file: ${audioId}`)
          }
        }
      } catch (error) {
        console.error(`Error processing metadata file ${metadataFile}:`, error)
        // Continue with other files
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} expired files.`,
      deletedCount,
      timestamp: now.toISOString()
    })
    
  } catch (error) {
    console.error('Error during cleanup:', error)
    return NextResponse.json(
      { error: 'Failed to perform cleanup' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'uploads')
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        totalFiles: 0,
        expiredFiles: 0,
        storageSize: 0
      })
    }
    
    // Read all files in uploads directory
    const files = await readdir(uploadsDir)
    const metadataFiles = files.filter(file => file.endsWith('.json'))
    
    let expiredFiles = 0
    let totalSize = 0
    const now = new Date()
    
    // Check each metadata file for expiration
    for (const metadataFile of metadataFiles) {
      try {
        const metadataPath = join(uploadsDir, metadataFile)
        const metadataContent = await readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent)
        
        // Get file size
        const fileStats = await stat(metadataPath)
        totalSize += fileStats.size
        
        // Check if file has expired
        if (metadata.expiresAt) {
          const expirationDate = new Date(metadata.expiresAt)
          
          if (now > expirationDate) {
            expiredFiles++
          }
        }
        
        // Add audio file size if it exists
        const audioId = metadata.id || metadataFile.replace('.json', '')
        const audioPath = join(uploadsDir, `${audioId}.webm`)
        
        if (existsSync(audioPath)) {
          const audioStats = await stat(audioPath)
          totalSize += audioStats.size
        }
      } catch (error) {
        console.error(`Error processing metadata file ${metadataFile}:`, error)
      }
    }
    
    return NextResponse.json({
      totalFiles: metadataFiles.length,
      expiredFiles,
      storageSize: totalSize,
      storageSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      timestamp: now.toISOString()
    })
    
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return NextResponse.json(
      { error: 'Failed to get storage stats' },
      { status: 500 }
    )
  }
}
