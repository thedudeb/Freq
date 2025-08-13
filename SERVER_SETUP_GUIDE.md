# 🏠 Server Setup Guide for Freq

## 🎯 **Current Status**

Your Freq app is ready for deployment, but you need to choose where to host the audio storage server.

---

## 🚀 **Server Options**

### **Option 1: Vercel (Same as App) - Easiest**
**Best for**: Quick deployment, small scale

```env
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-app.vercel.app/api/audio
```

**Setup**: 
1. Deploy to Vercel
2. Use the same domain for audio storage
3. Files stored in Vercel's file system

**Limitations**: 
- Storage limited to Vercel's file system
- Files may not persist between deployments
- Not ideal for production scale

---

### **Option 2: Dedicated Server - Recommended**
**Best for**: Production, full control

```env
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice
```

**Setup Options**:

#### **A. Railway (Recommended)**
```bash
# Deploy audio server to Railway
railway login
railway init
railway up
```

#### **B. DigitalOcean App Platform**
```bash
# Deploy to DigitalOcean
doctl apps create --spec app.yaml
```

#### **C. Heroku**
```bash
# Deploy to Heroku
heroku create freq-audio-server
git push heroku main
```

#### **D. AWS EC2**
```bash
# Deploy to AWS EC2
aws ec2 run-instances --image-id ami-12345678 --instance-type t3.micro
```

---

### **Option 3: Cloud Storage - Scalable**
**Best for**: Large scale, cost-effective

```env
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-bucket.s3.amazonaws.com
```

**Options**:
- **AWS S3**: Most popular, reliable
- **Google Cloud Storage**: Good integration
- **Azure Blob Storage**: Microsoft ecosystem
- **Cloudflare R2**: Cost-effective alternative

---

## 🎯 **Recommended Setup for Production**

### **Step 1: Choose Your Server**

**For Quick Start**: Use Vercel (same as your app)
**For Production**: Use Railway or DigitalOcean

### **Step 2: Set Environment Variables**

#### **Vercel Deployment**:
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-app.vercel.app/api/audio
```

#### **Dedicated Server**:
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://api.freq.voice
```

### **Step 3: Deploy**

1. **Deploy Freq App** to Vercel
2. **Deploy Audio Server** to your chosen platform
3. **Set environment variables** in both deployments
4. **Test voice messages** to ensure everything works

---

## 🏗️ **Server Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Freq App      │    │   Audio Server   │    │   Storage       │
│   (Vercel)      │───▶│   (Railway/etc)  │───▶│   (File System) │
│                 │    │                  │    │                 │
│ - UI            │    │ - Upload API     │    │ - Encrypted     │
│ - Auth          │    │ - Download API   │    │   Audio Files   │
│ - Notifications │    │ - Cleanup API    │    │ - Metadata      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 💰 **Cost Comparison**

| Platform | Monthly Cost | Storage | Performance | Setup |
|----------|-------------|---------|-------------|-------|
| **Vercel** | $0-20 | Limited | Good | 🟢 Easy |
| **Railway** | $5-20 | Unlimited | Excellent | 🟡 Medium |
| **DigitalOcean** | $5-12 | Unlimited | Excellent | 🟡 Medium |
| **AWS S3** | $0.023/GB | Unlimited | Excellent | 🔴 Complex |

---

## 🚀 **Quick Start Commands**

### **Deploy to Vercel (Easiest)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### **Deploy to Railway**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **Deploy to DigitalOcean**:
```bash
# Create app.yaml
# Deploy via DigitalOcean dashboard
# Or use doctl CLI
```

---

## 🔧 **Environment Variables Checklist**

### **Required for All Deployments**:
```env
NEXT_PUBLIC_AUDIO_STORAGE_TYPE=shared-encrypted
NEXT_PUBLIC_AUDIO_ENCRYPTION_KEY=your-secure-32-character-key
NEXT_PUBLIC_AUDIO_API_ENDPOINT=https://your-server-url
```

### **Farcaster Integration**:
```env
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281
NEXT_PUBLIC_FARCASTER_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_FARCASTER_DOMAIN=freq.voice
NEXT_PUBLIC_FARCASTER_SIWE_URI=https://freq.voice
```

---

## 🎯 **My Recommendation**

**For Production**: Use **Railway** for the audio server

**Why Railway?**
- ✅ Easy deployment
- ✅ Unlimited storage
- ✅ Good performance
- ✅ Reasonable pricing
- ✅ Automatic HTTPS
- ✅ Easy environment variable management

**Setup**:
1. Deploy Freq app to Vercel
2. Deploy audio server to Railway
3. Set environment variables
4. Test and go live!

---

## 🚀 **Next Steps**

1. **Choose your server platform**
2. **Deploy the audio server**
3. **Set environment variables**
4. **Deploy Freq app**
5. **Test voice messages**
6. **Go live!**

**Your Freq app will be production-ready with secure, scalable audio storage!** 🎤✨
