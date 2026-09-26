import Link from 'next/link'
import { getEventById } from '@/data/events'
import EmptyState from '@/components/EmptyState'
import EventRegistration from '@/components/EventRegistration'

export default function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const event = getEventById(params.id)

  if (!event) {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This event isn't on the board"
          description="It may have been removed, or the link might be wrong. Head back to the full listing to find what you're looking for."
          action={
            <Link href="/events" target="_self" className="btn btn-primary">
              Back to events
            </Link>
          }
        />
      </section>
    )
  }

  return <EventRegistration initialEvent={event} />
}


