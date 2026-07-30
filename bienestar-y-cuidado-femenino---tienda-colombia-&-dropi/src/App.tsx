import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminPanel } from './components/AdminPanel';
import { VerifiedReviewsSection } from './components/VerifiedReviewsSection';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen bg-rose-50/20 text-rose-950 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* View Switcher */}
        {activeView === 'shop' && (
          <main className="space-y-12">
            <Hero />
            <VerifiedReviewsSection />
          </main>
        )}

        {activeView === 'tracking' && <OrderTrackingView />}
        {activeView === 'admin' && <AdminPanel />}
      </div>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
