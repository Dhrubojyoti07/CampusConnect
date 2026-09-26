import { NextRequest, NextResponse } from 'next/server'
import { events, getUpcomingEvents, getPastEvents, createEvent } from '@/data/events'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const timeframe = searchParams.get('timeframe')
  const upcomingOnly = searchParams.get('upcoming') === 'true'

  if (timeframe === 'past') {
    return NextResponse.json(getPastEvents(events))
  }
  if (timeframe === 'upcoming' || upcomingOnly) {
    return NextResponse.json(getUpcomingEvents(events))
  }
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newEvent = createEvent(body)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create event'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

