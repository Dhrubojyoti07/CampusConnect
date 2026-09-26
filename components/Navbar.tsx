'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/registrations', label: 'My Registrations' },
  { href: '/organizer', label: 'Organizer' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()

  return (
    <header
      style={{
        borderBottom: '1.5px solid var(--line)',
        background: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          height: 68,
        }}
      >
        <Link
          href="/"
          target="_self"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--amber)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--ink)',
            }}
          >
            Campus Connect
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul style={{ display: 'flex', gap: 4 }}>
            {LINKS.filter(
              (link) =>
                link.href !== '/organizer' || currentUser?.role === 'organizer',
            ).map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_self"
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius)',
                      fontSize: 14.5,
                      fontWeight: 500,
                      textDecoration: 'none',
                      color: active ? 'var(--ink)' : 'var(--ink-soft)',
                      background: active ? 'var(--slate-bg)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentUser ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <span className="eyebrow-tag" style={{ textTransform: 'capitalize' }}>
                  {currentUser.role === 'student' ? '🎓 Student' : '🏛️ Organizer'}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>
                  {currentUser.name}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                target="_self"
                className="btn btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: pathname === '/login' ? 'var(--slate-bg)' : undefined,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                target="_self"
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
