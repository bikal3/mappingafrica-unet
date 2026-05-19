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
    <footer className="py-8 px-6 border-t border-slate-800 text-center text-slate-600 text-sm">
      <p>Satellite Flood Field Segmentation · UNet Fine-tuning · MappingAfrica Dataset</p>
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
