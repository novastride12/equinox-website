import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Join / Contact" },
];

interface NavbarProps {
  onLogoClick: () => void;
}

const Navbar = ({ onLogoClick }: NavbarProps) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
        {/* Left: logo + title */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
        >
          <div className="h-9 w-9 rounded-full border border-cyan-400 flex items-center justify-center text-[10px] tracking-[0.2em]">
            EQX
          </div>
          <div className="leading-tight text-left">
            <div className="font-semibold text-sm sm:text-base">Equinox</div>
            <div className="text-[11px] text-slate-400">
              Space Technology Club
            </div>
          </div>
        </button>

        {/* Right: nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "pb-0.5 border-b border-transparent hover:border-cyan-400",
                  isActive
                    ? "text-cyan-300 border-cyan-400"
                    : "text-slate-300 hover:text-cyan-200",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
