import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Task1Section from "./components/Task1Section";
import DatasetSection from "./components/DatasetSection";
import ArchitectureSection from "./components/ArchitectureSection";
import FineTuneSection from "./components/FineTuneSection";
import ResultsSection from "./components/ResultsSection";
import PredictionsGallery from "./components/PredictionsGallery";

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
      <DatasetSection />
      <ArchitectureSection />
      <FineTuneSection />
      <ResultsSection />
      <PredictionsGallery />
      <Footer />
    </div>
  );
}
