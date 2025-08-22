import { NextRequest } from 'next/server'

export async function GET() {
  // Return the main frame view as HTML
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Freq - Voice Messages on Farcaster</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/heroImageUrl.png" />
        <meta property="fc:frame:button:1" content="Send Voice Message" />
        <meta property="fc:frame:button:2" content="View Inbox" />
        <meta property="fc:frame:post_url" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/api/frame" />
        <meta property="og:title" content="Freq - Voice Messages on Farcaster" />
        <meta property="og:description" content="Send and receive voice messages with other Farcaster users" />
        <meta property="og:image" content="https://freq-2tv3qyyh0-thedude-da236722.vercel.app/heroImageUrl.png" />
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; font-family: Arial, sans-serif;">
          <div style="text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Freq.</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Voice messages on Farcaster</p>
            <p style="font-size: 1rem; opacity: 0.8;">Use the buttons above to interact with this frame</p>
          </div>
        </div>
      </body>
    </html>
  `

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
