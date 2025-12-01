import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import type  { Event } from "../components/EventCard";
import events from "../data/events.json";

const Events = () => {
  const typedEvents = events as Event[];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <SectionHeader
        title="Events"
        subtitle="Talks, workshops, star parties and project sessions."
      />
      <div className="space-y-4">
        {typedEvents.length === 0 && (
          <p className="text-sm text-slate-400">
            No events announced yet. Check back soon.
          </p>
        )}
        {typedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
