'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { UserRole } from '@/data/auth'

export default function AuthLandingPortal() {
  const router = useRouter()
  const { currentUser, loginWithIdentifier, signup, logout } = useAuth()

  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  // Signup fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const user = await loginWithIdentifier(identifier)
      setFeedback({
        type: 'success',
        text: `Welcome back, ${user.name}! Redirecting…`,
      })
      setTimeout(() => {
        const dest = user.role === 'organizer' ? '/organizer' : '/events'
        router.push(dest)
      }, 350)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed. Please verify your name or email.'
      setFeedback({
        type: 'error',
        text: message,
      })
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!name.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your full name.' })
      return
    }

    if (signupPassword && confirmPassword && signupPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)

    try {
      const created = await signup({
        name: name.trim(),
        role,
        email: email.trim() || undefined,
      })

      setFeedback({
        type: 'success',
        text: `Account created for ${created.name}! Logging you in…`,
      })

      setTimeout(() => {
        if (created.role === 'organizer') {
          router.push('/organizer')
        } else {
          router.push('/events')
        }
      }, 500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed.'
      setFeedback({ type: 'error', text: message })
      setLoading(false)
    }
  }

  // If already logged in, show authenticated state card
  if (currentUser) {
    return (
      <div
        className="card-surface"
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.06))',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius)',
            background: 'rgba(217, 119, 6, 0.08)',
            borderLeft: '4px solid var(--amber)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ink-soft)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Signed In As
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
              {currentUser.name}{' '}
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--amber)',
                  textTransform: 'capitalize',
                }}
              >
                ({currentUser.role === 'student' ? '🎓 Student' : '🏛️ Organizer'})
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
              {currentUser.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentUser.role === 'organizer' ? (
            <Link
              href="/organizer"
              target="_self"
              className="btn btn-primary"
              style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}
            >
              Open Organizer Console →
            </Link>
          ) : (
            <>
              <Link
                href="/events"
                target="_self"
                className="btn btn-primary"
                style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}
              >
                Browse Campus Events →
              </Link>
              <Link
                href="/registrations"
                target="_self"
                className="btn btn-secondary"
                style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}
              >
                View My Registrations
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={logout}
            className="btn btn-secondary"
            style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card-surface"
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.06))',
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          background: 'var(--paper-raised)',
          padding: 4,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--line)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setTab('signin')
            setFeedback(null)
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius)',
            border: 'none',
            fontWeight: tab === 'signin' ? 600 : 500,
            fontSize: 14,
            background: tab === 'signin' ? 'var(--paper)' : 'transparent',
            color: tab === 'signin' ? 'var(--ink)' : 'var(--ink-soft)',
            cursor: 'pointer',
            boxShadow: tab === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('signup')
            setFeedback(null)
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius)',
            border: 'none',
            fontWeight: tab === 'signup' ? 600 : 500,
            fontSize: 14,
            background: tab === 'signup' ? 'var(--paper)' : 'transparent',
            color: tab === 'signup' ? 'var(--ink)' : 'var(--ink-soft)',
            cursor: 'pointer',
            boxShadow: tab === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Create Account
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius)',
            fontSize: 13.5,
            background: feedback.type === 'success' ? 'var(--green-bg)' : 'var(--rust-bg)',
            color: feedback.type === 'success' ? 'var(--green)' : 'var(--rust)',
            border: `1px solid ${feedback.type === 'success' ? 'var(--green)' : 'var(--rust)'}`,
            fontWeight: 500,
          }}
        >
          {feedback.text}
        </div>
      )}

      {/* TAB 1: SIGN IN */}
      {tab === 'signin' && (
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Full Name or Campus Email <span style={{ color: 'var(--rust)' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Patel or your name"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)',
                background: 'var(--paper-raised)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)',
                background: 'var(--paper-raised)',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !identifier.trim()}
            style={{ width: '100%', padding: '10px', marginTop: 4, fontWeight: 600 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      )}

      {/* TAB 2: SIGN UP */}
      {tab === 'signup' && (
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Malhotra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)',
                background: 'var(--paper-raised)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Campus Email (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. vikram@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)',
                background: 'var(--paper-raised)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Select Role *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)',
                  border: role === 'student' ? '2px solid var(--amber)' : '1.5px solid var(--line)',
                  background: role === 'student' ? 'rgba(217, 119, 6, 0.08)' : 'var(--paper-raised)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>🎓 Student</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Register for events</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('organizer')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)',
                  border: role === 'organizer' ? '2px solid var(--amber)' : '1.5px solid var(--line)',
                  background: role === 'organizer' ? 'rgba(217, 119, 6, 0.08)' : 'var(--paper-raised)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>🏛️ Organizer</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Post & manage events</div>
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
              Create Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--line)',
                background: 'var(--paper-raised)',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '10px', marginTop: 4, fontWeight: 600 }}
          >
            {loading ? 'Creating Account…' : 'Create Account & Sign In'}
          </button>
        </form>
      )}

      {/* Guest browse option */}
      <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
        <Link
          href="/events"
          target="_self"
          style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 500 }}
        >
          Or continue as guest to Browse Events →
        </Link>
      </div>
    </div>
  )
}

