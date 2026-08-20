import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, ImageOff } from "lucide-react";
import { SectionHeader } from "./Task1Section";
import { SAMPLE_IDS, CLASS_LEGEND } from "../data/project";

const PAGE_SIZE = 6;

// BASE_URL is "/" locally and "/<repo>/" on GitHub Pages, always with a
// trailing slash. A document-relative "./images/..." would instead depend on
// the visitor's URL carrying one.
function imgPath(type, sampleId) {
  return `${import.meta.env.BASE_URL}images/${type}/${sampleId}.png`;
}

// Renders a placeholder instead of a broken-image icon when a tile is missing.
function Tile({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} — image unavailable`}
        title="Image unavailable"
        className={`${className} flex items-center justify-center bg-slate-900`}
      >
        <ImageOff size={18} className="text-slate-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}

function SampleCard({ sampleId, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => onClick(sampleId, e.currentTarget)}
      aria-label={`Compare sample ${sampleId} with ground truth`}
      className="block w-full text-left bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all group"
    >
      <div className="grid grid-cols-2">
        <div className="relative aspect-square overflow-hidden">
          <Tile
            src={imgPath("satellite", sampleId)}
            alt={`Satellite tile ${sampleId}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 left-1 text-xs bg-slate-900/80 text-slate-300 px-1.5 py-0.5 rounded">
            Satellite
          </span>
        </div>
        <div className="relative aspect-square overflow-hidden">
          <Tile
            src={imgPath("predictions", sampleId)}
            alt={`UNet prediction for ${sampleId}`}
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
    </button>
  );
}

function Modal({ sampleId, onClose }) {
  const ref = useRef(null);
  const titleId = `sample-${sampleId}-title`;

  useEffect(() => {
    // showModal gives us a focus trap, Escape-to-close and inert background
    // content that a plain div cannot.
    ref.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="text-white font-semibold font-mono text-sm">{sampleId}</h3>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close comparison"
            className="text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded transition-colors text-xl leading-none px-1"
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
              <Tile
                src={imgPath(type, sampleId)}
                alt={`${label} for ${sampleId}`}
                className="w-full aspect-square rounded-lg object-cover border border-slate-700"
                style={{ imageRendering: type !== "satellite" ? "pixelated" : "auto" }}
              />
              <p className={`text-xs text-center mt-1 ${color}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {CLASS_LEGEND.map(({ color, name }) => (
            <span
              key={name}
              className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-full px-3 py-1"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export default function PredictionsGallery() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);

  const openSample = (id, el) => {
    triggerRef.current = el;
    setSelected(id);
  };
  const closeSample = () => {
    setSelected(null);
    triggerRef.current?.focus();
  };

  const totalPages = Math.ceil(SAMPLE_IDS.length / PAGE_SIZE);
  const pageSamples = SAMPLE_IDS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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
            <SampleCard key={id} sampleId={id} onClick={openSample} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-300" />
          </button>
          <span className="text-slate-400 text-sm">
            Page {page + 1} of {totalPages}&nbsp;·&nbsp;{SAMPLE_IDS.length} total samples
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next page"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          >
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>

        <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-4 justify-center">
          {CLASS_LEGEND.map(({ color, name }) => (
            <div key={name} className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: color }} />
              {name}
            </div>
          ))}
        </div>
      </div>

      {selected && <Modal sampleId={selected} onClose={closeSample} />}
    </section>
  );
}
