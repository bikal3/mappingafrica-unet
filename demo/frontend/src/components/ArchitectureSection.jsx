import { SectionHeader } from "./Task1Section";

const encoderLayers = [
  { name: "enc1", channels: "4→64", size: "256" },
  { name: "enc2", channels: "64→128", size: "128" },
  { name: "enc3", channels: "128→256", size: "64" },
  { name: "enc4", channels: "256→512", size: "32" },
  { name: "enc5", channels: "512→1024", size: "16" },
];

const decoderLayers = [
  { name: "dec5", channels: "2048→1024", size: "16" },
  { name: "dec4", channels: "1024→512", size: "32" },
  { name: "dec3", channels: "512→256", size: "64" },
  { name: "dec2", channels: "256→128", size: "128" },
  { name: "dec1", channels: "128→64", size: "256" },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        badge="Architecture"
        title="UNet Semantic Segmentation"
        sub="Encoder-decoder with skip connections — 4-channel input, 3-class output"
      />

      <div className="mt-12 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 overflow-x-auto">
        <UNetDiagram />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <InfoCard
          title="Encoder"
          color="text-blue-400"
          border="border-blue-500/20"
          bg="bg-blue-500/5"
          items={[
            "5 × DoubleConv blocks",
            "MaxPool2d(2×2) downsampling",
            "4→64→128→256→512→1024 channels",
            "Feature extraction frozen during fine-tuning",
          ]}
        />
        <InfoCard
          title="Bottleneck"
          color="text-purple-400"
          border="border-purple-500/20"
          bg="bg-purple-500/5"
          items={[
            "DoubleConv: 1024→2048",
            "Deepest feature representation",
            "8×8 spatial resolution",
            "Trainable during fine-tuning",
          ]}
        />
        <InfoCard
          title="Decoder"
          color="text-green-400"
          border="border-green-500/20"
          bg="bg-green-500/5"
          items={[
            "5 × ConvTranspose2d upsampling",
            "Skip connections from encoder",
            "2048→1024→512→256→128→64",
            "Trainable during fine-tuning",
          ]}
        />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <h4 className="text-white font-semibold mb-3 text-sm">DoubleConv Block</h4>
          <div className="font-mono text-xs space-y-1 text-slate-400">
            <div>Conv2d(in, out, 3×3, pad=1)</div>
            <div>BatchNorm2d(out)</div>
            <div>ReLU(inplace=True)</div>
            <div>Conv2d(out, out, 3×3, pad=1)</div>
            <div>BatchNorm2d(out)</div>
            <div>ReLU(inplace=True)</div>
          </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <h4 className="text-white font-semibold mb-3 text-sm">Model Summary</h4>
          <div className="text-xs space-y-2 text-slate-400">
            <Row label="Input" value="(B, 4, 256, 256)" />
            <Row label="Output" value="(B, 3, 256, 256)" />
            <Row label="Final Layer" value="Conv2d(64, 3, 1×1)" />
            <Row label="Model Size" value="~498 MB" />
            <Row label="Loss Function" value="CrossEntropyLoss" />
            <Row label="Classes" value="3 (null, field class 1, field class 2)" />
          </div>
        </div>
      </div>
    </section>
  );
}

function UNetDiagram() {
  const boxW = 70, boxH = 30, gap = 8;
  const encX = 20;
  const decX = 680;
  const bottleX = 350;

  const encY = (i) => 40 + i * (boxH + gap);
  const decY = (i) => 40 + (4 - i) * (boxH + gap);

  const svgH = 40 + 5 * (boxH + gap) + 80;

  return (
    <svg
      viewBox={`0 0 800 ${svgH}`}
      className="w-full"
      style={{ maxHeight: 340 }}
    >
      {/* Encoder boxes */}
      {encoderLayers.map((l, i) => (
        <g key={l.name}>
          <rect x={encX} y={encY(i)} width={boxW + 20} height={boxH} rx={4} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1} />
          <text x={encX + (boxW + 20) / 2} y={encY(i) + 12} textAnchor="middle" fill="#93c5fd" fontSize={8} fontFamily="monospace">{l.name}</text>
          <text x={encX + (boxW + 20) / 2} y={encY(i) + 23} textAnchor="middle" fill="#64748b" fontSize={7} fontFamily="monospace">{l.channels}</text>
          {/* Arrow down */}
          {i < 4 && <line x1={encX + (boxW + 20) / 2} y1={encY(i) + boxH} x2={encX + (boxW + 20) / 2} y2={encY(i + 1)} stroke="#3b82f6" strokeWidth={1} strokeDasharray="2,2" />}
        </g>
      ))}

      {/* Bottleneck */}
      <rect x={bottleX - 10} y={encY(4) + boxH + 20} width={100} height={boxH + 10} rx={4} fill="#3b1d6e" stroke="#8b5cf6" strokeWidth={1.5} />
      <text x={bottleX + 40} y={encY(4) + boxH + 33} textAnchor="middle" fill="#c4b5fd" fontSize={9} fontFamily="monospace">bottleneck</text>
      <text x={bottleX + 40} y={encY(4) + boxH + 46} textAnchor="middle" fill="#6b7280" fontSize={7} fontFamily="monospace">1024→2048</text>

      {/* Decoder boxes */}
      {decoderLayers.map((l, i) => (
        <g key={l.name}>
          <rect x={decX} y={decY(i)} width={boxW + 20} height={boxH} rx={4} fill="#1a3a2e" stroke="#10b981" strokeWidth={1} />
          <text x={decX + (boxW + 20) / 2} y={decY(i) + 12} textAnchor="middle" fill="#6ee7b7" fontSize={8} fontFamily="monospace">{l.name}</text>
          <text x={decX + (boxW + 20) / 2} y={decY(i) + 23} textAnchor="middle" fill="#64748b" fontSize={7} fontFamily="monospace">{l.channels}</text>
          {/* Arrow up */}
          {i < 4 && <line x1={decX + (boxW + 20) / 2} y1={decY(i) + boxH} x2={decX + (boxW + 20) / 2} y2={decY(i + 1)} stroke="#10b981" strokeWidth={1} strokeDasharray="2,2" />}
        </g>
      ))}

      {/* Skip connections */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i}
          x1={encX + boxW + 20} y1={encY(i) + boxH / 2}
          x2={decX} y2={decY(4 - i) + boxH / 2}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,3" opacity={0.6}
        />
      ))}

      {/* Input label */}
      <text x={encX + (boxW + 20) / 2} y={30} textAnchor="middle" fill="#94a3b8" fontSize={9}>Input (4ch)</text>
      <line x1={encX + (boxW + 20) / 2} y1={32} x2={encX + (boxW + 20) / 2} y2={encY(0)} stroke="#94a3b8" strokeWidth={1} />

      {/* Output label */}
      <text x={decX + (boxW + 20) / 2} y={30} textAnchor="middle" fill="#94a3b8" fontSize={9}>Output (3ch)</text>
      <line x1={decX + (boxW + 20) / 2} y1={32} x2={decX + (boxW + 20) / 2} y2={decY(0)} stroke="#94a3b8" strokeWidth={1} />

      {/* Skip legend */}
      <line x1={300} y1={svgH - 15} x2={320} y2={svgH - 15} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,3" />
      <text x={325} y={svgH - 11} fill="#94a3b8" fontSize={9}>Skip connection</text>
    </svg>
  );
}

function InfoCard({ title, color, border, bg, items }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-5`}>
      <h3 className={`font-semibold mb-3 ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
            <span className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${color.replace("text-", "bg-")}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300 font-mono">{value}</span>
    </div>
  );
}
