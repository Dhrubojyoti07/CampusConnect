'use client'



import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { users, AppUser, createUser, CreateUserInput } from '@/data/auth'

interface AuthContextValue {
  currentUser: AppUser | null
  setCurrentUserId: (id: string | null) => void
  allUsers: AppUser[]
  login: (id: string) => void
  loginWithIdentifier: (identifier: string) => Promise<AppUser>
  logout: () => void
  signup: (input: CreateUserInput) => Promise<AppUser>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userList, setUserList] = useState<AppUser[]>(() => [...users])
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_connect_user_id')
      if (saved) {
        return saved
      }
    }
    return null
  })

  // Synchronize with server users on mount
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserList(data)
          data.forEach((u) => {
            if (!users.some((existing) => existing.id === u.id)) {
              users.push(u)
            }
          })
        }
      })
      .catch(() => {})
  }, [])

  const setCurrentUserId = (id: string | null) => {
    setCurrentUserIdState(id)
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('campus_connect_user_id', id)
      } else {
        localStorage.removeItem('campus_connect_user_id')
      }
    }
  }

  const login = (id: string) => {
    setCurrentUserId(id)
  }

  const logout = () => {
    setCurrentUserId(null)
  }

  const loginWithIdentifier = async (identifier: string): Promise<AppUser> => {
    if (!identifier || !identifier.trim()) {
      throw new Error('Please enter your full name or campus email.')
    }
    const query = identifier.trim().toLowerCase()

    // Refresh user list from server to pick up any newly registered users
    let latestUsers = userList
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          latestUsers = data
          setUserList(data)
          data.forEach((u) => {
            if (!users.some((existing) => existing.id === u.id)) {
              users.push(u)
            }
          })
        }
      }
    } catch {
      // fallback to userList
    }

    // 1. Exact match by name, email, or id
    let matched = latestUsers.find(
      (u) =>
        u.name.toLowerCase() === query ||
        (u.email && u.email.toLowerCase() === query) ||
        u.id.toLowerCase() === query,
    )

    // 2. Substring match fallback (e.g. user typed first name or partial)
    if (!matched) {
      matched = latestUsers.find(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          (u.email && u.email.toLowerCase().includes(query)),
      )
    }

    if (!matched) {
      throw new Error(
        `No account found matching "${identifier.trim()}". Please verify the name you used during signup or create a new account.`,
      )
    }

    setCurrentUserId(matched.id)
    return matched
  }

  const signup = async (input: CreateUserInput): Promise<AppUser> => {
    // 1. Call server API
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const created: AppUser = await res.json()
    if (!res.ok) {
      throw new Error((created as unknown as { error?: string }).error || 'Failed to create user')
    }

    // 2. Sync client memory
    if (!users.some((u) => u.id === created.id)) {
      users.push(created)
    }

    // 3. Update state & auto-login
    setUserList((prev) => (prev.some((u) => u.id === created.id) ? prev : [...prev, created]))
    setCurrentUserId(created.id)

    return created
  }

  const currentUser: AppUser | null = currentUserId
    ? (userList.find((u) => u.id === currentUserId) ??
       users.find((u) => u.id === currentUserId) ??
       null)
    : null

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUserId,
        allUsers: userList,
        login,
        loginWithIdentifier,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
