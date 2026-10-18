import { useState, useEffect } from "react";
import { Satellite, Menu, X, Sun, Moon } from "lucide-react";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#dataset", label: "Dataset" },
  { href: "#architecture", label: "UNet" },
  { href: "#finetuning", label: "Fine-tuning" },
  { href: "#results", label: "Results" },
  { href: "#gallery", label: "Predictions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private window); the switch still works for this visit.
    }
    setTheme(next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-slate-900/95 backdrop-blur shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <a
          href="#overview"
          className="flex items-center gap-2 text-blue-400 font-semibold flex-shrink-0"
        >
          <Satellite size={20} />
          <span className="hidden sm:inline text-sm">Satellite Segmentation</span>
        </a>

        {/* All seven labels need ~690px at text-sm, so they only go inline at md. */}
        <div className="hidden md:flex gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 hover:text-white transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 -mr-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden p-1 text-slate-300 hover:text-white transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="nav-menu"
        className={`${open ? "block" : "hidden"} md:hidden border-t border-slate-800`}
      >
        <div className="px-6 flex flex-col">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-300 hover:text-white transition-colors py-3 border-b border-slate-800/60 last:border-0"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
