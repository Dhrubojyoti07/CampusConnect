import { describe, it, expect } from 'vitest'
import { users, getUserById, createUser, getUserByNameOrEmail } from '@/data/auth'

describe('Authentication and User Lookup', () => {
  it('includes student and organizer default users', () => {
    expect(users.length).toBeGreaterThanOrEqual(2)
    const student = users.find((u) => u.role === 'student')
    const organizer = users.find((u) => u.role === 'organizer')

    expect(student).toBeDefined()
    expect(organizer).toBeDefined()
    expect(student?.id).toBe('stu-1')
    expect(organizer?.id).toBe('org-1')
  })

  it('retrieves user by valid ID', () => {
    const user = getUserById('stu-1')
    expect(user).toBeDefined()
    expect(user?.name).toBe('Aditi Rao')
    expect(user?.role).toBe('student')
  })

  it('returns undefined for nonexistent user ID', () => {
    const user = getUserById('unknown-999')
    expect(user).toBeUndefined()
  })

  it('retrieves user by name or email (exact and case-insensitive)', () => {
    const byName = getUserByNameOrEmail('Aditi Rao')
    expect(byName?.id).toBe('stu-1')

    const byNameLower = getUserByNameOrEmail('aditi rao')
    expect(byNameLower?.id).toBe('stu-1')

    const byEmail = getUserByNameOrEmail('rohan.verma@campus.edu')
    expect(byEmail?.id).toBe('org-1')

    const byPartial = getUserByNameOrEmail('rohan')
    expect(byPartial?.id).toBe('org-1')

    const unknown = getUserByNameOrEmail('nonexistent-person')
    expect(unknown).toBeUndefined()
  })

  it('creates a new student user and allows retrieval by ID and by Name', () => {
    const newUser = createUser({
      name: 'Maya Patel',
      role: 'student',
      email: 'maya.p@campus.edu',
    })

    expect(newUser.id).toMatch(/^stu-/)
    expect(newUser.name).toBe('Maya Patel')
    expect(newUser.role).toBe('student')
    expect(newUser.email).toBe('maya.p@campus.edu')

    const retrieved = getUserById(newUser.id)
    expect(retrieved).toEqual(newUser)

    const retrievedByName = getUserByNameOrEmail('Maya Patel')
    expect(retrievedByName?.id).toBe(newUser.id)
  })

  it('creates a new organizer user with auto-generated email if omitted', () => {
    const newOrg = createUser({
      name: 'Vikram Malhotra',
      role: 'organizer',
    })

    expect(newOrg.id).toMatch(/^org-/)
    expect(newOrg.name).toBe('Vikram Malhotra')
    expect(newOrg.role).toBe('organizer')
    expect(newOrg.email).toBe('vikram.malhotra@campus.edu')

    const retrieved = getUserById(newOrg.id)
    expect(retrieved).toEqual(newOrg)
  })

  it('validates required fields when creating user', () => {
    expect(() => createUser({ name: '', role: 'student' })).toThrow('Name is required.')
    // @ts-expect-error invalid role check
    expect(() => createUser({ name: 'Invalid', role: 'admin' })).toThrow('Valid role (student or organizer) is required.')
  })
})

