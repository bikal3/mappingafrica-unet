import { MapPin, Database, BrainCircuit, BarChart3 } from "lucide-react";

const stats = [
  { icon: Database, label: "Training Images", value: "4,005", sub: "256×256 px tiles" },
  { icon: MapPin, label: "Fine-tune Region", value: "Zambia", sub: "500 train / 50 test" },
  { icon: BrainCircuit, label: "Test Pixel Acc.", value: "81.8%", sub: "Fine-tuned UNet" },
  { icon: BarChart3, label: "Test mIoU", value: "43.3%", sub: "3-class segmentation" },
];

export default function HeroSection() {
  return (
    <section
      id="overview"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden"
    >
      {/* background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Deep Learning · UNet Fine-tuning
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight">
          Satellite Flood
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {" "}Field Detection
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          Fine-tuning a UNet semantic segmentation model on the{" "}
          <span className="text-slate-300 font-medium">MappingAfrica</span> dataset to segment
          agricultural fields in Zambia and classify them as flooded or non-flooded using 4-channel satellite imagery.
        </p>

        <p className="text-slate-500 text-sm max-w-xl mx-auto mb-12">
          Transfer learning · Encoder frozen · Decoder fine-tuned · CrossEntropyLoss · Adam lr=1e-4
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 backdrop-blur"
            >
              <Icon className="text-blue-400 mx-auto mb-2" size={22} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <a
          href="#task1"
          className="inline-flex items-center gap-2 mt-10 text-slate-500 hover:text-white transition-colors text-sm"
        >
          Explore the project
          <span className="animate-bounce">↓</span>
        </a>
      </div>
    </section>
  );
}
