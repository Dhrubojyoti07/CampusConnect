export type EventCategory =
  | 'Tech'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Career'
  | 'Music'

export interface CampusEvent {
  id: string
  name: string
  description: string
  date: string // ISO 8601 date string, e.g. "2026-10-02T17:00:00"
  venue: string
  category: EventCategory
  capacity: number
  seatsAvailable: number
  organizerId: string
  cancelled: boolean
}

// Treat 26/09/2026 as today's date throughout the application.
export function getCurrentDateTime(): Date {
  const sysDate = new Date()
  if (
    sysDate.getFullYear() === 2026 &&
    sysDate.getMonth() === 8 &&
    sysDate.getDate() === 26
  ) {
    return sysDate
  }
  const d = new Date(sysDate)
  d.setFullYear(2026)
  d.setMonth(8) // September
  d.setDate(26)
  return d
}

// "Today" reference: 26/09/2026
export const TODAY = new Date('2026-09-26T00:00:00')

const seedEvents: CampusEvent[] = [
  {
    id: 'evt-01',
    name: 'Hack the Campus 2026',
    description:
      'A 24-hour overnight hackathon open to all branches. Teams of up to 4 build anything that makes campus life better. Food, mentors, and a closing demo night included.',
    date: '2026-10-04T18:00:00',
    venue: 'Innovation Lab, Block C',
    category: 'Tech',
    capacity: 120,
    seatsAvailable: 37,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-02',
    name: 'Acoustic Nights: Open Mic',
    description:
      'Sign up to sing, play, or read poetry. No audition needed — just bring your nerves and your talent. Snacks provided by the Cultural Committee.',
    date: '2026-09-27T19:30:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 80,
    seatsAvailable: 0,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-03',
    name: 'Resume & LinkedIn Clinic',
    description:
      'Drop-in session with alumni volunteers who will review your resume and LinkedIn profile in 15-minute slots. Walk-ins welcome, but seats are limited.',
    date: '2026-09-26T18:00:00',
    venue: 'Placement Cell, Admin Block',
    category: 'Career',
    capacity: 40,
    seatsAvailable: 12,
    organizerId: 'org-3',
    cancelled: false,
  },
  {
    id: 'evt-04',
    name: 'Inter-Hostel Football Cup — Final',
    description:
      "The championship match of this year's Inter-Hostel Football Cup. Come cheer your hostel on.",
    date: '2026-09-05T16:00:00',
    venue: 'Main Sports Ground',
    category: 'Sports',
    capacity: 300,
    seatsAvailable: 45,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-05',
    name: 'Intro to Figma Workshop',
    description:
      'A hands-on beginner workshop covering frames, components, and prototyping in Figma. Bring your own laptop.',
    date: '2026-10-10T15:00:00',
    venue: 'Design Studio, Block B',
    category: 'Workshop',
    capacity: 30,
    seatsAvailable: 6,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-06',
    name: 'Diwali Mela',
    description:
      'Stalls, rangoli competitions, and a fireworks-free light show to celebrate Diwali on campus. Open to students, faculty, and families.',
    date: '2026-11-01T17:00:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 500,
    seatsAvailable: 500,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-07',
    name: 'Competitive Programming Bootcamp',
    description:
      "Three-hour bootcamp on graph algorithms and dynamic programming, run by the CP club's senior members ahead of the ICPC regionals.",
    date: '2026-09-10T10:00:00',
    venue: 'Computer Science Lab 2',
    category: 'Tech',
    capacity: 60,
    seatsAvailable: 0,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-08',
    name: 'Basketball 3x3 Street League',
    description:
      'Casual weekly 3x3 basketball league. Register your team of 3–4, matches are round-robin followed by knockouts.',
    date: '2026-09-30T17:30:00',
    venue: 'Outdoor Courts',
    category: 'Sports',
    capacity: 64,
    seatsAvailable: 20,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-09',
    name: 'Startup Pitch Day',
    description:
      'Student founders pitch to a panel of alumni investors for a shot at seed funding and mentorship from the E-Cell.',
    date: '2026-10-18T13:00:00',
    venue: 'Auditorium',
    category: 'Career',
    capacity: 200,
    seatsAvailable: 88,
    organizerId: 'org-3',
    cancelled: false,
  },
  {
    id: 'evt-10',
    name: 'Photography Walk: Old Campus',
    description:
      'A guided golden-hour photo walk through the older parts of campus, led by the Photography Club. All skill levels welcome.',
    date: '2026-09-01T17:00:00',
    venue: 'Meet at Main Gate',
    category: 'Workshop',
    capacity: 25,
    seatsAvailable: 3,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-11',
    name: 'Classical Fusion Night',
    description:
      'The Music Society blends Carnatic and Hindustani classical forms with modern instruments in a one-night showcase.',
    date: '2026-10-25T19:00:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 150,
    seatsAvailable: 150,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-12',
    name: 'Data Structures Doubt-Clearing Marathon',
    description:
      'Pre-exam doubt-clearing session covering trees, heaps, and hashing, run by teaching assistants from the CS department.',
    date: '2026-08-28T11:00:00',
    venue: 'Lecture Hall 4',
    category: 'Tech',
    capacity: 90,
    seatsAvailable: 9,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-13',
    name: "Freshers' Orientation Games",
    description:
      'Icebreaker games and campus scavenger hunt for the incoming batch, hosted by the Student Council.',
    date: '2026-09-08T09:30:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 250,
    seatsAvailable: 0,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-14',
    name: 'Cloud & DevOps Study Group Kickoff',
    description:
      'First meetup of a semester-long study group covering AWS fundamentals and CI/CD pipelines. No prior cloud experience needed.',
    date: '2026-09-29T18:00:00',
    venue: 'Computer Science Lab 1',
    category: 'Workshop',
    capacity: 45,
    seatsAvailable: 45,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-15',
    name: 'Badminton Doubles Tournament',
    description:
      'Open doubles tournament, singles-elimination bracket. Racquets available to borrow at the sports office.',
    date: '2026-10-12T08:00:00',
    venue: 'Indoor Sports Complex',
    category: 'Sports',
    capacity: 32,
    seatsAvailable: 14,
    organizerId: 'org-4',
    cancelled: false,
  },
]

const globalForEvents = globalThis as unknown as {
  campusEvents?: CampusEvent[]
}
export const events: CampusEvent[] =
  globalForEvents.campusEvents || [...seedEvents]
globalForEvents.campusEvents = events

export type EventTimeStatus = 'past' | 'today' | 'upcoming'
export type EventRegistrationStatus = 'cancelled' | 'past' | 'full' | 'open'

/**
 * Centralized event-status calculation:
 * - Upcoming: event date/time is in the future.
 * - Today: event occurs on 26/09/2026 and has not ended.
 * - Past: event date/time has already passed.
 */
export function getEventTimeStatus(event: CampusEvent): EventTimeStatus {
  const now = getCurrentDateTime()
  const eventDate = new Date(event.date)
  const eventTime = eventDate.getTime()
  const nowTime = now.getTime()

  if (isNaN(eventTime)) return 'past'

  if (eventTime < nowTime) {
    return 'past'
  }

  // Event occurs on 26/09/2026 and has not ended
  const isSameDay =
    eventDate.getFullYear() === now.getFullYear() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getDate() === now.getDate()

  if (isSameDay) {
    return 'today'
  }

  return 'upcoming'
}

/** True when the event's date/time has already passed relative to current date/time. */
export function isPastEvent(event: CampusEvent): boolean {
  return getEventTimeStatus(event) === 'past'
}

/** True when the event occurs on 26/09/2026 and has not ended. */
export function isTodayEvent(event: CampusEvent): boolean {
  return getEventTimeStatus(event) === 'today'
}

/** True when the event occurs in the future after today. */
export function isFutureEvent(event: CampusEvent): boolean {
  return getEventTimeStatus(event) === 'upcoming'
}

/** True when there are no seats left. */
export function isFullEvent(event: CampusEvent): boolean {
  return event.seatsAvailable <= 0
}

/** Centralized event registration badge status */
export function getEventRegistrationStatus(event: CampusEvent): EventRegistrationStatus {
  if (event.cancelled) return 'cancelled'
  if (isPastEvent(event)) return 'past'
  if (isFullEvent(event)) return 'full'
  return 'open'
}

/** Look up a single event by id, or undefined if it doesn't exist. */
export function getEventById(id: string): CampusEvent | undefined {
  return events.find((event) => event.id === id)
}

/**
 * PARTICIPANT TASK (Task 1 — Event Listing):
 *
 * This is a stub. Right now it ignores `query` completely and just
 * returns every event, which is why `tests/search.test.ts` is failing.
 *
 * You need to make this do a case-insensitive, partial match on
 * `event.name` — e.g. "hack" should match "Hack the Campus 2026".
 */
export function searchEventsByName(
  eventList: CampusEvent[],
  query: string,
): CampusEvent[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return eventList
  }
  return eventList.filter((event) =>
    event.name.toLowerCase().includes(trimmed),
  )
}

/**
 * PARTICIPANT TASK (Task 1 — Event Listing):
 *
 * This is a stub. Right now it ignores `category` and returns every
 * event unchanged. You need to filter by exact category match, and
 * make sure it composes with searchEventsByName above.
 */
export function filterEventsByCategory(
  eventList: CampusEvent[],
  category: EventCategory | 'All',
): CampusEvent[] {
  if (category === 'All') {
    return eventList
  }
  return eventList.filter((event) => event.category === category)
}

/** Returns only upcoming (not past) and non-cancelled events. */
export function getUpcomingEvents(eventList: CampusEvent[] = events): CampusEvent[] {
  return eventList.filter((event) => !isPastEvent(event) && !event.cancelled)
}

/** Returns past (ended) and non-cancelled events. */
export function getPastEvents(eventList: CampusEvent[] = events): CampusEvent[] {
  return eventList.filter((event) => isPastEvent(event) && !event.cancelled)
}

/** Sort events by date ascending, date descending, or popularity (highest occupancy rate). */
export function sortEvents(
  eventList: CampusEvent[],
  sortBy: 'date-asc' | 'date-desc' | 'popularity',
): CampusEvent[] {
  const sorted = [...eventList]
  if (sortBy === 'date-asc') {
    return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  if (sortBy === 'date-desc') {
    return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  if (sortBy === 'popularity') {
    return sorted.sort((a, b) => {
      const aFilled = (a.capacity - a.seatsAvailable) / (a.capacity || 1)
      const bFilled = (b.capacity - b.seatsAvailable) / (b.capacity || 1)
      return bFilled - aFilled
    })
  }
  return sorted
}

export interface CreateEventInput {
  id?: string
  name: string
  description: string
  date: string
  venue: string
  category: EventCategory
  capacity: number
  organizerId: string
  allowPast?: boolean
}

/** Validate and create a new event. */
export function createEvent(input: CreateEventInput): CampusEvent {
  if (!input.name || !input.name.trim()) {
    throw new Error('Event name is required.')
  }
  if (!input.venue || !input.venue.trim()) {
    throw new Error('Venue is required.')
  }
  if (!input.date) {
    throw new Error('Event date is required.')
  }
  const eventTime = new Date(input.date).getTime()
  if (isNaN(eventTime)) {
    throw new Error('Invalid event date.')
  }
  if (!input.allowPast && eventTime <= getCurrentDateTime().getTime()) {
    throw new Error('Event date must be in the future.')
  }
  if (!input.capacity || input.capacity <= 0 || !Number.isInteger(input.capacity)) {
    throw new Error('Capacity must be a positive whole number.')
  }

  const newEvent: CampusEvent = {
    id: input.id || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: input.name.trim(),
    description: input.description?.trim() || '',
    date: input.date,
    venue: input.venue.trim(),
    category: input.category,
    capacity: input.capacity,
    seatsAvailable: input.capacity,
    organizerId: input.organizerId,
    cancelled: false,
  }

  events.push(newEvent)
  return newEvent
}

/** Update an existing event. Adjusts seatsAvailable if capacity changes. */
export function updateEvent(
  id: string,
  updates: Partial<Pick<CampusEvent, 'name' | 'description' | 'date' | 'venue' | 'category' | 'capacity'>>,
): CampusEvent {
  const event = getEventById(id)
  if (!event) {
    throw new Error(`Event with id "${id}" not found.`)
  }

  if (updates.name !== undefined) {
    if (!updates.name.trim()) throw new Error('Event name cannot be empty.')
    event.name = updates.name.trim()
  }

  if (updates.description !== undefined) {
    event.description = updates.description.trim()
  }

  if (updates.date !== undefined) {
    const eventTime = new Date(updates.date).getTime()
    if (isNaN(eventTime)) throw new Error('Invalid event date.')
    event.date = updates.date
  }

  if (updates.venue !== undefined) {
    if (!updates.venue.trim()) throw new Error('Venue cannot be empty.')
    event.venue = updates.venue.trim()
  }

  if (updates.category !== undefined) {
    event.category = updates.category
  }

  if (updates.capacity !== undefined) {
    if (updates.capacity <= 0 || !Number.isInteger(updates.capacity)) {
      throw new Error('Capacity must be a positive whole number.')
    }
    const booked = event.capacity - event.seatsAvailable
    event.capacity = updates.capacity
    event.seatsAvailable = Math.max(0, updates.capacity - booked)
  }

  return event
}

/** Cancel an event. */
export function cancelEvent(id: string): CampusEvent {
  const event = getEventById(id)
  if (!event) {
    throw new Error(`Event with id "${id}" not found.`)
  }
  event.cancelled = true
  return event
}

/** Delete an event from the store. */
export function deleteEvent(id: string): boolean {
  const index = events.findIndex((e) => e.id === id)
  if (index !== -1) {
    events.splice(index, 1)
    return true
  }
  return false
}

