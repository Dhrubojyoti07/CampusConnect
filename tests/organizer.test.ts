import { describe, it, expect } from 'vitest'
import {
  events,
  createEvent,
  updateEvent,
  cancelEvent,
  getUpcomingEvents,
  sortEvents,
  TODAY,
} from '@/data/events'

describe('Organizer Event Management (Task 4)', () => {
  it('creates an event with valid future date and positive capacity', () => {
    const newEvent = createEvent({
      name: 'Hackathon Demo Night',
      category: 'Tech',
      date: '2026-11-20T18:00:00',
      venue: 'Auditorium Main',
      capacity: 50,
      description: 'Showcase of all hackathon projects.',
      organizerId: 'org-1',
    })

    expect(newEvent.id).toBeDefined()
    expect(newEvent.seatsAvailable).toBe(50)
    expect(newEvent.cancelled).toBe(false)
    expect(events.some((e) => e.id === newEvent.id)).toBe(true)
  })

  it('rejects event creation with a date in the past', () => {
    expect(() =>
      createEvent({
        name: 'Past Party',
        category: 'Cultural',
        date: '2026-08-01T18:00:00',
        venue: 'Quad',
        capacity: 100,
        description: 'Should fail',
        organizerId: 'org-1',
      }),
    ).toThrow(/future/i)
  })

  it('rejects event creation with zero or negative capacity', () => {
    expect(() =>
      createEvent({
        name: 'Zero Cap Event',
        category: 'Workshop',
        date: '2026-10-30T10:00:00',
        venue: 'Lab',
        capacity: 0,
        description: 'Invalid',
        organizerId: 'org-1',
      }),
    ).toThrow(/Capacity/i)
  })

  it('updates an event and adjusts seats when capacity changes', () => {
    const updated = updateEvent('evt-01', {
      venue: 'Updated Innovation Lab',
      capacity: 130, // was 120
    })

    expect(updated.venue).toBe('Updated Innovation Lab')
    expect(updated.capacity).toBe(130)
    expect(updated.seatsAvailable).toBe(47) // was 37, +10
  })

  it('cancels an event and excludes it from upcoming events', () => {
    cancelEvent('evt-05')
    const upcoming = getUpcomingEvents()
    expect(upcoming.some((e) => e.id === 'evt-05')).toBe(false)
  })
})

describe('Stretch Features: Sorting', () => {
  it('sorts events by date soonest first', () => {
    const upcoming = getUpcomingEvents()
    const sorted = sortEvents(upcoming, 'date-asc')
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(new Date(sorted[i].date).getTime()).toBeLessThanOrEqual(
        new Date(sorted[i + 1].date).getTime(),
      )
    }
  })

  it('sorts events by popularity (highest fill percentage first)', () => {
    const upcoming = getUpcomingEvents()
    const sorted = sortEvents(upcoming, 'popularity')
    for (let i = 0; i < sorted.length - 1; i++) {
      const aFilled = (sorted[i].capacity - sorted[i].seatsAvailable) / sorted[i].capacity
      const bFilled = (sorted[i + 1].capacity - sorted[i + 1].seatsAvailable) / sorted[i + 1].capacity
      expect(aFilled).toBeGreaterThanOrEqual(bFilled)
    }
  })
})

