// Audio Storage Configuration for Freq
// Easy switching between different storage types

export interface AudioStorageConfig {
  type: 'encrypted-ipfs' | 'centralized' | 'local-encrypted' | 'shared-encrypted'
  encryptionKey?: string
  apiEndpoint?: string
  ipfsGateway?: string
}

// 🎯 CHOOSE YOUR STORAGE TYPE HERE
// Uncomment the configuration you want to use:

// ========================================
// OPTION 1: SHARED ENCRYPTED (RECOMMENDED)
// ========================================
// Best for: Maximum privacy and control
// Privacy: 🔒 High - Encrypted with unique access keys + 15-day auto-expiration
// Control: ✅ Full - Your server, your rules
// Cost: 💰 Server costs
// Security: 🛡️ Auto-deletion after 15 days for ultimate safety
// Note: Vercel has 4MB file size limit
export const SHARED_ENCRYPTED_CONFIG: AudioStorageConfig = {
  type: 'shared-encrypted',
  encryptionKey: process.env.NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY || 'freq-prod-key-2024',
  apiEndpoint: process.env.NEXT_PUBLIC_AUDIO_API_ENDPOINT || 'https://your-app.vercel.app/api/audio'
}

// ========================================
// OPTION 2: CENTRALIZED STORAGE
// ========================================
// Best for: Simple setup, server control
// Privacy: 🔒 Medium - Server-side encryption
// Control: ✅ Full - Your server
// Cost: 💰 Server costs
export const CENTRALIZED_CONFIG: AudioStorageConfig = {
  type: 'centralized',
  apiEndpoint: process.env.NEXT_PUBLIC_AUDIO_API_ENDPOINT || 'https://api.freq.voice'
}

// ========================================
// OPTION 3: ENCRYPTED IPFS
// ========================================
// Best for: Decentralized but still private
// Privacy: 🔒 Medium - Client-side encryption
// Control: 🟡 Partial - Decentralized storage
// Cost: 💰 IPFS costs (Pinata, etc.)
export const ENCRYPTED_IPFS_CONFIG: AudioStorageConfig = {
  type: 'encrypted-ipfs',
  encryptionKey: process.env.NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY || 'freq-prod-key-2024',
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'
}

// ========================================
// OPTION 4: LOCAL ENCRYPTED (DEV ONLY)
// ========================================
// Best for: Development and testing
// Privacy: 🔒 High - Local browser storage
// Control: ✅ Full - Only you can access
// Cost: 💰 Free
export const LOCAL_ENCRYPTED_CONFIG: AudioStorageConfig = {
  type: 'local-encrypted',
  encryptionKey: process.env.NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY || 'freq-dev-key-2024'
}

// 🚀 ACTIVE CONFIGURATION
// Change this line to switch storage types:
export const ACTIVE_AUDIO_CONFIG = SHARED_ENCRYPTED_CONFIG

// Alternative configurations (uncomment to use):
// export const ACTIVE_AUDIO_CONFIG = CENTRALIZED_CONFIG
// export const ACTIVE_AUDIO_CONFIG = ENCRYPTED_IPFS_CONFIG
// export const ACTIVE_AUDIO_CONFIG = LOCAL_ENCRYPTED_CONFIG

// Environment variable override
export function getAudioStorageConfig(): AudioStorageConfig {
  const envType = process.env.NEXT_PUBLIC_AUDIO_STORAGE_TYPE
  
  if (envType === 'shared-encrypted') {
    return SHARED_ENCRYPTED_CONFIG
  } else if (envType === 'centralized') {
    return CENTRALIZED_CONFIG
  } else if (envType === 'encrypted-ipfs') {
    return ENCRYPTED_IPFS_CONFIG
  } else if (envType === 'local-encrypted') {
    return LOCAL_ENCRYPTED_CONFIG
  }
  
  // Default to active config
  return ACTIVE_AUDIO_CONFIG
}
