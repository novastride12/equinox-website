import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import events from "../data/events.json";
import EventCard from "../components/EventCard";
import type { Event } from "../components/EventCard";

const Home = () => {
  const typedEvents = events as Event[];
  const upcoming = typedEvents.slice(0, 2);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section
  className="min-h-screen flex items-center justify-center text-center"
>
  <div className="max-w-3xl px-6 space-y-6 relative z-10">
    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
      Space • Tech • Community
    </p>

    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
      Equinox Space Technology Club
    </h1>

    <p className="text-sm text-slate-300">
      Student-run club for space and technology—rocketry, satellites,
      space systems and astronomy. Learn by building, experimenting and
      exploring with a team that&apos;s obsessed with space.
    </p>

    <div className="flex flex-wrap gap-3 justify-center text-sm">
      <Link
        to="/events"
        className="px-4 py-2 rounded-full bg-cyan-400 text-slate-950 font-medium hover:bg-cyan-300 transition"
      >
        View Upcoming Events
      </Link>
      <Link
        to="/contact"
        className="px-4 py-2 rounded-full border border-slate-700 hover:border-cyan-400 text-slate-200 transition"
      >
        Join the Club
      </Link>
    </div>

    <div className="flex gap-10 justify-center text-xs text-slate-400 pt-4">
      <div>
        <div className="text-lg font-semibold text-slate-50">
          {typedEvents.length}
        </div>
        <div>Events this semester</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-50">
          +25
        </div>
        <div>Active members</div>
      </div>
    </div>
  </div>
</section>

      {/* UPCOMING EVENTS */}
      <section>
        <SectionHeader
          title="Upcoming Events"
          subtitle="Hands-on sessions, workshops and talks lined up this semester."
        />
        <div className="space-y-5">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-4 text-right text-xs">
          <Link
            to="/events"
            className="text-slate-400 hover:text-cyan-300 underline underline-offset-4"
          >
            View all events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
