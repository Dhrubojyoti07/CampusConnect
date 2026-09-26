import Link from 'next/link'
import { events, isPastEvent } from '@/data/events'
import EventCard from '@/components/EventCard'
import AuthLandingPortal from '@/components/AuthLandingPortal'

export default function HomePage() {
  const upcoming = events
    .filter((e) => !isPastEvent(e) && !e.cancelled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)

  const venueCount = new Set(events.map((e) => e.venue)).size
  const upcomingCount = events.filter((e) => !isPastEvent(e)).length

  return (
    <>
      <section className="shell" style={{ padding: '48px 0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 40,
            alignItems: 'start',
          }}
          className="hero-grid"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span className="eyebrow-tag">campus portal & events</span>
              <h1 style={{ fontSize: 'clamp(32px, 3.8vw, 46px)', marginTop: 10 }}>
                Every club, match, and workshop on campus — in one place.
              </h1>
              <p style={{ fontSize: 16.5, marginTop: 12 }}>
                Campus Connect is where student organizations post their events
                and where you register for them. Sign in or create a student / organizer
                account to get started.
              </p>
            </div>

            <div
              className="card-surface"
              style={{
                padding: 20,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <Stat label="Upcoming events" value={String(upcomingCount)} />
              <Stat label="Campus venues" value={String(venueCount)} />
              <Stat label="Categories" value="6" />
              <Stat
                label="Total seats posted"
                value={String(events.reduce((s, e) => s + e.capacity, 0))}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/events" target="_self" className="btn btn-primary">
                Browse events board →
              </Link>
            </div>
          </div>

          {/* Authentication & Signup Landing Portal */}
          <div>
            <AuthLandingPortal />
          </div>
        </div>
      </section>

      <section className="shell" style={{ padding: '24px 0 64px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 22 }}>Coming up soon</h2>
          <Link
            href="/events"
            target="_self"
            style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            See full listing →
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{label}</div>
    </div>
  )
}
