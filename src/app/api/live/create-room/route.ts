
/**
 * /api/live/create-room
 * 
 * Purpose: Orchestrates the creation of a new real-time classroom node.
 * Updated: v18.9 - Added infrastructure validation and forensic logging.
 */

import { NextResponse } from 'next/server';
import { rooms, generateRoomCode } from '@/lib/live-rooms';

export async function POST(request: Request) {
  try {
    // INFRASTRUCTURE AUDIT: Ensure Pusher environment is ready
    const pusherConfigured = 
      !!process.env.PUSHER_APP_ID && 
      !!process.env.PUSHER_SECRET &&
      !!process.env.NEXT_PUBLIC_PUSHER_KEY &&
      !!process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherConfigured) {
      console.error('[Live Mode Error] Pusher environment variables are missing from .env.local');
      return NextResponse.json({ 
        error: 'Live mode not configured',
        message: 'Pusher environment variables are not set on the server.'
      }, { status: 503 });
    }

    const { testId, testName, hostId, hostName } = await request.json();
    
    if (!testId || !hostId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const roomCode = generateRoomCode();
    rooms.set(roomCode, {
      roomCode,
      testId,
      testName,
      hostId,
      hostName,
      students: [],
      status: 'waiting',
      currentQuestion: 0,
      createdAt: Date.now()
    });

    return NextResponse.json({ roomCode, testId, hostId });
  } catch (err: any) {
    console.error('[Live Mode Error] Room creation exception:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal Error',
      details: err.toString()
    }, { status: 400 });
  }
}
