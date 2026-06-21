import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Preloader from '@/components/animations/Preloader';

const LandingPage = lazy(() => import('@/routes/Landing/LandingPage'));
const DashboardPage = lazy(() => import('@/routes/Dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/routes/Analytics/AnalyticsPage'));
const ModelArenaPage = lazy(() => import('@/routes/ModelArena/ModelArenaPage'));
const AIInsightsPage = lazy(() => import('@/routes/AIInsights/AIInsightsPage'));
const DeveloperLabPage = lazy(() => import('@/routes/DeveloperLab/DeveloperLabPage'));
const DataExplorerPage = lazy(() => import('@/routes/DataExplorer/DataExplorerPage'));
const PredictionHistoryPage = lazy(() => import('@/routes/PredictionHistory/PredictionHistoryPage'));
const AboutPage = lazy(() => import('@/routes/About/AboutPage'));

function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#00E5FF', borderRightColor: '#7C3AED' }}
        />
        <p className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Loading module...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#050816' }}>
        <Navbar />
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/model-arena" element={<ModelArenaPage />} />
              <Route path="/ai-insights" element={<AIInsightsPage />} />
              <Route path="/developer-lab" element={<DeveloperLabPage />} />
              <Route path="/data-explorer" element={<DataExplorerPage />} />
              <Route path="/history" element={<PredictionHistoryPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
