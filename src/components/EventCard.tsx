import ReactMarkdown from "react-markdown";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  poster: string;
  description: string;
  registerUrl: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
      {/* Poster */}
      <div className="md:w-64 shrink-0">
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-44 md:h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            {event.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {event.date} • {event.time}
          </p>
          <p className="text-xs text-slate-400">Venue: {event.venue}</p>
        </div>

        <div className="text-sm text-slate-300 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{event.description}</ReactMarkdown>
        </div>

        <div className="mt-2">
          <a
            href={event.registerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-cyan-400 text-cyan-200 hover:bg-cyan-500/10 transition"
          >
            Register
            <span className="text-xs">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
