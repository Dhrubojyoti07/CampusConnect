import { NextRequest, NextResponse } from 'next/server'
import { cancelStudentRegistration, registrations } from '@/data/registrations'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    let studentId = searchParams.get('studentId')

    if (!studentId) {
      try {
        const body = await req.json()
        studentId = body.studentId
      } catch {
        // No body provided, fallback to finding registration owner
      }
    }

    if (!studentId) {
      const reg = registrations.find((r) => r.id === params.id)
      if (reg) {
        studentId = reg.studentId
      }
    }

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required to cancel registration' },
        { status: 400 },
      )
    }

    const result = cancelStudentRegistration(params.id, studentId)
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to cancel registration'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

