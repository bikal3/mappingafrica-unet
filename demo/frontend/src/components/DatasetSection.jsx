import { SectionHeader } from "./Task1Section";
import { CLASS_LEGEND, CLASS_SHARE } from "../data/project";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const splitData = [
  { name: "Train", value: 500, color: "#3b82f6" },
  { name: "Validate", value: 100, color: "#8b5cf6" },
  { name: "Test", value: 50, color: "#10b981" },
];

const classData = CLASS_LEGEND.map((c) => ({
  name: c.name,
  value: CLASS_SHARE[c.id],
  color: c.color,
}));

const dataCards = [
  { label: "Total Images", value: "4,005", sub: "MappingAfrica v2.0.0" },
  { label: "Image Size", value: "256×256", sub: "Pixel tiles, 4 channels" },
  { label: "Fine-tune Set", value: "650", sub: "500 train + 100 val + 50 test" },
  { label: "Countries", value: "5+", sub: "Angola, Zambia, Malawi…" },
  { label: "Temporal Range", value: "2017–2023", sub: "Multi-year satellite imagery" },
  { label: "Task", value: "3-class", sub: "Non-field / interior / boundary" },
];

export default function DatasetSection() {
  return (
    <section id="dataset" className="py-24 px-6 bg-slate-900/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Dataset"
          title="MappingAfrica Satellite Data"
          sub="Multi-spectral 4-channel satellite imagery for agricultural field segmentation across Africa"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {dataCards.map((c) => (
            <div key={c.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">{c.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{c.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-1">Fine-tune Data Split</h3>
            <p className="text-slate-500 text-xs mb-4">Zambia (ZM) region subset</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={splitData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {splitData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(v, n) => [`${v} samples`, n]}
                />
                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-1">Class Distribution</h3>
            <p className="text-slate-500 text-xs mb-4">Mean pixel share across the 50 test tiles</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={classData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {/* Stroke keeps the near-black null class visible on the dark card
                      without misreporting its fill. */}
                  {classData.map((e, i) => (
                    <Cell key={i} fill={e.color} stroke="#64748b" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                  formatter={(v, n) => [`~${v}%`, n]}
                />
                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Segmentation Classes</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {CLASS_LEGEND.map((c) => (
              <div key={c.name} className="flex items-start gap-3">
                <div className="w-4 h-4 rounded mt-0.5 flex-shrink-0" style={{ backgroundColor: c.color }} />
                <div>
                  <div className="text-slate-200 text-sm font-medium">{c.name}</div>
                  <div className="text-slate-500 text-xs">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
