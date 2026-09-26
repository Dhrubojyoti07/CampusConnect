import { NextRequest, NextResponse } from 'next/server'
import {
  registrations,
  getRegistrationsForStudent,
  registerStudentForEvent,
} from '@/data/registrations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  if (studentId) {
    return NextResponse.json(getRegistrationsForStudent(studentId))
  }
  return NextResponse.json(registrations)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentId, eventId } = body
    if (!studentId || !eventId) {
      return NextResponse.json(
        { error: 'studentId and eventId are required' },
        { status: 400 },
      )
    }
    const result = registerStudentForEvent(studentId, eventId)
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to register for event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

