
/**
 * /api/live/join-room
 * 
 * Purpose: Student entry node for Live Mode sessions.
 * Updated: v18.9 - Added session status validation and descriptive error protocol.
 */

import { NextResponse } from 'next/server';
import { rooms } from '@/lib/live-rooms';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const { roomCode, studentName } = await request.json();
    const code = String(roomCode || "").toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // STATUS AUDIT PROTOCOL
    if (room.status === 'ended') {
      return NextResponse.json({ 
        error: 'THIS SESSION HAS ENDED — The host has closed this room.' 
      }, { status: 403 });
    }

    if (room.status !== 'waiting') {
      return NextResponse.json({ 
        error: 'Session already in progress. Join attempts are locked once the mission starts.' 
      }, { status: 403 });
    }

    if (room.students.length >= 50) {
      return NextResponse.json({ error: 'Room is full' }, { status: 403 });
    }

    const studentId = 'std_' + Math.random().toString(36).substring(2, 9);
    const newStudent = { id: studentId, name: studentName, score: 0, answers: {} };
    room.students.push(newStudent);

    // Notify Lobby
    await pusherServer.trigger(`room-${code}`, 'student-joined', {
      studentName,
      totalStudents: room.students.length,
      students: room.students.map(s => ({ name: s.name, id: s.id }))
    });

    return NextResponse.json({ 
      success: true, 
      studentId, 
      testName: room.testName, 
      hostName: room.hostName,
      testId: room.testId
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
