import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { SectionHeader } from "./Task1Section";

const ALL_SAMPLES = [
  "ZM1622949_2021-08","ZM1634599_2021-08","ZM1634645_2021-08","ZM1656379_2021-08",
  "ZM1702968_2021-08","ZM1706637_2021-08","ZM1712155_2021-08","ZM1716286_2021-08",
  "ZM1717612_2021-08","ZM1719919_2021-08","ZM1829067_2021-08","ZM1841419_2021-08",
  "ZM1858604_2021-08","ZM1888408_2021-08","ZM1911527_2021-08","ZM1921657_2021-08",
  "ZM1933346_2021-08","ZM1935028_2021-08","ZM1975354_2021-08","ZM1986959_2021-08",
  "ZM2011173_2021-08","ZM2033581_2021-08","ZM2079799_2021-08","ZM2096868_2021-08",
  "ZM2117591_2021-08","ZM2131550_2021-08","ZM2137844_2021-08","ZM2139930_2021-08",
  "ZM2145201_2021-08","ZM2160265_2021-08","ZM2169968_2021-08","ZM2187890_2021-08",
  "ZM2211915_2021-08","ZM2213703_2021-08","ZM2219002_2021-08","ZM2220204_2021-08",
  "ZM2236432_2021-08","ZM2264538_2021-08","ZM2267070_2021-08","ZM2275008_2021-08",
  "ZM2288316_2021-08","ZM2293344_2021-08","ZM2295370_2021-08","ZM2295847_2021-08",
  "ZM2304141_2021-08","ZM2304231_2021-08","ZM2305901_2021-08","ZM2310085_2021-08",
  "ZM2310176_2021-08","ZM2311332_2021-08",
];

const PAGE_SIZE = 6;

function imgPath(type, sampleId) {
  return `./images/${type}/${sampleId}.png`;
}

function SampleCard({ sampleId, onClick }) {
  return (
    <div
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
      onClick={() => onClick(sampleId)}
    >
      <div className="grid grid-cols-2">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imgPath("satellite", sampleId)}
            alt="Satellite"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 left-1 text-xs bg-slate-900/80 text-slate-300 px-1.5 py-0.5 rounded">
            Satellite
          </span>
        </div>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imgPath("predictions", sampleId)}
            alt="Prediction"
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
          <span className="absolute top-1 left-1 text-xs bg-slate-900/80 text-blue-400 px-1.5 py-0.5 rounded">
            Prediction
          </span>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">{sampleId}</span>
        <Eye size={13} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
}

function Modal({ sampleId, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold font-mono text-sm">{sampleId}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { type: "satellite", label: "Satellite Input", color: "text-slate-400" },
            { type: "labels",    label: "Ground Truth",   color: "text-green-400" },
            { type: "predictions", label: "UNet Prediction", color: "text-blue-400" },
          ].map(({ type, label, color }) => (
            <div key={type}>
              <img
                src={imgPath(type, sampleId)}
                alt={label}
                className="w-full aspect-square rounded-lg object-cover border border-slate-700"
                style={{ imageRendering: type !== "satellite" ? "pixelated" : "auto" }}
              />
              <p className={`text-xs text-center mt-1 ${color}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {[
            { color: "#3c3c3c", label: "Null / Background" },
            { color: "#22c55e", label: "Non-flooded Field" },
            { color: "#1e90ff", label: "Flooded Field" },
          ].map(({ color, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-full px-3 py-1"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PredictionsGallery() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const totalPages = Math.ceil(ALL_SAMPLES.length / PAGE_SIZE);
  const pageSamples = ALL_SAMPLES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section id="gallery" className="py-24 px-6 bg-slate-900/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Inference Output"
          title="Prediction Gallery"
          sub="50 test predictions — satellite imagery alongside UNet segmentation masks. Click any card to compare with ground truth."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {pageSamples.map((id) => (
            <SampleCard key={id} sampleId={id} onClick={setSelected} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-300" />
          </button>
          <span className="text-slate-400 text-sm">
            Page {page + 1} of {totalPages}&nbsp;·&nbsp;{ALL_SAMPLES.length} total samples
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>

        <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-4 justify-center">
          {[
            { color: "#3c3c3c", label: "Null / Background" },
            { color: "#22c55e", label: "Non-flooded Field" },
            { color: "#1e90ff", label: "Flooded Field" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {selected && <Modal sampleId={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
