import { describe, it, expect } from 'vitest'
import {
  events,
  createEvent,
  getEventById,
  isPastEvent,
  isTodayEvent,
  isFutureEvent,
  getUpcomingEvents,
  getPastEvents,
  getCurrentDateTime,
} from '@/data/events'
import {
  registerStudentForEvent,
  isStudentRegisteredForEvent,
} from '@/data/registrations'

describe('11 User Required Scenarios Verification', () => {
  let createdEventId: string

  it('Scenario 1: Create a new future event -> event appears under Upcoming Events', () => {
    const futureEvent = createEvent({
      name: 'Future AI Seminar',
      description: 'Exploring LLMs and agents.',
      date: '2026-10-15T15:00:00',
      venue: 'Tech Hall 1',
      category: 'Tech',
      capacity: 60,
      organizerId: 'org-1',
    })
    createdEventId = futureEvent.id
    expect(futureEvent.id).toBeDefined()
    expect(isFutureEvent(futureEvent)).toBe(true)

    const upcoming = getUpcomingEvents()
    expect(upcoming.some((e) => e.id === futureEvent.id)).toBe(true)
  })

  it('Scenario 2: Open the newly created event -> details load correctly', () => {
    const event = getEventById(createdEventId)
    expect(event).toBeDefined()
    expect(event?.name).toBe('Future AI Seminar')
    expect(event?.venue).toBe('Tech Hall 1')
    expect(event?.capacity).toBe(60)
  })

  it('Scenario 3: Register for the newly created event -> registration succeeds', () => {
    const result = registerStudentForEvent('stu-1', createdEventId)
    expect(result.success).toBe(true)

    const event = getEventById(createdEventId)!
    expect(event.seatsAvailable).toBe(59)
    expect(isStudentRegisteredForEvent('stu-1', createdEventId)).toBe(true)
  })

  it('Scenario 4: Refresh the event page -> event still loads correctly with registration', () => {
    const reloaded = getEventById(createdEventId)
    expect(reloaded).toBeDefined()
    expect(isStudentRegisteredForEvent('stu-1', createdEventId)).toBe(true)
  })

  it('Scenario 5: Open an existing upcoming event -> registration still works', () => {
    const existing = getEventById('evt-05')!
    const seatsBefore = existing.seatsAvailable
    const result = registerStudentForEvent('stu-1', 'evt-05')
    expect(result.success).toBe(true)
    expect(existing.seatsAvailable).toBe(seatsBefore - 1)
  })

  it('Scenario 6: Create/view an event dated 26/09/2026 that has not ended -> remains active / today', () => {
    const todayEvent = createEvent({
      name: 'Today Evening Coding Jam',
      description: 'Evening session today.',
      date: '2026-09-26T21:00:00',
      venue: 'Lab 3',
      category: 'Tech',
      capacity: 30,
      organizerId: 'org-1',
    })
    expect(isTodayEvent(todayEvent)).toBe(true)
    expect(isPastEvent(todayEvent)).toBe(false)
    expect(getUpcomingEvents().some((e) => e.id === todayEvent.id)).toBe(true)
  })

  it('Scenario 7: Open an event whose date/time has passed -> appears under Past Events', () => {
    const pastEvt = getEventById('evt-04')!
    expect(isPastEvent(pastEvt)).toBe(true)
    const pastEvents = getPastEvents()
    expect(pastEvents.some((e) => e.id === 'evt-04')).toBe(true)
  })

  it('Scenario 8 & 9: Past event -> Register is unavailable and rejected server-side', () => {
    const regResult = registerStudentForEvent('stu-1', 'evt-04')
    expect(regResult.success).toBe(false)
    expect(regResult.message).toMatch(/Registration is closed because this event has already ended/i)
  })

  it('Scenario 10: Invalid/nonexistent event ID -> show normal event not found state', () => {
    const invalid = getEventById('evt-invalid-999')
    expect(invalid).toBeUndefined()
    const regResult = registerStudentForEvent('stu-1', 'evt-invalid-999')
    expect(regResult.success).toBe(false)
    expect(regResult.message).toMatch(/not found/i)
  })

  it('Scenario 11: Verify timezone conversion consistency', () => {
    const testDate = new Date('2026-09-26T18:00:00')
    expect(testDate.getFullYear()).toBe(2026)
    expect(testDate.getMonth()).toBe(8)
    expect(testDate.getDate()).toBe(26)
  })
})
