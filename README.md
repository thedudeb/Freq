# Freq - Voice Chat on Farcaster

A Farcaster mini-app for asynchronous voice chat, similar to a walkie-talkie. Send and receive voice messages with other Farcaster users through an intuitive interface.

## Features

### 🎤 Voice Messaging
- **Record & Send**: Record voice messages and send them to other Farcaster users
- **Inbox**: View and play received voice messages
- **Real-time Audio**: High-quality voice recording and playback
- **Duration Display**: See message length before playing

### 🔔 Farcaster-Style Notifications
- **Native Integration**: Follows Farcaster's notification patterns
- **Multiple Types**: Voice messages, mentions, reactions, follows, and casts
- **In-app Center**: Manage all notifications in one place
- **Push Notifications**: Browser notifications with Farcaster styling
- **Preferences**: Customize notification settings per user

### 🛡️ Beta Access
- **Password Protection**: Secure beta access with "Freq420!"
- **User Authentication**: Simulated Farcaster login for testing
- **Session Management**: Persistent login state

### 📱 Progressive Web App
- **PWA Support**: Install as a native app
- **Offline Capability**: Service worker for offline functionality
- **Background Sync**: Sync notifications when online
- **App Shortcuts**: Quick access to send and inbox

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Farcaster theme
- **Icons**: Lucide React
- **Audio**: Web Audio API & MediaRecorder API
- **Notifications**: Farcaster-style notification system
- **PWA**: Service Worker & Web App Manifest

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Beta Access
To access the app, enter the beta password: `Freq420!`

## Project Structure

```
freq/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── farcaster/     # Farcaster-specific APIs
│   │   ├── notifications/ # Notification management
│   │   ├── upload-audio/  # Audio upload handling
│   │   └── mock-audio/    # Mock audio responses
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── FarcasterAuth.tsx # Authentication component
│   ├── InboxPage.tsx     # Voice message inbox
│   ├── SendPage.tsx      # Voice message recording/sending
│   ├── PasswordGate.tsx  # Beta access control
│   └── FarcasterNotificationCenter.tsx # Notification management
├── lib/                  # Utility libraries
│   ├── farcaster.ts      # Farcaster service (mock)
│   ├── farcaster-miniapp-notifications.ts # Notification system
│   └── notifications.ts  # Legacy notification system
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service worker
│   └── favicon.ico      # App icon
└── package.json         # Dependencies and scripts
```

## Key Components

### Authentication Flow
- **PasswordGate**: Controls beta access with password verification
- **FarcasterAuth**: Simulated Farcaster authentication with two-step login
- **Session Management**: Persistent login state using localStorage

### Voice Messaging
- **SendPage**: Voice recording, user search, and message sending
- **InboxPage**: Display and playback of received voice messages
- **Audio Handling**: Web Audio API integration for recording/playback

### Notification System
- **FarcasterNotificationCenter**: Complete notification management UI
- **Farcaster-style Notifications**: Follows Farcaster's native patterns
- **Push Notifications**: Browser notifications with custom styling
- **Background Sync**: Service worker for offline notification sync

## API Routes

### `/api/upload-audio`
Handles audio file uploads for voice messages

### `/api/mock-audio/[id]`
Serves mock audio files for testing

### `/api/farcaster/notifications`
Farcaster-specific notification endpoints

### `/api/notifications/preferences`
User notification preference management

### `/api/notifications/webhook`
Webhook endpoint for receiving Farcaster events

### `/api/notifications/sync`
Background sync for notifications

## Farcaster Integration

### Current Implementation
- **Mock Authentication**: Simulated Farcaster login for beta testing
- **Mock User Search**: Simulated user discovery and search
- **Mock Voice Messages**: Simulated message sending and receiving
- **Farcaster-style UI**: Native Farcaster design patterns

### Production Integration
To integrate with real Farcaster APIs:

1. **Authentication**: Replace mock auth with `@farcaster/auth-kit`
2. **User Search**: Integrate with Farcaster Hub API
3. **Voice Messages**: Implement real cast creation with audio embeds
4. **Notifications**: Connect to Farcaster's notification system

## Notification Types

### Voice Messages
- **Type**: `voice_message`
- **Trigger**: When someone sends you a voice message
- **Content**: Sender info, audio URL, duration, cast hash

### Mentions
- **Type**: `mention`
- **Trigger**: When someone mentions you in a cast
- **Content**: Sender info, cast text, cast hash

### Reactions
- **Type**: `reaction`
- **Trigger**: When someone reacts to your cast
- **Content**: Sender info, reaction type, cast hash

### Follows
- **Type**: `follow`
- **Trigger**: When someone follows you
- **Content**: Follower info

### Casts
- **Type**: `cast`
- **Trigger**: When someone you follow casts
- **Content**: Caster info, cast text, cast hash

## PWA Features

### Installation
- **App Manifest**: Complete PWA configuration
- **Service Worker**: Offline functionality and background sync
- **App Shortcuts**: Quick access to key features

### Offline Support
- **Cached Assets**: Static files cached for offline use
- **Background Sync**: Notification sync when online
- **Offline UI**: Graceful handling of offline state

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Farcaster Configuration (for production)
NEXT_PUBLIC_FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281
NEXT_PUBLIC_FARCASTER_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_FARCASTER_DOMAIN=freq.voice
NEXT_PUBLIC_FARCASTER_SIWE_URI=https://freq.voice

# App Configuration
NEXT_PUBLIC_APP_NAME=Freq
NEXT_PUBLIC_APP_DESCRIPTION=Voice Chat on Farcaster
```

### Testing
- **Beta Testing**: Use "Freq420!" password for access
- **Mock Data**: All Farcaster interactions are simulated
- **Audio Testing**: Mock audio files for voice message testing

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with environment variables
- **Self-hosted**: Standard Next.js deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support:
- Create an issue on GitHub
- Join our Discord community
- Follow us on Farcaster

---

**Freq** - Your walkie-talkie for the decentralized web 🎤 