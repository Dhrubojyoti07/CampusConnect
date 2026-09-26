'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import {
  events,
  createEvent,
  updateEvent,
  cancelEvent,
  CampusEvent,
  EventCategory,
  TODAY,
  getCurrentDateTime,
} from '@/data/events'
import EmptyState from '@/components/EmptyState'
import StatusBadge from '@/components/StatusBadge'

const CATEGORIES: EventCategory[] = [
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

function getCurrentLocalDateTime() {
  const now = getCurrentDateTime()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}

interface FormData {
  name: string
  category: EventCategory
  date: string
  venue: string
  capacity: number
  description: string
}

export default function OrganizerPage() {
  const { currentUser } = useAuth()
  const [eventsList, setEventsList] = useState<CampusEvent[]>(() => [...events])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [allowPastEvent, setAllowPastEvent] = useState(false)
  const [formData, setFormData] = useState<FormData>(() => ({
    name: '',
    category: 'Tech',
    date: getCurrentLocalDateTime(),
    venue: '',
    capacity: 50,
    description: '',
  }))
  const [formError, setFormError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!currentUser) {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="Organizer sign-in required"
          description="Please sign in with an organizer account to access the organizer console and manage events."
          action={
            <Link
              href="/login?redirect=/organizer"
              target="_self"
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              Sign In as Organizer
            </Link>
          }
        />
      </section>
    )
  }

  if (currentUser.role !== 'organizer') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="Organizer access only"
          description={`You are currently signed in as a student (${currentUser.name}). The organizer console is restricted to campus organizers.`}
          action={
            <Link
              href="/login?redirect=/organizer"
              target="_self"
              className="btn btn-secondary"
              style={{ marginTop: 8 }}
            >
              Switch to Organizer Account
            </Link>
          }
        />
      </section>
    )
  }

  const myEvents = eventsList.filter((e) => e.organizerId === currentUser.id)

  const openCreateModal = () => {
    setEditingEventId(null)
    setAllowPastEvent(false)
    setFormData({
      name: '',
      category: 'Tech',
      date: getCurrentLocalDateTime(),
      venue: '',
      capacity: 50,
      description: '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (event: CampusEvent) => {
    setEditingEventId(event.id)
    setAllowPastEvent(true)
    setFormData({
      name: event.name,
      category: event.category,
      date: event.date.slice(0, 16),
      venue: event.venue,
      capacity: event.capacity,
      description: event.description,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleCancelEvent = async (eventId: string, eventName: string) => {
    if (!confirm(`Are you sure you want to cancel "${eventName}"? Students will no longer be able to see or register for it.`)) {
      return
    }

    try {
      cancelEvent(eventId)
      await fetch(`/api/events/${eventId}`, { method: 'DELETE' }).catch(() => {})
      setEventsList([...events])
      setFeedback({
        type: 'success',
        text: `Event "${eventName}" has been cancelled.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel event'
      setFeedback({ type: 'error', text: msg })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation
    if (!formData.name.trim()) {
      setFormError('Event name is required.')
      return
    }
    if (!formData.venue.trim()) {
      setFormError('Venue is required.')
      return
    }
    if (!formData.date) {
      setFormError('Event date is required.')
      return
    }
    const eventTime = new Date(formData.date).getTime()
    if (isNaN(eventTime)) {
      setFormError('Invalid event date.')
      return
    }
    if (!allowPastEvent && eventTime <= getCurrentDateTime().getTime()) {
      setFormError('Event date must be in the future (or check the past event test option).')
      return
    }
    if (!formData.capacity || formData.capacity <= 0 || !Number.isInteger(Number(formData.capacity))) {
      setFormError('Capacity must be a positive whole number.')
      return
    }

    try {
      if (editingEventId) {
        // Edit event
        const res = await fetch(`/api/events/${editingEventId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const updated = await res.json()
        if (!res.ok) {
          throw new Error(updated.error || 'Failed to update event')
        }

        updateEvent(editingEventId, {
          name: formData.name,
          category: formData.category,
          date: formData.date,
          venue: formData.venue,
          capacity: Number(formData.capacity),
          description: formData.description,
        })

        setEventsList([...events])
        setFeedback({
          type: 'success',
          text: `Event "${updated.name}" updated successfully.`,
        })
      } else {
        // Create event via canonical server API
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            capacity: Number(formData.capacity),
            organizerId: currentUser.id,
            allowPast: allowPastEvent,
          }),
        })
        const created = await res.json()
        if (!res.ok) {
          throw new Error(created.error || 'Failed to create event')
        }

        // Sync client memory so that event exists locally with identical server ID
        if (!events.some((e) => e.id === created.id)) {
          events.push(created)
        }

        setEventsList([...events])
        setFeedback({
          type: 'success',
          text: `Event "${created.name}" created and posted to the board.`,
        })
      }

      setModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      setFormError(msg)
    }
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div
        style={{
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow-tag">organizer console</span>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>Manage your events</h1>
          <p style={{ marginTop: 8 }}>
            Create, update, and manage your department or club events.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + New event
        </button>
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

      {myEvents.length === 0 ? (
        <EmptyState
          title="No events posted yet"
          description="Once you create an event, it'll show up here."
          action={
            <button className="btn btn-primary" onClick={openCreateModal}>
              Create your first event
            </button>
          }
        />
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myEvents.map((event) => {
            const status = event.cancelled
              ? 'cancelled'
              : event.seatsAvailable <= 0
                ? 'full'
                : 'open'

            return (
              <li
                key={event.id}
                className="card-surface"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                  opacity: event.cancelled ? 0.75 : 1,
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
                    · {event.venue} · {event.seatsAvailable}/{event.capacity}{' '}
                    seats
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={status} />
                  <button
                    className="btn btn-secondary"
                    onClick={() => openEditModal(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    disabled={event.cancelled}
                    onClick={() => handleCancelEvent(event.id, event.name)}
                  >
                    {event.cancelled ? 'Cancelled' : 'Cancel'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Modal Dialog for Create & Edit */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(33, 31, 28, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            className="card-surface"
            style={{
              width: '100%',
              maxWidth: 520,
              padding: 28,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>
              {editingEventId ? 'Edit event' : 'Create new event'}
            </h2>

            {formError && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius)',
                  fontSize: 13.5,
                  background: 'var(--rust-bg)',
                  color: 'var(--rust)',
                  border: '1px solid var(--rust)',
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                  Event name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--paper-raised)',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as EventCategory })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--paper-raised)',
                      fontSize: 14,
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                    Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--paper-raised)',
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--paper-raised)',
                    fontSize: 14,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <input
                    type="checkbox"
                    id="allowPastEvent"
                    checked={allowPastEvent}
                    onChange={(e) => setAllowPastEvent(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="allowPastEvent"
                    style={{ fontSize: 13, color: 'var(--amber-ink)', cursor: 'pointer', userSelect: 'none' }}
                  >
                    Allow past event date (Test option — will be removed in future)
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                  Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--paper-raised)',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--paper-raised)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEventId ? 'Save changes' : 'Create event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
