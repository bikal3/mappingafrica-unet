export default function SectionHeader({ badge, title, sub }) {
  return (
    <div className="text-center mb-2">
      <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-4">
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
      <p className="text-slate-400 max-w-xl mx-auto">{sub}</p>
    </div>
  );
}
