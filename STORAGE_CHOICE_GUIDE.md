# 🎯 Audio Storage Choice Guide for Freq

## Quick Decision Matrix

| Storage Type | Privacy | Control | Cost | Setup | Best For |
|-------------|---------|---------|------|-------|----------|
| **Shared Encrypted** | 🔒 High | ✅ Full | 💰 Server | 🟡 Medium | **Production (Recommended)** |
| **Centralized** | 🔒 Medium | ✅ Full | 💰 Server | 🟢 Easy | Simple setup |
| **Encrypted IPFS** | 🔒 Medium | 🟡 Partial | 💰 IPFS | 🟡 Medium | Decentralized |
| **Local Encrypted** | 🔒 High | ✅ Full | 💰 Free | 🟢 Easy | Development only |

---

## 🚀 How to Choose Your Storage Type

### **Step 1: Edit the Configuration File**

Open `lib/audio-config.ts` and change this line:

```typescript
// Change this line to switch storage types:
export const ACTIVE_AUDIO_CONFIG = SHARED_ENCRYPTED_CONFIG
```

### **Step 2: Choose Your Option**

#### **Option 1: Shared Encrypted (Recommended for Production)**
```typescript
export const ACTIVE_AUDIO_CONFIG = SHARED_ENCRYPTED_CONFIG
```
**Why choose this?**
- ✅ Maximum privacy (unique encryption keys per message)
- ✅ Full control over your data
- ✅ Professional-grade security
- ✅ Perfect for production apps
- 🛡️ **15-day auto-expiration** for ultimate safety
- 🧹 **Automatic cleanup** of expired files

**Environment variables needed:**
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice
```

---

#### **Option 2: Centralized Storage (Simple Setup)**
```typescript
export const ACTIVE_AUDIO_CONFIG = CENTRALIZED_CONFIG
```
**Why choose this?**
- ✅ Easy to set up
- ✅ Full server control
- ✅ Good for small to medium apps
- ✅ Lower complexity

**Environment variables needed:**
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=centralized
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice
```

---

#### **Option 3: Encrypted IPFS (Decentralized)**
```typescript
export const ACTIVE_AUDIO_CONFIG = ENCRYPTED_IPFS_CONFIG
```
**Why choose this?**
- ✅ Decentralized storage
- ✅ Still encrypted for privacy
- ✅ Good for Web3 apps
- ✅ Censorship resistant

**Environment variables needed:**
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=encrypted-ipfs
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt-token
```

---

#### **Option 4: Local Encrypted (Development Only)**
```typescript
export const ACTIVE_AUDIO_CONFIG = LOCAL_ENCRYPTED_CONFIG
```
**Why choose this?**
- ✅ Perfect for development
- ✅ No server needed
- ✅ Free to use
- ❌ Not for production (data lost when browser clears)

**Environment variables needed:**
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=local-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=dev-key-2024
```

---

## 🔧 Environment Variable Setup

### **For Vercel Deployment:**

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```env
# Choose your storage type
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted

# Encryption key (generate a secure 32-character key)
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-super-secure-encryption-key-2024

# API endpoint (your server URL)
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice

# For IPFS (if using encrypted-ipfs)
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt-token
```

### **For Local Development:**

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=local-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=dev-key-2024
```

---

## 🎯 **Recommendation for Production**

**Use Shared Encrypted Storage** because:

1. **Maximum Privacy**: Each voice message gets a unique encryption key
2. **Full Control**: Your server, your rules, your data
3. **Professional**: Enterprise-grade security
4. **Scalable**: Works for any app size
5. **🛡️ Ultimate Safety**: 15-day auto-expiration with automatic cleanup
6. **🧹 Storage Management**: Automatic deletion of expired files

**Setup:**
```typescript
// In lib/audio-config.ts
export const ACTIVE_AUDIO_CONFIG = SHARED_ENCRYPTED_CONFIG
```

```env
# Environment variables
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=generate-a-secure-32-char-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice
```

---

## 🛡️ **15-Day Auto-Expiration Feature**

Your Freq app now includes **automatic 15-day expiration** for all voice messages:

### **How It Works:**
- ✅ **Automatic Expiration**: All audio files expire after 15 days
- ✅ **Secure Deletion**: Files are automatically deleted when accessed after expiration
- ✅ **Storage Cleanup**: Periodic cleanup removes expired files
- ✅ **No Manual Work**: Completely automated for your convenience

### **Security Benefits:**
- 🔒 **Reduced Risk**: Old messages can't be accessed after 15 days
- 🧹 **Storage Management**: Automatic cleanup prevents storage bloat
- 🛡️ **Compliance**: Helps meet data retention requirements
- 💰 **Cost Control**: Prevents unlimited storage growth

### **Cleanup Schedule:**
- **Development**: Cleanup disabled (for testing)
- **Production**: Runs every 6 hours automatically
- **Manual**: Call `/api/audio/cleanup` anytime

---

## 🔐 **Security Best Practices**

1. **Generate a strong encryption key** (32+ characters, random)
2. **Use HTTPS** for all API endpoints
3. **Rotate keys** periodically in production
4. **Monitor access logs** for suspicious activity
5. **Backup encryption keys** securely
6. **Leverage auto-expiration** for enhanced security

---

## 🚀 **Quick Start**

1. **Choose your storage type** in `lib/audio-config.ts`
2. **Set environment variables** for your deployment platform
3. **Deploy your app** - it will automatically use your chosen storage
4. **Test voice messages** to ensure everything works

**That's it!** Your Freq app will now use your chosen audio storage system. 🎤✨
