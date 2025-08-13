// Audio Storage Service for Freq
// Provides multiple storage options with different privacy levels

export interface AudioStorageConfig {
  type: 'encrypted-ipfs' | 'centralized' | 'local-encrypted' | 'shared-encrypted'
  encryptionKey?: string
  apiEndpoint?: string
  ipfsGateway?: string
}

export interface AudioMetadata {
  id: string
  duration: number
  format: string
  size: number
  timestamp: Date
  senderFid: number
  recipientFid: number
  encrypted: boolean
  storageType: string
  accessKey?: string // For sharing encrypted content
}

// Shared Encrypted Storage (Recommended for Production)
export class SharedEncryptedStorage {
  private encryptionKey: string
  private apiEndpoint: string

  constructor(encryptionKey: string, apiEndpoint: string) {
    this.encryptionKey = encryptionKey
    this.apiEndpoint = apiEndpoint
  }

  async uploadAudio(audioBlob: Blob, metadata: Omit<AudioMetadata, 'id' | 'encrypted' | 'storageType' | 'accessKey'>): Promise<{ url: string; metadata: AudioMetadata; accessKey: string }> {
    try {
      // Generate a unique access key for this audio
      const accessKey = this.generateAccessKey()
      
      // Encrypt the audio data
      const encryptedAudio = await this.encryptAudio(audioBlob, accessKey)
      
      // Upload to centralized storage
      const formData = new FormData()
      formData.append('audio', encryptedAudio, 'encrypted-audio.webm')
      formData.append('metadata', JSON.stringify({
        ...metadata,
        accessKey,
        encrypted: true
      }))
      
      const response = await fetch(`${this.apiEndpoint}/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload audio')
      }
      
      const result = await response.json()
      
      const audioMetadata: AudioMetadata = {
        ...metadata,
        id: result.id,
        encrypted: true,
        storageType: 'shared-encrypted',
        accessKey
      }
      
      return {
        url: result.url,
        metadata: audioMetadata,
        accessKey
      }
    } catch (error) {
      console.error('Error uploading shared encrypted audio:', error)
      throw error
    }
  }

  async downloadAudio(url: string, accessKey: string): Promise<Blob> {
    try {
      const response = await fetch(url)
      const encryptedBlob = await response.blob()
      
      // Decrypt the audio data using the access key
      const decryptedAudio = await this.decryptAudio(encryptedBlob, accessKey)
      return decryptedAudio
    } catch (error) {
      console.error('Error downloading shared encrypted audio:', error)
      throw error
    }
  }

  private generateAccessKey(): string {
    // Generate a secure random key for this audio file
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  private async encryptAudio(audioBlob: Blob, accessKey: string): Promise<Blob> {
    const arrayBuffer = await audioBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use the access key for encryption
    const keyBytes = new TextEncoder().encode(accessKey)
    const encrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      encrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([encrypted], { type: 'application/octet-stream' })
  }

  private async decryptAudio(encryptedBlob: Blob, accessKey: string): Promise<Blob> {
    const arrayBuffer = await encryptedBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use the access key for decryption
    const keyBytes = new TextEncoder().encode(accessKey)
    const decrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      decrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([decrypted], { type: 'audio/webm' })
  }
}

// Encrypted IPFS Storage with Key Sharing
export class EncryptedIPFSStorage {
  private encryptionKey: string
  private ipfsGateway: string

  constructor(encryptionKey: string, ipfsGateway: string = 'https://ipfs.io/ipfs/') {
    this.encryptionKey = encryptionKey
    this.ipfsGateway = ipfsGateway
  }

  async uploadAudio(audioBlob: Blob, metadata: Omit<AudioMetadata, 'id' | 'encrypted' | 'storageType'>): Promise<{ url: string; metadata: AudioMetadata; accessKey: string }> {
    try {
      // Generate a unique access key for this audio
      const accessKey = this.generateAccessKey()
      
      // Encrypt the audio data with the access key
      const encryptedAudio = await this.encryptAudio(audioBlob, accessKey)
      
      // Upload encrypted audio to IPFS
      const formData = new FormData()
      formData.append('file', encryptedAudio, 'encrypted-audio.webm')
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }
      
      const result = await response.json()
      const ipfsHash = result.IpfsHash
      
      const audioMetadata: AudioMetadata = {
        ...metadata,
        id: `encrypted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        encrypted: true,
        storageType: 'encrypted-ipfs',
        accessKey
      }
      
      return {
        url: `${this.ipfsGateway}${ipfsHash}`,
        metadata: audioMetadata,
        accessKey
      }
    } catch (error) {
      console.error('Error uploading encrypted audio to IPFS:', error)
      throw error
    }
  }

  async downloadAudio(url: string, accessKey: string): Promise<Blob> {
    try {
      const response = await fetch(url)
      const encryptedBlob = await response.blob()
      
      // Decrypt the audio data using the access key
      const decryptedAudio = await this.decryptAudio(encryptedBlob, accessKey)
      return decryptedAudio
    } catch (error) {
      console.error('Error downloading encrypted audio:', error)
      throw error
    }
  }

  private generateAccessKey(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  private async encryptAudio(audioBlob: Blob, accessKey: string): Promise<Blob> {
    const arrayBuffer = await audioBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use the access key for encryption
    const keyBytes = new TextEncoder().encode(accessKey)
    const encrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      encrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([encrypted], { type: 'application/octet-stream' })
  }

  private async decryptAudio(encryptedBlob: Blob, accessKey: string): Promise<Blob> {
    const arrayBuffer = await encryptedBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use the access key for decryption
    const keyBytes = new TextEncoder().encode(accessKey)
    const decrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      decrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([decrypted], { type: 'audio/webm' })
  }
}

// Centralized Storage (Recommended for Production)
export class CentralizedStorage {
  private apiEndpoint: string

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint
  }

  async uploadAudio(audioBlob: Blob, metadata: Omit<AudioMetadata, 'id' | 'encrypted' | 'storageType'>): Promise<{ url: string; metadata: AudioMetadata }> {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'voice-message.webm')
      formData.append('metadata', JSON.stringify(metadata))
      
      const response = await fetch(`${this.apiEndpoint}/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload audio')
      }
      
      const result = await response.json()
      
      const audioMetadata: AudioMetadata = {
        ...metadata,
        id: result.id,
        encrypted: false,
        storageType: 'centralized'
      }
      
      return {
        url: result.url,
        metadata: audioMetadata
      }
    } catch (error) {
      console.error('Error uploading audio to centralized storage:', error)
      throw error
    }
  }

  async downloadAudio(url: string): Promise<Blob> {
    try {
      const response = await fetch(url)
      return await response.blob()
    } catch (error) {
      console.error('Error downloading audio:', error)
      throw error
    }
  }
}

// Local Encrypted Storage (for development/testing only)
export class LocalEncryptedStorage {
  private encryptionKey: string

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey
  }

  async uploadAudio(audioBlob: Blob, metadata: Omit<AudioMetadata, 'id' | 'encrypted' | 'storageType'>): Promise<{ url: string; metadata: AudioMetadata }> {
    try {
      // For local storage, we'll store in localStorage (encrypted)
      const encryptedAudio = await this.encryptAudio(audioBlob)
      const audioId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Convert to base64 for localStorage
      const base64 = await this.blobToBase64(encryptedAudio)
      localStorage.setItem(`audio_${audioId}`, base64)
      
      const audioMetadata: AudioMetadata = {
        ...metadata,
        id: audioId,
        encrypted: true,
        storageType: 'local-encrypted'
      }
      
      return {
        url: `local://${audioId}`,
        metadata: audioMetadata
      }
    } catch (error) {
      console.error('Error storing audio locally:', error)
      throw error
    }
  }

  async downloadAudio(url: string): Promise<Blob> {
    try {
      const audioId = url.replace('local://', '')
      const base64 = localStorage.getItem(`audio_${audioId}`)
      
      if (!base64) {
        throw new Error('Audio not found in local storage')
      }
      
      const encryptedBlob = await this.base64ToBlob(base64)
      const decryptedAudio = await this.decryptAudio(encryptedBlob)
      return decryptedAudio
    } catch (error) {
      console.error('Error retrieving audio from local storage:', error)
      throw error
    }
  }

  private async encryptAudio(audioBlob: Blob): Promise<Blob> {
    const arrayBuffer = await audioBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const keyBytes = new TextEncoder().encode(this.encryptionKey)
    const encrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      encrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([encrypted], { type: 'application/octet-stream' })
  }

  private async decryptAudio(encryptedBlob: Blob): Promise<Blob> {
    const arrayBuffer = await encryptedBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const keyBytes = new TextEncoder().encode(this.encryptionKey)
    const decrypted = new Uint8Array(uint8Array.length)
    
    for (let i = 0; i < uint8Array.length; i++) {
      decrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new Blob([decrypted], { type: 'audio/webm' })
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  private async base64ToBlob(base64: string): Promise<Blob> {
    const response = await fetch(base64)
    return await response.blob()
  }
}

// Audio Storage Factory
export class AudioStorageFactory {
  static createStorage(config: AudioStorageConfig) {
    switch (config.type) {
      case 'shared-encrypted':
        if (!config.encryptionKey || !config.apiEndpoint) {
          throw new Error('Encryption key and API endpoint required for shared encrypted storage')
        }
        return new SharedEncryptedStorage(config.encryptionKey, config.apiEndpoint)
      
      case 'encrypted-ipfs':
        if (!config.encryptionKey) {
          throw new Error('Encryption key required for encrypted IPFS storage')
        }
        return new EncryptedIPFSStorage(config.encryptionKey, config.ipfsGateway)
      
      case 'centralized':
        if (!config.apiEndpoint) {
          throw new Error('API endpoint required for centralized storage')
        }
        return new CentralizedStorage(config.apiEndpoint)
      
      case 'local-encrypted':
        if (!config.encryptionKey) {
          throw new Error('Encryption key required for local encrypted storage')
        }
        return new LocalEncryptedStorage(config.encryptionKey)
      
      default:
        throw new Error(`Unknown storage type: ${config.type}`)
    }
  }
}

// Import the new configuration system
import { getAudioStorageConfig } from './audio-config'

// Default storage configuration (for development)
export const defaultAudioStorageConfig: AudioStorageConfig = getAudioStorageConfig()

// Production storage configuration
export const productionAudioStorageConfig: AudioStorageConfig = getAudioStorageConfig()
