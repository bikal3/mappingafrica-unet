import { Lock, Unlock } from "lucide-react";
import { SectionHeader } from "./Task1Section";

const layers = [
  { name: "enc1", label: "Encoder 1", channels: "4→64", frozen: true },
  { name: "enc2", label: "Encoder 2", channels: "64→128", frozen: true },
  { name: "enc3", label: "Encoder 3", channels: "128→256", frozen: true },
  { name: "enc4", label: "Encoder 4", channels: "256→512", frozen: true },
  { name: "enc5", label: "Encoder 5", channels: "512→1024", frozen: true },
  { name: "bottleneck", label: "Bottleneck", channels: "1024→2048", frozen: false },
  { name: "dec5", label: "Decoder 5", channels: "2048→1024", frozen: false },
  { name: "dec4", label: "Decoder 4", channels: "1024→512", frozen: false },
  { name: "dec3", label: "Decoder 3", channels: "512→256", frozen: false },
  { name: "dec2", label: "Decoder 2", channels: "256→128", frozen: false },
  { name: "dec1", label: "Decoder 1", channels: "128→64", frozen: false },
  { name: "final", label: "Output Head", channels: "64→3", frozen: false },
];

const whyItems = [
  {
    title: "Why freeze the encoder?",
    desc: "The encoder extracts low-level and mid-level features (edges, textures, shapes). These are transferable across geographic regions — no need to retrain them on limited data.",
  },
  {
    title: "Why fine-tune the decoder?",
    desc: "The decoder adapts the feature maps to the specific segmentation task for the Zambia region. Retraining it allows the model to adjust to local visual patterns while preserving the encoder's knowledge.",
  },
  {
    title: "Why a small learning rate (1e-4)?",
    desc: "We want gradual updates — large learning rates on a pre-trained model would destroy the useful representations learned during original training.",
  },
];

export default function FineTuneSection() {
  const frozen = layers.filter((l) => l.frozen).length;
  const trainable = layers.filter((l) => !l.frozen).length;
  const totalParams = 497;

  return (
    <section id="finetuning" className="py-24 px-6 bg-slate-900/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Transfer Learning"
          title="Fine-tuning Strategy"
          sub="Freeze the encoder, fine-tune the decoder — adapting to a new geographic region"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Layer visualization */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-slate-500" />
                <span className="text-slate-400">{frozen} layers frozen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Unlock size={14} className="text-blue-400" />
                <span className="text-blue-400">{trainable} layers trainable</span>
              </div>
            </div>

            <div className="space-y-2">
              {layers.map((l) => (
                <div
                  key={l.name}
                  className={`flex items-center justify-between rounded-lg px-4 py-2.5 border transition-colors ${
                    l.frozen
                      ? "bg-slate-900/60 border-slate-700/40"
                      : "bg-blue-500/8 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {l.frozen ? (
                      <Lock size={13} className="text-slate-600 flex-shrink-0" />
                    ) : (
                      <Unlock size={13} className="text-blue-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${l.frozen ? "text-slate-500" : "text-slate-200"}`}>
                      {l.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-600">{l.channels}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        l.frozen
                          ? "bg-slate-700/50 text-slate-500"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {l.frozen ? "FROZEN" : "TRAINABLE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Config + rationale */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Training Configuration</h3>
              <div className="space-y-3">
                {[
                  ["Optimizer", "Adam"],
                  ["Learning rate", "1e-4"],
                  ["Loss function", "CrossEntropyLoss"],
                  ["Epochs", "10"],
                  ["Batch size", "32"],
                  ["Train samples", "500"],
                  ["Val samples", "100"],
                  ["Device", "CUDA GPU"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-mono text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Model Checkpoint</h3>
              <div className="font-mono text-xs text-slate-500 bg-slate-900/60 rounded p-3">
                <div className="text-green-400">✓ unet_model.pth <span className="text-slate-600">(pre-trained, 498 MB)</span></div>
                <div className="text-blue-400 mt-1">✓ unet_finetuned.pth <span className="text-slate-600">(saved, 498 MB)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Why cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {whyItems.map((item) => (
            <div key={item.title} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h4 className="text-blue-400 font-semibold text-sm mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
