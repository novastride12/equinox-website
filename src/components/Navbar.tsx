import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogoClick: () => void;
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "events", label: "Events" },
  { id: "team", label: "Team" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
];

const Navbar = ({ onLogoClick }: NavbarProps) => {
  const [active, setActive] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const onScroll = () => {
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => {
            if (location.pathname !== "/") {
              navigate("/");
            }
            onLogoClick();
          }}
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
        >
          <img
            src="/logo.jpeg"
            alt="Equinox logo"
            className="h-9 w-9 rounded-full border border-cyan-400 object-contain shadow-[0_0_14px_rgba(34,211,238,0.45)]"
          />
          <div className="leading-tight text-left">
            <div className="font-semibold text-sm sm:text-base">
              Equinox
            </div>
            <div className="text-[11px] text-slate-400">
              Space Technology Club
            </div>
          </div>
        </button>

        {/* Nav items */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={[
                "pb-0.5 border-b transition-colors",
                active === item.id
                  ? "text-cyan-300 border-cyan-400"
                  : "text-slate-300 border-transparent hover:text-cyan-200 hover:border-cyan-400",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/contact"
            className="pb-0.5 text-slate-300 hover:text-cyan-200 border-b border-transparent hover:border-cyan-400 transition-colors"
          >
            Join / Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
