import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  
  // Handle frame button clicks and other interactions
  const { untrustedData } = data
  
  if (untrustedData?.buttonIndex === 1) {
    // User clicked "Send Voice Message"
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Freq - Send Voice Message</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/heroImageUrl.png" />
          <meta property="fc:frame:button:1" content="Record Audio" />
          <meta property="fc:frame:button:2" content="Back to Main" />
          <meta property="fc:frame:post_url" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/api/frame" />
        </head>
        <body>
          <h1>Freq Voice Message</h1>
          <p>Click "Record Audio" to start recording your voice message.</p>
        </body>
      </html>
    `, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
  }
  
  // Default frame view
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Freq - Voice Messages on Farcaster</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/heroImageUrl.png" />
        <meta property="fc:frame:button:1" content="Send Voice Message" />
        <meta property="fc:frame:button:2" content="View Inbox" />
        <meta property="fc:frame:post_url" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/api/frame" />
      </head>
      <body>
        <h1>Freq</h1>
        <p>Voice messages on Farcaster</p>
      </body>
    </html>
  `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
}

export async function GET() {
  // Return the main frame view
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Freq - Voice Messages on Farcaster</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/heroImageUrl.png" />
        <meta property="fc:frame:button:1" content="Send Voice Message" />
        <meta property="fc:frame:button:2" content="View Inbox" />
        <meta property="fc:frame:post_url" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/api/frame" />
      </head>
      <body>
        <h1>Freq</h1>
        <p>Voice messages on Farcaster</p>
      </body>
    </html>
  `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
}
