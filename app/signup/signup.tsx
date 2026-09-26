'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { UserRole } from '@/data/auth'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFeedback(null)

    if (!name.trim()) {
      setFormError('Please enter your full name.')
      return
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setFormError('Passwords do not match.')
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
        text: `Account created for ${created.name}! Redirecting…`,
      })

      setTimeout(() => {
        if (created.role === 'organizer') {
          router.push('/organizer')
        } else {
          router.push('/events')
        }
      }, 700)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account.'
      setFormError(message)
      setLoading(false)
    }
  }

  return (
    <section className="shell" style={{ padding: '56px 0 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="eyebrow-tag">join campus connect</span>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Create an Account</h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 15 }}>
            Sign up to find campus events, reserve seats, or post new activities.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              marginBottom: 20,
              background: 'var(--green-bg)',
              color: 'var(--green)',
              border: '1px solid var(--green)',
              fontWeight: 500,
            }}
          >
            {feedback.text}
          </div>
        )}

        {formError && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              marginBottom: 20,
              background: 'var(--rust-bg)',
              color: 'var(--rust)',
              border: '1px solid var(--rust)',
              fontWeight: 500,
            }}
          >
            {formError}
          </div>
        )}

        {/* Main Card */}
        <div className="card-surface" style={{ padding: 28 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Full Name <span style={{ color: 'var(--rust)' }}>*</span>
              </label>
              <input
                id="signup-name"
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Campus Email (Optional)
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="e.g. vikram.m@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Role Selection */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--ink)',
                }}
              >
                Choose Your Role <span style={{ color: 'var(--rust)' }}>*</span>
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius)',
                    border:
                      role === 'student'
                        ? '2px solid var(--amber)'
                        : '1.5px solid var(--line)',
                    background:
                      role === 'student'
                        ? 'rgba(217, 119, 6, 0.08)'
                        : 'var(--paper-raised)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)' }}>
                    🎓 Student
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    Register for campus events & workshops
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('organizer')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius)',
                    border:
                      role === 'organizer'
                        ? '2px solid var(--amber)'
                        : '1.5px solid var(--line)',
                    background:
                      role === 'organizer'
                        ? 'rgba(217, 119, 6, 0.08)'
                        : 'var(--paper-raised)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)' }}>
                    🏛️ Organizer
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    Create & manage campus club events
                  </span>
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Create Password
              </label>
              <input
                id="signup-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--ink)',
                }}
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 6,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {loading ? 'Creating Account…' : 'Sign Up'}
            </button>
          </form>

          {/* Switch to Login */}
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
            Already have an account?{' '}
            <Link
              href="/login"
              target="_self"
              style={{
                fontWeight: 600,
                color: 'var(--amber)',
                textDecoration: 'none',
              }}
            >
              Log in here →
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

