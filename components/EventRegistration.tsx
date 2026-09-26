'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import {
  CampusEvent,
  isPastEvent,
  isFullEvent,
  getEventRegistrationStatus,
} from '@/data/events'
import {
  isStudentRegisteredForEvent,
  registerStudentForEvent,
} from '@/data/registrations'
import StatusBadge from '@/components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function EventRegistration({
  initialEvent,
}: {
  initialEvent: CampusEvent
}) {
  const { currentUser } = useAuth()
  const [event, setEvent] = useState<CampusEvent>(initialEvent)

  const [registered, setRegistered] = useState(() =>
    currentUser?.role === 'student' && initialEvent
      ? isStudentRegisteredForEvent(currentUser.id, initialEvent.id)
      : false,
  )
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const past = isPastEvent(event)
  const full = isFullEvent(event)
  const status = getEventRegistrationStatus(event)

  const isStudent = currentUser.role === 'student'
  const alreadyRegistered = registered || (isStudent && isStudentRegisteredForEvent(currentUser.id, event.id))
  const canRegister = !past && !full && !event.cancelled && isStudent && !alreadyRegistered

  const handleRegister = async () => {
    if (!isStudent) {
      setFeedback({ type: 'error', text: 'You must be logged in as a student to register.' })
      return
    }

    if (past) {
      setFeedback({ type: 'error', text: 'Registration is closed because this event has already ended.' })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentUser.id, eventId: event.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Registration failed' })
        return
      }

      // Sync in-memory registrations store
      registerStudentForEvent(currentUser.id, event.id)

      setRegistered(true)
      setEvent((prev) => ({ ...prev, seatsAvailable: Math.max(0, prev.seatsAvailable - 1) }))
      setFeedback({
        type: 'success',
        text: 'Registration successful! You have reserved a seat for this event.',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setFeedback({ type: 'error', text: message })
    } finally {
      setLoading(false)
    }
  }

  let buttonText = 'Register'
  if (!isStudent) {
    buttonText = 'Registration only for students'
  } else if (alreadyRegistered) {
    buttonText = '✓ Registered'
  } else if (event.cancelled) {
    buttonText = 'Event cancelled'
  } else if (past) {
    buttonText = 'Registration closed (Event ended)'
  } else if (full) {
    buttonText = 'Event full'
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <Link
        href="/events"
        target="_self"
        style={{ fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}
      >
        ← All events
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 32,
          marginTop: 20,
        }}
        className="hero-grid"
      >
        <div>
          <span className="eyebrow-tag">{event.category}</span>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>{event.name}</h1>
          <p style={{ marginTop: 16, fontSize: 15.5 }}>{event.description}</p>
        </div>

        <aside
          className="card-surface"
          style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            height: 'fit-content',
          }}
        >
          <StatusBadge status={status} />
          <Detail label="Date" value={formatDate(event.date)} />
          <Detail label="Time" value={formatTime(event.date)} />
          <Detail label="Venue" value={event.venue} />
          <Detail
            label="Seats"
            value={`${event.seatsAvailable} of ${event.capacity} available`}
          />

          {feedback && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius)',
                fontSize: 13.5,
                background:
                  feedback.type === 'success'
                    ? 'var(--green-bg)'
                    : 'var(--rust-bg)',
                color:
                  feedback.type === 'success'
                    ? 'var(--green)'
                    : 'var(--rust)',
                border: `1px solid ${
                  feedback.type === 'success' ? 'var(--green)' : 'var(--rust)'
                }`,
              }}
            >
              {feedback.text}
            </div>
          )}

          {past && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                fontSize: 13.5,
                background: 'rgba(100, 116, 139, 0.08)',
                color: 'var(--ink-soft)',
                border: '1px solid var(--border)',
                lineHeight: 1.4,
              }}
            >
              Registration is closed because this event has already ended.
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={!canRegister || loading}
            onClick={handleRegister}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Registering…' : buttonText}
          </button>

          {alreadyRegistered && (
            <Link
              href="/registrations"
              target="_self"
              style={{
                fontSize: 13,
                textAlign: 'center',
                color: 'var(--ink-soft)',
                textDecoration: 'underline',
              }}
            >
              View in My Registrations →
            </Link>
          )}

          {!isStudent && (
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0 }}>
              Currently logged in as organizer ({currentUser.name}). Switch account from top-right to register.
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{label}</div>
      <div style={{ fontSize: 14.5, fontWeight: 500 }}>{value}</div>
    </div>
  )
}

