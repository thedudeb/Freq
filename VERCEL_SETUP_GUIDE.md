# 🚀 Vercel Setup Guide for Freq

## 🎯 **Vercel Deployment - Quick & Easy**

Your Freq app is now configured for Vercel deployment with audio storage on the same platform!

---

## ⚠️ **Vercel Limitations & Solutions**

### **File Size Limits:**
- **Maximum File Size**: 4MB per audio file
- **Request/Response**: 4.5MB limit
- **Storage**: Not persistent between deployments

### **Solutions Implemented:**
- ✅ **File Size Validation**: Automatic 4MB limit enforcement
- ✅ **Error Handling**: Clear error messages for oversized files
- ✅ **Graceful Degradation**: App continues working with smaller files
- ✅ **Migration Path**: Easy upgrade to Railway/DigitalOcean later

---

## 🚀 **Deployment Steps**

### **Step 1: Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy your app
vercel

# Follow the prompts to connect your GitHub repo
```

### **Step 2: Set Environment Variables**

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# Audio Storage Configuration
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-app.vercel.app/api/audio

# Farcaster Configuration
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281
NEXT_PUBLIC_FARCASTER_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_FARCASTER_DOMAIN=freq.voice
NEXT_PUBLIC_FARCASTER_SIWE_URI=https://freq.voice
```

### **Step 3: Test Your App**

1. Visit your Vercel URL
2. Enter beta password: `Freq420!`
3. Test voice message recording (keep under 4MB)
4. Verify 15-day expiration works

---

## 📏 **File Size Guidelines**

### **Optimal Voice Message Length:**
- **Duration**: 30 seconds to 2 minutes
- **File Size**: Under 4MB
- **Quality**: Good balance of size vs quality

### **Recording Tips:**
- Use lower bitrate for longer messages
- Keep messages concise
- Test with different lengths

### **If You Need Larger Files:**
The app will show a helpful error message suggesting migration to Railway or DigitalOcean.

---

## 🔒 **Security Features (Unchanged)**

### **All Security Features Work on Vercel:**
- ✅ **Encryption**: Each file has unique encryption key
- ✅ **15-day Expiration**: Automatic deletion after 15 days
- ✅ **Access Control**: Only authorized users can access
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Cleanup**: Automatic file cleanup

**Security is identical** to any other hosting platform!

---

## 🚀 **Quick Start Commands**

```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Test your app
# Go live!
```

---

## 📊 **Vercel vs Other Platforms**

| Feature | Vercel | Railway | DigitalOcean |
|---------|--------|---------|--------------|
| **Setup** | 🟢 Super Easy | 🟡 Easy | 🟡 Medium |
| **File Size** | ❌ 4MB limit | ✅ Unlimited | ✅ Unlimited |
| **Storage** | ❌ Not persistent | ✅ Persistent | ✅ Persistent |
| **Cost** | 💰 $0-20/month | 💰 $5-20/month | 💰 $5-12/month |
| **Performance** | 🟡 Good | 🟢 Excellent | 🟢 Excellent |

---

## 🔄 **Migration Path**

**When you outgrow Vercel's limits:**

1. **Deploy audio server** to Railway/DigitalOcean
2. **Update environment variable**:
   ```env
   NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-railway-app.railway.app/api/audio
   ```
3. **Redeploy** - no code changes needed!

---

## 🎯 **Production Checklist**

### **Before Going Live:**
- ✅ Deploy to Vercel
- ✅ Set environment variables
- ✅ Test voice messages (under 4MB)
- ✅ Verify 15-day expiration
- ✅ Test Farcaster authentication
- ✅ Check notifications work

### **Environment Variables:**
```env
# Required
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-app.vercel.app/api/audio

# Optional (for Farcaster)
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281
NEXT_PUBLIC_FARCASTER_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_FARCASTER_DOMAIN=freq.voice
NEXT_PUBLIC_FARCASTER_SIWE_URI=https://freq.voice
```

---

## 🚀 **Deploy Now!**

```bash
# Deploy to Vercel
vercel

# Your app will be live at: https://your-app.vercel.app
# Audio storage will work with 4MB file limit
# All security features enabled
# 15-day auto-expiration active
```

**Your Freq app is ready for Vercel deployment!** 🎤✨

**Security**: ✅ Unchanged - all encryption and expiration features work
**File Size**: ⚠️ 4MB limit - upgrade to Railway later if needed
**Cost**: 💰 $0-20/month - perfect for getting started
