import { useState, useEffect } from "react";
import { Satellite } from "lucide-react";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#task1", label: "MNIST" },
  { href: "#dataset", label: "Dataset" },
  { href: "#architecture", label: "UNet" },
  { href: "#finetuning", label: "Fine-tuning" },
  { href: "#results", label: "Results" },
  { href: "#gallery", label: "Predictions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-900/95 backdrop-blur shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <Satellite size={20} />
          <span className="hidden sm:inline text-sm">Satellite Segmentation</span>
        </div>
        <div className="flex gap-1 sm:gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors px-1 py-1"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
