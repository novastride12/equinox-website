const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-400 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} Equinox Space Technology Club</span>
        <span className="text-xs">
          Hosted on GitHub Pages • Built with React & Tailwind
        </span>
      </div>
    </footer>
  );
};

export default Footer;
