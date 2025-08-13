// Cleanup Scheduler for Freq Audio Storage
// Automatically removes expired audio files for enhanced security

export interface CleanupConfig {
  enabled: boolean
  intervalHours: number
  retentionDays: number
  maxStorageGB: number
}

export class CleanupScheduler {
  private config: CleanupConfig
  private intervalId: NodeJS.Timeout | null = null

  constructor(config: CleanupConfig) {
    this.config = config
  }

  // Start the cleanup scheduler
  start() {
    if (!this.config.enabled) {
      console.log('Cleanup scheduler is disabled')
      return
    }

    console.log(`Starting cleanup scheduler - running every ${this.config.intervalHours} hours`)
    
    // Run initial cleanup
    this.performCleanup()
    
    // Schedule periodic cleanup
    this.intervalId = setInterval(() => {
      this.performCleanup()
    }, this.config.intervalHours * 60 * 60 * 1000) // Convert hours to milliseconds
  }

  // Stop the cleanup scheduler
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('Cleanup scheduler stopped')
    }
  }

  // Perform the actual cleanup
  private async performCleanup() {
    try {
      console.log('Starting scheduled cleanup...')
      
      const response = await fetch('/api/audio/cleanup', {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`Cleanup completed: ${result.deletedCount} files deleted`)
      } else {
        console.error('Cleanup failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error during scheduled cleanup:', error)
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const response = await fetch('/api/audio/cleanup')
      
      if (response.ok) {
        return await response.json()
      } else {
        throw new Error('Failed to get storage stats')
      }
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return null
    }
  }
}

// Default cleanup configuration
export const defaultCleanupConfig: CleanupConfig = {
  enabled: true,
  intervalHours: 24, // Run once per day
  retentionDays: 15, // Keep files for 15 days
  maxStorageGB: 10   // Max 10GB storage
}

// Production cleanup configuration
export const productionCleanupConfig: CleanupConfig = {
  enabled: true,
  intervalHours: 6,  // Run every 6 hours for production
  retentionDays: 15, // Keep files for 15 days
  maxStorageGB: 50   // Max 50GB storage
}

// Development cleanup configuration
export const developmentCleanupConfig: CleanupConfig = {
  enabled: false,    // Disabled for development
  intervalHours: 24,
  retentionDays: 15,
  maxStorageGB: 1
}

// Get cleanup config based on environment
export function getCleanupConfig(): CleanupConfig {
  const env = process.env.NODE_ENV || 'development'
  
  if (env === 'production') {
    return productionCleanupConfig
  } else if (env === 'development') {
    return developmentCleanupConfig
  }
  
  return defaultCleanupConfig
}

// Initialize cleanup scheduler
export function initializeCleanupScheduler() {
  const config = getCleanupConfig()
  const scheduler = new CleanupScheduler(config)
  
  if (config.enabled) {
    scheduler.start()
  }
  
  return scheduler
}
