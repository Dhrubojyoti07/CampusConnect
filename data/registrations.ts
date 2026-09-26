import { getEventById, isPastEvent } from './events'
import { getUserById } from './auth'

// Seed data for registrations, so the "My Registrations" and Organizer
// pages have something real to display before participants build the
// actual registration flow (Task 2 and Task 3).

export type RegistrationStatus = 'confirmed' | 'cancelled'

export interface Registration {
  id: string
  eventId: string
  studentId: string
  status: RegistrationStatus
  registeredAt: string // ISO date string
}

// NOTE FOR PARTICIPANTS: this array is the "database" of registrations.
// Task 2 (Registration) means pushing new items into this array when a
// student registers. Task 3 (Cancellation) means updating an item's
// status here. Keep using this same array — don't create a second store.
const seedRegistrations: Registration[] = [
  {
    id: 'reg-01',
    eventId: 'evt-01',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-10T10:15:00',
  },
  {
    id: 'reg-02',
    eventId: 'evt-04',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-08-20T09:00:00',
  },
  {
    id: 'reg-03',
    eventId: 'evt-09',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-12T18:40:00',
  },
]

const globalForRegistrations = globalThis as unknown as {
  campusRegistrations?: Registration[]
}
export const registrations: Registration[] =
  globalForRegistrations.campusRegistrations || [...seedRegistrations]
globalForRegistrations.campusRegistrations = registrations

/** Simple lookup used by the placeholder "My Registrations" page. */
export function getRegistrationsForStudent(studentId: string): Registration[] {
  return registrations.filter((reg) => reg.studentId === studentId)
}

/** Check if student is actively registered for an event. */
export function isStudentRegisteredForEvent(
  studentId: string,
  eventId: string,
): boolean {
  return registrations.some(
    (reg) =>
      reg.studentId === studentId &&
      reg.eventId === eventId &&
      reg.status === 'confirmed',
  )
}

export interface RegisterResult {
  success: boolean
  message: string
  registration?: Registration
}

/** Register a student for an event with full validation and seat decrement. */
export function registerStudentForEvent(
  studentId: string,
  eventId: string,
): RegisterResult {
  const user = getUserById(studentId)
  if (!user || user.role !== 'student') {
    return { success: false, message: 'Only students can register for events.' }
  }

  const event = getEventById(eventId)
  if (!event) {
    return { success: false, message: 'Event not found.' }
  }

  if (event.cancelled) {
    return { success: false, message: 'Cannot register for a cancelled event.' }
  }

  if (isPastEvent(event)) {
    return {
      success: false,
      message: 'Registration is closed because this event has already ended (past event).',
    }
  }

  if (event.seatsAvailable <= 0) {
    return { success: false, message: 'This event is full.' }
  }

  const existingReg = registrations.find(
    (r) => r.studentId === studentId && r.eventId === eventId,
  )

  if (existingReg) {
    if (existingReg.status === 'confirmed') {
      return {
        success: false,
        message: 'You are already registered for this event.',
      }
    }
    // Re-confirm previously cancelled registration
    existingReg.status = 'confirmed'
    existingReg.registeredAt = new Date().toISOString()
    event.seatsAvailable = Math.max(0, event.seatsAvailable - 1)
    return {
      success: true,
      message: 'Registration confirmed!',
      registration: existingReg,
    }
  }

  const newReg: Registration = {
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId,
    studentId,
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
  }

  registrations.push(newReg)
  event.seatsAvailable = Math.max(0, event.seatsAvailable - 1)
  return {
    success: true,
    message: 'Registration confirmed!',
    registration: newReg,
  }
}

export interface CancelResult {
  success: boolean
  message: string
}

/** Cancel a student registration and increment seats available. */
export function cancelStudentRegistration(
  registrationId: string,
  studentId: string,
): CancelResult {
  const reg = registrations.find(
    (r) => r.id === registrationId && r.studentId === studentId,
  )

  if (!reg) {
    return { success: false, message: 'Registration not found.' }
  }

  if (reg.status === 'cancelled') {
    return { success: false, message: 'This registration is already cancelled.' }
  }

  reg.status = 'cancelled'

  const event = getEventById(reg.eventId)
  if (event && event.seatsAvailable < event.capacity) {
    event.seatsAvailable += 1
  }

  return { success: true, message: 'Registration cancelled successfully.' }
}

