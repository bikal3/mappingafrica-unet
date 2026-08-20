import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Task1Section from "./components/Task1Section";
import ArchitectureSection from "./components/ArchitectureSection";
import FineTuneSection from "./components/FineTuneSection";
import PredictionsGallery from "./components/PredictionsGallery";

// These two are the only components that pull in recharts, which is most of the
// bundle. Splitting them out keeps it off the critical path for a page that is
// mostly static text above the fold.
const DatasetSection = lazy(() => import("./components/DatasetSection"));
const ResultsSection = lazy(() => import("./components/ResultsSection"));

// Keeps the section's anchor target in the document while its chunk loads, so
// navbar links still land in the right place.
function SectionPlaceholder({ id }) {
  return <section id={id} aria-busy="true" className="min-h-[80vh]" />;
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-slate-800 text-center text-slate-600 text-sm space-y-2">
      <p>Satellite Agricultural Field Segmentation · UNet Fine-tuning · MappingAfrica Dataset</p>
      <p>
        By <span className="text-slate-400">Bikal Shrestha</span> ·{" "}
        <a
          href="https://github.com/bikal3/mappingafrica-unet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          GitHub Repository
        </a>
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <HeroSection />
      <Task1Section />
      <Suspense fallback={<SectionPlaceholder id="dataset" />}>
        <DatasetSection />
      </Suspense>
      <ArchitectureSection />
      <FineTuneSection />
      <Suspense fallback={<SectionPlaceholder id="results" />}>
        <ResultsSection />
      </Suspense>
      <PredictionsGallery />
      <Footer />
    </div>
  );
}
