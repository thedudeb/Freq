import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const { untrustedData } = data
  
  if (untrustedData?.buttonIndex === 1) {
    // User clicked "Send Voice Message" or "Record Audio"
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Freq - Record Voice Message</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/splashImageUrl.png" />
          <meta property="fc:frame:button:1" content="Start Recording" />
          <meta property="fc:frame:button:2" content="Back to Main" />
          <meta property="fc:frame:post_url" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/api/frame" />
        </head>
        <body>
          <h1>Record Voice Message</h1>
          <p>Click "Start Recording" to begin recording your voice message.</p>
        </body>
      </html>
    `, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
  }
  
  if (untrustedData?.buttonIndex === 2) {
    // User clicked "View Inbox" or "Back to Main"
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
  
  // Default response
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
