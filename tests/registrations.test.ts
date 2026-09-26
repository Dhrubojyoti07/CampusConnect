import { describe, it, expect } from 'vitest'
import {
  getRegistrationsForStudent,
  registerStudentForEvent,
  cancelStudentRegistration,
  isStudentRegisteredForEvent,
} from '@/data/registrations'
import { getEventById, events } from '@/data/events'

describe('getRegistrationsForStudent', () => {
  it('returns only the seeded registrations belonging to that student', () => {
    const mine = getRegistrationsForStudent('stu-1')
    expect(mine.length).toBe(3)
    expect(mine.every((reg) => reg.studentId === 'stu-1')).toBe(true)
  })
})

describe('Student Registration (Task 2 & 5)', () => {
  it('successfully registers a student and decreases available seats', () => {
    const event = getEventById('evt-03')!
    const initialSeats = event.seatsAvailable

    const result = registerStudentForEvent('stu-1', 'evt-03')
    expect(result.success).toBe(true)
    expect(event.seatsAvailable).toBe(initialSeats - 1)
    expect(isStudentRegisteredForEvent('stu-1', 'evt-03')).toBe(true)
  })

  it('prevents duplicate active registrations for the same event', () => {
    const duplicate = registerStudentForEvent('stu-1', 'evt-03')
    expect(duplicate.success).toBe(false)
    expect(duplicate.message).toMatch(/already registered/i)
  })

  it('blocks registration when event is full', () => {
    // evt-02 is full (seatsAvailable = 0)
    const result = registerStudentForEvent('stu-1', 'evt-02')
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/full/i)
  })

  it('blocks registration for past events', () => {
    // evt-04 date is 2026-09-05 (past relative to TODAY)
    const result = registerStudentForEvent('stu-1', 'evt-10')
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/past/i)
  })

  it('requires a student role to register', () => {
    const result = registerStudentForEvent('org-1', 'evt-05')
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/students/i)
  })
})

describe('Cancellation (Task 3 & 5)', () => {
  it('cancelling a registration increases available seats and marks status as cancelled', () => {
    const event = getEventById('evt-03')!
    const seatsBefore = event.seatsAvailable

    const studentRegs = getRegistrationsForStudent('stu-1')
    const regToCancel = studentRegs.find(
      (r) => r.eventId === 'evt-03' && r.status === 'confirmed',
    )!

    const cancelResult = cancelStudentRegistration(regToCancel.id, 'stu-1')
    expect(cancelResult.success).toBe(true)
    expect(regToCancel.status).toBe('cancelled')
    expect(event.seatsAvailable).toBe(seatsBefore + 1)
  })
})

