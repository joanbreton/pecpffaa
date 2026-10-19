import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { DirectorSection } from './components/DirectorSection';
import { AcademicOffer } from './components/AcademicOffer';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

// Lazy-loaded components for optimal initial payload & lightning-fast initial paint
const CMSDashboard = lazy(() => import('./components/CMSDashboard').then(m => ({ default: m.CMSDashboard })));
const LoginModal = lazy(() => import('./components/LoginModal').then(m => ({ default: m.LoginModal })));
const ItemModals = lazy(() => import('./components/ItemModals').then(m => ({ default: m.ItemModals })));
const DirectorModal = lazy(() => import('./components/DirectorModal').then(m => ({ default: m.DirectorModal })));
const AboutUsModal = lazy(() => import('./components/AboutUsModal').then(m => ({ default: m.AboutUsModal })));

const MainContent: React.FC = () => {
  const { 
    activeView, 
    notification,
    isLoginModalOpen,
    isDirectorModalOpen,
    isAboutModalOpen,
    selectedNewsModal,
    selectedServiceModal
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#B91C1C] selection:text-white">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 transition-all transform duration-300 ease-out">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-sm ${
            notification.type === 'success' ? 'bg-slate-900/95 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30' :
            notification.type === 'error' ? 'bg-red-950/95 text-red-100 border-red-700 shadow-red-950/30' :
            'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/30'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <div className="flex flex-col">
              <span className="text-white">{notification.message}</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">✓ Registrado en la base de datos</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic View rendering: CMS Dashboard (on demand) or Public Landing Portal */}
      {activeView === 'dashboard' ? (
        <Suspense fallback={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
            <div className="w-8 h-8 border-3 border-[#B91C1C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-300">Cargando Panel Administrativo...</p>
          </div>
        }>
          <CMSDashboard />
        </Suspense>
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <DirectorSection />
            <HeroCarousel />
            <AcademicOffer />
            <NewsSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}

      {/* Global Interactive Modals: Rendered on-demand via React.Suspense */}
      {isLoginModalOpen && (
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
      )}
      {(selectedNewsModal || selectedServiceModal) && (
        <Suspense fallback={null}>
          <ItemModals />
        </Suspense>
      )}
      {isDirectorModalOpen && (
        <Suspense fallback={null}>
          <DirectorModal />
        </Suspense>
      )}
      {isAboutModalOpen && (
        <Suspense fallback={null}>
          <AboutUsModal />
        </Suspense>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
