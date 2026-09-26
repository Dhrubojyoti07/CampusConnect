'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  const { currentUser, loginWithIdentifier, logout } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
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
        const target =
          redirectUrl || (user.role === 'organizer' ? '/organizer' : '/events')
        router.push(target)
      }, 400)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      setFeedback({
        type: 'error',
        text: message,
      })
      setLoading(false)
    }
  }

  return (
    <section className="shell" style={{ padding: '56px 0 80px' }}>
      <div
        style={{
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="eyebrow-tag">campus connect auth</span>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Sign In</h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 15 }}>
            Access event registrations, ticketing, or organizer consoles.
          </p>
        </div>

        {/* Current Session Banner if already signed in */}
        {currentUser && (
          <div
            className="card-surface"
            style={{
              padding: '16px 20px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              borderLeft: '4px solid var(--amber)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Currently Signed In
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
                {currentUser.name}{' '}
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--ink-soft)',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  ({currentUser.role})
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href={currentUser.role === 'organizer' ? '/organizer' : '/events'}
                target="_self"
                className="btn btn-primary"
                style={{ fontSize: 12.5, padding: '6px 12px' }}
              >
                Go to {currentUser.role === 'organizer' ? 'Console' : 'Events'} →
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={logout}
                style={{ fontSize: 12.5, padding: '6px 12px' }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              marginBottom: 20,
              background:
                feedback.type === 'success'
                  ? 'var(--green-bg)'
                  : 'var(--rust-bg)',
              color:
                feedback.type === 'success' ? 'var(--green)' : 'var(--rust)',
              border: `1px solid ${
                feedback.type === 'success' ? 'var(--green)' : 'var(--rust)'
              }`,
              fontWeight: 500,
            }}
          >
            {feedback.text}
          </div>
        )}

        {/* Main Card */}
        <div className="card-surface" style={{ padding: 28 }}>
          <form
            onSubmit={handleFormSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div>
              <label
                htmlFor="identifier-input"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Full Name or Campus Email <span style={{ color: 'var(--rust)' }}>*</span>
              </label>
              <input
                id="identifier-input"
                type="text"
                required
                placeholder="e.g. Maya Patel or your name"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--line)',
                  background: 'var(--paper-raised)',
                  fontSize: 14.5,
                  color: 'var(--ink)',
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  marginTop: 4,
                  display: 'block',
                }}
              >
                Enter the name or email you registered with (e.g. student or organizer account).
              </span>
            </div>

            <div>
              <label
                htmlFor="password-input"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Password
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--line)',
                  background: 'var(--paper-raised)',
                  fontSize: 14.5,
                  color: 'var(--ink)',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !identifier.trim()}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 6,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Switch to Signup */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--line)',
              textAlign: 'center',
              fontSize: 14,
              color: 'var(--ink-soft)',
            }}
          >
            Don't have an account?{' '}
            <Link
              href="/signup"
              target="_self"
              style={{
                fontWeight: 600,
                color: 'var(--amber)',
                textDecoration: 'none',
              }}
            >
              Create account here →
            </Link>
          </div>
        </div>

        {/* Quick Back to Events */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href="/events"
            target="_self"
            style={{
              fontSize: 13.5,
              color: 'var(--ink-soft)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            ← Back to Campus Events
          </Link>
        </div>
      </div>
    </section>
  )
}

