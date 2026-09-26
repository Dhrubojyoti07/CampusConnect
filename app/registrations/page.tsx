'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import {
  getRegistrationsForStudent,
  cancelStudentRegistration,
  Registration,
} from '@/data/registrations'
import { getEventById, isPastEvent } from '@/data/events'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'

export default function RegistrationsPage() {
  const { currentUser } = useAuth()
  const [registrationsList, setRegistrationsList] = useState<Registration[]>(() =>
    currentUser ? getRegistrationsForStudent(currentUser.id) : [],
  )
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.id && currentUser.role === 'student') {
      fetch(`/api/registrations?studentId=${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRegistrationsList(data)
          }
        })
        .catch(() => {})
    } else {
      setRegistrationsList([])
    }
  }, [currentUser?.id, currentUser?.role])

  if (!currentUser) {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="Sign in required"
          description="Please log in with your student account to view and manage your event registrations."
          action={
            <Link
              href="/login?redirect=/registrations"
              target="_self"
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              Sign In
            </Link>
          }
        />
      </section>
    )
  }

  if (currentUser.role !== 'student') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This page is for students"
          description={`You are currently logged in as an organizer (${currentUser.name}). Switch or log in with a student account to see registered events.`}
          action={
            <Link
              href="/login?redirect=/registrations"
              target="_self"
              className="btn btn-secondary"
              style={{ marginTop: 8 }}
            >
              Log In as Student
            </Link>
          }
        />
      </section>
    )
  }

  // Hide registrations for events that were cancelled by the organizer (Task 4/5)
  const visibleRegistrations = registrationsList.filter((reg) => {
    const event = getEventById(reg.eventId)
    return event && !event.cancelled
  })

  // Group into Upcoming (confirmed & future) vs Past / Cancelled
  const upcomingRegistrations = visibleRegistrations.filter((reg) => {
    const event = getEventById(reg.eventId)
    return event && !isPastEvent(event) && reg.status === 'confirmed'
  })

  const pastOrCancelledRegistrations = visibleRegistrations.filter((reg) => {
    const event = getEventById(reg.eventId)
    return event && (isPastEvent(event) || reg.status === 'cancelled')
  })

  const handleCancel = async (regId: string, eventName: string) => {
    setCancellingId(regId)
    setFeedback(null)

    try {
      const res = await fetch(`/api/registrations/${regId}?studentId=${currentUser.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel registration')
      }

      cancelStudentRegistration(regId, currentUser.id)
      setRegistrationsList((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: 'cancelled' } : r)),
      )
      setFeedback({
        type: 'success',
        text: `Registration for "${eventName}" has been cancelled. Your seat has been released.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel registration'
      setFeedback({ type: 'error', text: msg })
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">signed up as {currentUser.name}</span>
        <h1 style={{ fontSize: 30, marginTop: 10 }}>My registrations</h1>
        <p style={{ marginTop: 8 }}>
          View and manage your upcoming event passes and past attendance.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            fontSize: 14,
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

      {visibleRegistrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Once you register for an event, it'll show up here."
          action={
            <Link href="/events" target="_self" className="btn btn-primary">
              Browse events
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {/* Upcoming Registrations */}
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>
              Upcoming events ({upcomingRegistrations.length})
            </h2>
            {upcomingRegistrations.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 14.5 }}>
                You have no upcoming confirmed registrations.
              </p>
            ) : (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcomingRegistrations.map((reg) => {
                  const event = getEventById(reg.eventId)
                  if (!event) return null
                  const isCancelling = cancellingId === reg.id

                  return (
                    <li
                      key={reg.id}
                      className="card-surface"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <Link
                          href={`/events/${event.id}`}
                          target="_self"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                            fontSize: 17,
                            textDecoration: 'none',
                          }}
                        >
                          {event.name}
                        </Link>
                        <div
                          style={{
                            fontSize: 13.5,
                            color: 'var(--ink-soft)',
                            marginTop: 4,
                          }}
                        >
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          · {event.venue}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <StatusBadge status="open" />
                        <button
                          className="btn btn-secondary"
                          disabled={isCancelling}
                          onClick={() => handleCancel(reg.id, event.name)}
                        >
                          {isCancelling ? 'Cancelling…' : 'Cancel registration'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Past and Cancelled Registrations */}
          {pastOrCancelledRegistrations.length > 0 && (
            <div>
              <h2 style={{ fontSize: 20, marginBottom: 14 }}>
                Past & cancelled ({pastOrCancelledRegistrations.length})
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pastOrCancelledRegistrations.map((reg) => {
                  const event = getEventById(reg.eventId)
                  if (!event) return null
                  const isCancelled = reg.status === 'cancelled'
                  const past = isPastEvent(event)
                  const badgeStatus = isCancelled ? 'cancelled' : past ? 'past' : 'open'

                  return (
                    <li
                      key={reg.id}
                      className="card-surface"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                        opacity: isCancelled ? 0.75 : 1,
                      }}
                    >
                      <div>
                        <Link
                          href={`/events/${event.id}`}
                          target="_self"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                            fontSize: 17,
                            textDecoration: 'none',
                          }}
                        >
                          {event.name}
                        </Link>
                        <div
                          style={{
                            fontSize: 13.5,
                            color: 'var(--ink-soft)',
                            marginTop: 4,
                          }}
                        >
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          · {event.venue}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <StatusBadge status={badgeStatus} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
