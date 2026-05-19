import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SectionHeader } from "./Task1Section";
import { TrendingDown, TrendingUp } from "lucide-react";

const epochs = [1,2,3,4,5,6,7,8,9,10];
const trainLoss  = [0.5446,0.5035,0.4776,0.4597,0.4486,0.4458,0.4408,0.4320,0.4272,0.4229];
const valLoss    = [0.5567,0.5133,0.4811,0.4809,0.4626,0.4538,0.4587,0.4555,0.4503,0.4456];
const valAcc     = [0.7891,0.8018,0.8147,0.8091,0.8181,0.8224,0.8190,0.8188,0.8193,0.8210];
const valMiou    = [0.3994,0.4072,0.4099,0.4126,0.4109,0.4136,0.4148,0.4116,0.4154,0.4118];

const lossData = epochs.map((e, i) => ({
  epoch: e,
  "Train Loss": trainLoss[i],
  "Val Loss": valLoss[i],
}));

const metricData = epochs.map((e, i) => ({
  epoch: e,
  "Val Accuracy": +(valAcc[i] * 100).toFixed(2),
  "Val mIoU": +(valMiou[i] * 100).toFixed(2),
}));

const tooltipStyle = {
  contentStyle: { background: "#1e293b", border: "1px solid #334155", borderRadius: 8 },
  labelStyle: { color: "#e2e8f0" },
};

export default function ResultsSection() {
  return (
    <section id="results" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        badge="Results"
        title="Training & Evaluation"
        sub="10 epochs of fine-tuning on 500 Zambia satellite samples"
      />

      {/* Final metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
        {[
          { label: "Final Train Loss", value: "0.4229", icon: TrendingDown, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Final Val Loss", value: "0.4456", icon: TrendingDown, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Test Pixel Accuracy", value: "81.79%", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Test mIoU", value: "43.31%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((m) => (
          <div key={m.label} className={`${m.bg} border border-slate-700/40 rounded-2xl p-5 text-center`}>
            <m.icon className={`${m.color} mx-auto mb-2`} size={24} />
            <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-slate-400 text-xs mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <ChartCard title="Loss Curves" sub="Train and validation loss over 10 epochs">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lossData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="epoch" tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[0.38, 0.58]} tickCount={6} />
              <Tooltip {...tooltipStyle} formatter={(v) => v.toFixed(4)} />
              <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
              <Line type="monotone" dataKey="Train Loss" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Val Loss" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Validation Metrics" sub="Accuracy and mIoU improve over training">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={metricData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="epoch" tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[35, 90]} unit="%" />
              <Tooltip {...tooltipStyle} formatter={(v) => `${v.toFixed(2)}%`} />
              <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
              <Line type="monotone" dataKey="Val Accuracy" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Val mIoU" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Epoch table */}
      <div className="mt-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-white font-semibold">Per-Epoch Training Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                {["Epoch", "Train Loss", "Val Loss", "Val Accuracy", "Val mIoU"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-slate-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {epochs.map((e, i) => (
                <tr key={e} className="border-b border-slate-800/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-2.5 text-slate-400 font-mono">{e}</td>
                  <td className="px-5 py-2.5 font-mono text-blue-300">{trainLoss[i].toFixed(4)}</td>
                  <td className="px-5 py-2.5 font-mono text-purple-300">{valLoss[i].toFixed(4)}</td>
                  <td className="px-5 py-2.5 font-mono text-green-300">{(valAcc[i] * 100).toFixed(2)}%</td>
                  <td className="px-5 py-2.5 font-mono text-amber-300">{(valMiou[i] * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ChartCard({ title, sub, children }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-500 text-xs mb-4">{sub}</p>
      {children}
    </div>
  );
}
