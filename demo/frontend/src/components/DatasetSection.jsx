import { SectionHeader } from "./Task1Section";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const splitData = [
  { name: "Train", value: 500, color: "#3b82f6" },
  { name: "Validate", value: 100, color: "#8b5cf6" },
  { name: "Test", value: 50, color: "#10b981" },
];

const classData = [
  { name: "Agricultural Field (Class 2)", value: 15, color: "#1e90ff" },
  { name: "Agricultural Field (Class 1)", value: 72, color: "#22c55e" },
  { name: "Null / Other", value: 13, color: "#475569" },
];

const dataCards = [
  { label: "Total Images", value: "4,005", sub: "MappingAfrica v2.0.0" },
  { label: "Image Size", value: "256×256", sub: "Pixel tiles, 4 channels" },
  { label: "Fine-tune Set", value: "650", sub: "500 train + 100 val + 50 test" },
  { label: "Countries", value: "5+", sub: "Angola, Zambia, Malawi…" },
  { label: "Temporal Range", value: "2017–2023", sub: "Multi-year satellite imagery" },
  { label: "Task", value: "3-class", sub: "Agricultural Field / Null" },
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
            <p className="text-slate-500 text-xs mb-4">Approximate pixel-level proportions</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={classData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {classData.map((e, i) => <Cell key={i} fill={e.color} />)}
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
            {[
              { color: "#3c3c3c", name: "Null / Background", desc: "No label data available" },
              { color: "#22c55e", name: "Agricultural Field (Class 1)", desc: "Cultivated agricultural land" },
              { color: "#1e90ff", name: "Agricultural Field (Class 2)", desc: "Cultivated agricultural land" },
            ].map((c) => (
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
