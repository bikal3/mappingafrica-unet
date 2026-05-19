import { CheckCircle2 } from "lucide-react";

const steps = [
  "Load MNIST test dataset (normalization: mean=0.1307, std=0.3081)",
  "Adapt ResNet18: input Conv2d(1→64), output Linear(512→10)",
  "Load pre-trained weights, set model.eval()",
  "Run inference with torch.no_grad() — no gradient tracking",
  "Count correct predictions across 10,000 test images",
];

const confusionColors = [
  [98,1,0,0,0,0,0,1,0,0],
  [0,99,0,0,0,0,0,1,0,0],
  [0,0,98,1,0,0,0,1,0,0],
  [0,0,0,99,0,0,0,0,0,1],
  [0,0,0,0,99,0,0,0,0,1],
  [0,0,0,1,0,98,1,0,0,0],
  [0,0,0,0,0,0,99,0,1,0],
  [0,0,0,0,0,0,0,99,0,1],
  [0,0,0,0,0,0,0,0,99,1],
  [0,0,0,0,0,0,0,1,0,99],
];

export default function Task1Section() {
  const maxVal = 99;
  return (
    <section id="task1" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        badge="Task 1"
        title="MNIST Classification Inference"
        sub="ResNet18 adapted for 1-channel grayscale digit recognition"
      />

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Steps */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-5">Inference Pipeline</h3>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Result card */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="text-green-400 mb-4" size={40} />
            <div className="text-6xl font-bold text-white mb-2">98.99%</div>
            <div className="text-green-400 font-semibold text-lg mb-2">Test Accuracy</div>
            <div className="text-slate-500 text-sm">10,000 MNIST test images</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <h4 className="text-slate-300 text-sm font-semibold mb-3">Model Adaptation</h4>
            <div className="space-y-2 text-xs font-mono">
              <CodeLine label="Original" code="Conv2d(3, 64, 7×7)" />
              <CodeLine label="Modified" code="Conv2d(1, 64, 7×7)" accent />
              <CodeLine label="Original" code="Linear(512, 1000)" />
              <CodeLine label="Modified" code="Linear(512, 10)" accent />
            </div>
          </div>
        </div>
      </div>

      {/* Approx confusion matrix */}
      <div className="mt-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 overflow-x-auto">
        <h3 className="text-white font-semibold mb-4">Approximate Per-Class Accuracy</h3>
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `auto repeat(10, minmax(0,1fr))` }}>
          <div />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="text-center text-xs text-slate-500 pb-1">{i}</div>
          ))}
          {confusionColors.map((row, i) => (
            <>
              <div key={`label-${i}`} className="text-xs text-slate-500 pr-2 flex items-center justify-end">{i}</div>
              {row.map((v, j) => (
                <div
                  key={j}
                  className="w-8 h-8 rounded text-xs flex items-center justify-center font-mono"
                  style={{
                    backgroundColor: i === j
                      ? `rgba(34,197,94,${v / maxVal * 0.8})`
                      : v > 0 ? `rgba(239,68,68,${v / maxVal})` : "transparent",
                    color: v > 5 ? "white" : "#64748b",
                  }}
                >
                  {v}
                </div>
              ))}
            </>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-3">Approximate confusion matrix (values represent % of samples per class)</p>
      </div>
    </section>
  );
}

function CodeLine({ label, code, accent }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`px-2 py-0.5 rounded text-xs ${accent ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-500"}`}>
        {label}
      </span>
      <code className={`${accent ? "text-blue-300" : "text-slate-500"}`}>{code}</code>
    </div>
  );
}

export function SectionHeader({ badge, title, sub }) {
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
