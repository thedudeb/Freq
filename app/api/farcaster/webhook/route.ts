import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Farcaster frame webhook requests
    console.log('Farcaster webhook received:', body)
    
    // Extract frame data
    const { trustedData, untrustedData } = body
    
    if (trustedData) {
      const { messageBytes } = trustedData
      
      // Handle different frame actions
      if (untrustedData?.buttonIndex === 1) {
        // "Send Voice Message" button clicked
        return NextResponse.json({
          success: true,
          action: 'redirect',
          url: 'https://freq-2tv3qyyh0-thedude-da236722.vercel.app/send'
        })
      }
      
      if (untrustedData?.buttonIndex === 2) {
        // "View Inbox" button clicked
        return NextResponse.json({
          success: true,
          action: 'redirect',
          url: 'https://freq-2tv3qyyh0-thedude-da236722.vercel.app/inbox'
        })
      }
    }
    
    // Default response
    return NextResponse.json({
      success: true,
      message: 'Freq webhook processed successfully'
    })
    
  } catch (error) {
    console.error('Error processing Farcaster webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return webhook status
    return NextResponse.json({
      status: 'active',
      app: 'Freq Voice Chat',
      version: '1.0.0',
      endpoints: {
        webhook: '/api/farcaster/webhook',
        register: '/api/farcaster/register',
        discovery: '/api/farcaster/discovery'
      }
    })
    
  } catch (error) {
    console.error('Error in webhook status check:', error)
    return NextResponse.json(
      { error: 'Failed to get webhook status' },
      { status: 500 }
    )
  }
}




