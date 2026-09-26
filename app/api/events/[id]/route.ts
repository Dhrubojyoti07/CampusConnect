import { NextRequest, NextResponse } from 'next/server'
import { getEventById, updateEvent, cancelEvent, deleteEvent } from '@/data/events'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const event = getEventById(params.id)
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  return NextResponse.json(event)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json()
    const updated = updateEvent(params.id, body)
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update event'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const hard = searchParams.get('hard') === 'true'
    if (hard) {
      const deleted = deleteEvent(params.id)
      return NextResponse.json({ success: deleted })
    } else {
      const cancelled = cancelEvent(params.id)
      return NextResponse.json({ success: true, event: cancelled })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to cancel event'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

