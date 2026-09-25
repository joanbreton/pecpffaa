import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { QuickAccess } from './components/QuickAccess';
import { AcademicOffer } from './components/AcademicOffer';
import { InstitutionalInfo } from './components/InstitutionalInfo';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CMSDashboard } from './components/CMSDashboard';
import { LoginModal } from './components/LoginModal';
import { ItemModals } from './components/ItemModals';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, notification } = useApp();

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

      {/* Dynamic View rendering: CMS Dashboard or Public Landing Portal */}
      {activeView === 'dashboard' ? (
        <CMSDashboard />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <HeroCarousel />
            <QuickAccess />
            <AcademicOffer />
            <InstitutionalInfo />
            <NewsSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}

      {/* Global Interactive Modals */}
      <LoginModal />
      <ItemModals />
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
