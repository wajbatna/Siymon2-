import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Footer } from '@/components/store/Footer';
import { MobileTabBar } from '@/components/store/MobileTabBar';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ToastHost } from '@/components/ui/ToastHost';

export function StoreLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-brand-cream/40 flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
      <ToastHost />
    </div>
  );
}
