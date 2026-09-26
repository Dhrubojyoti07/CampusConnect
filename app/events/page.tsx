'use client'

import { useState, useEffect } from 'react'
import {
  events,
  CampusEvent,
  EventCategory,
  searchEventsByName,
  filterEventsByCategory,
  isTodayEvent,
  isFutureEvent,
  isPastEvent,
  sortEvents,
} from '@/data/events'
import EventCard from '@/components/EventCard'
import EmptyState from '@/components/EmptyState'

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

export default function EventsPage() {
  const [eventsList, setEventsList] = useState<CampusEvent[]>(() => [...events])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'popularity'>('date-asc')
  const [sectionFilter, setSectionFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  // Keep events synchronized with the canonical server store
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEventsList(data)
        }
      })
      .catch(() => {})
  }, [])

  // 1. Upcoming Events (Today + Future)
  const upcomingEvents = eventsList.filter((e) => !isPastEvent(e) && !e.cancelled)
  const searchedUpcoming = searchEventsByName(upcomingEvents, query)
  const filteredUpcoming = filterEventsByCategory(searchedUpcoming, category)
  const sortedUpcoming = sortEvents(filteredUpcoming, sortBy)

  const todayEvents = sortedUpcoming.filter((e) => isTodayEvent(e))
  const futureEvents = sortedUpcoming.filter((e) => isFutureEvent(e))

  // 2. Past Events (Completed)
  const pastEvents = eventsList.filter((e) => isPastEvent(e) && !e.cancelled)
  const searchedPast = searchEventsByName(pastEvents, query)
  const filteredPast = filterEventsByCategory(searchedPast, category)
  const sortedPast = sortEvents(filteredPast, sortBy)

  const showUpcoming = sectionFilter === 'all' || sectionFilter === 'upcoming'
  const showPast = sectionFilter === 'all' || sectionFilter === 'past'

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">the board</span>
        <h1 style={{ fontSize: 30, marginTop: 10 }}>Campus Events</h1>
        <p style={{ marginTop: 8 }}>
          Discover and register for upcoming events, or view completed campus activities.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}
      >
        <input
          type="search"
          placeholder="Search events by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory | 'All')}
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All categories' : c}
            </option>
          ))}
        </select>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value as 'all' | 'upcoming' | 'past')}
          aria-label="View section filter"
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        >
          <option value="all">All sections (Upcoming & Past)</option>
          <option value="upcoming">Upcoming events only</option>
          <option value="past">Past events only</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date-asc' | 'date-desc' | 'popularity')}
          aria-label="Sort events"
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        >
          <option value="date-asc">Date: Soonest first</option>
          <option value="date-desc">Date: Latest first</option>
          <option value="popularity">Popularity (Most filled)</option>
        </select>
      </div>

      {/* UPCOMING EVENTS SECTION */}
      {showUpcoming && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Upcoming Events</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, marginTop: 4 }}>
              Active events happening today and in the coming weeks.
            </p>
          </div>

          {sortedUpcoming.length === 0 ? (
            <EmptyState
              title="No upcoming events found"
              description="No active events match your search or filter criteria. Try adjusting your search term."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Today's Events */}
              {todayEvents.length > 0 && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        background: 'var(--green-bg)',
                        color: 'var(--green)',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      TODAY • 26 SEP 2026
                    </span>
                    <h3 style={{ fontSize: 18, margin: 0 }}>Today's events</h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: 16,
                    }}
                  >
                    {todayEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Future Events */}
              <div>
                {todayEvents.length > 0 && (
                  <h3 style={{ fontSize: 18, marginBottom: 14 }}>Future events</h3>
                )}
                {futureEvents.length === 0 && todayEvents.length > 0 ? (
                  <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
                    No additional future events found.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: 16,
                    }}
                  >
                    {futureEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAST EVENTS SECTION */}
      {showPast && (
        <div
          style={{
            marginTop: showUpcoming ? 36 : 0,
            borderTop: showUpcoming ? '1px solid var(--line)' : 'none',
            paddingTop: showUpcoming ? 36 : 0,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Past Events</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, marginTop: 4 }}>
              Archive of previously completed campus events. Registration is closed.
            </p>
          </div>

          {sortedPast.length === 0 ? (
            <EmptyState
              title="No past events found"
              description="No past events match your current filter settings."
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16,
              }}
            >
              {sortedPast.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
