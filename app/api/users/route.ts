import { NextRequest, NextResponse } from 'next/server'
import { users, createUser } from '@/data/auth'

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newUser = createUser(body)
    return NextResponse.json(newUser, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

