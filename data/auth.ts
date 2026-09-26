export type UserRole = 'student' | 'organizer'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  email?: string
}

const seedUsers: AppUser[] = [
  { id: 'stu-1', name: 'Aditi Rao', role: 'student', email: 'aditi.rao@campus.edu' },
  { id: 'org-1', name: 'Rohan Verma', role: 'organizer', email: 'rohan.verma@campus.edu' },
]

const globalForAuth = globalThis as unknown as {
  campusUsers?: AppUser[]
}

export const users: AppUser[] = globalForAuth.campusUsers || [...seedUsers]
globalForAuth.campusUsers = users

export function getUserById(id: string): AppUser | undefined {
  return users.find((user) => user.id === id)
}

export function getUserByNameOrEmail(identifier: string): AppUser | undefined {
  if (!identifier || !identifier.trim()) return undefined
  const cleaned = identifier.trim().toLowerCase()

  // 1. Exact match by name, email, or id
  const exact = users.find(
    (u) =>
      u.name.toLowerCase() === cleaned ||
      (u.email && u.email.toLowerCase() === cleaned) ||
      u.id.toLowerCase() === cleaned,
  )
  if (exact) return exact

  // 2. Case-insensitive substring match on name or email
  return users.find(
    (u) =>
      u.name.toLowerCase().includes(cleaned) ||
      (u.email && u.email.toLowerCase().includes(cleaned)),
  )
}

export interface CreateUserInput {
  name: string
  role: UserRole
  email?: string
  id?: string
}

export function createUser(input: CreateUserInput): AppUser {
  if (!input.name || !input.name.trim()) {
    throw new Error('Name is required.')
  }
  if (!input.role || (input.role !== 'student' && input.role !== 'organizer')) {
    throw new Error('Valid role (student or organizer) is required.')
  }

  const prefix = input.role === 'student' ? 'stu' : 'org'
  const id = input.id || `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const newUser: AppUser = {
    id,
    name: input.name.trim(),
    role: input.role,
    email:
      input.email?.trim() ||
      `${input.name.trim().toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
  }

  users.push(newUser)
  return newUser
}

