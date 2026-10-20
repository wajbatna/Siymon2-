import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { ToastHost } from '@/components/ui/ToastHost';
import { assetUrl } from '@/utils/assets';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-brand-cream/50">
      <div className="hidden lg:block relative overflow-hidden">
        <img src={assetUrl('images/hero-onboarding.jpg')} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-navy/55" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Logo dark />
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight max-w-md">
              Delicious food, delivered to your door.
            </h2>
            <p className="mt-4 text-white/75 max-w-sm leading-relaxed">
              Sign in to track orders, reorder favorites and manage your addresses. Demo mode — your data never leaves this browser.
            </p>
          </div>
          <p className="text-xs text-white/50">Front-end demonstration · No real accounts or payments</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
      <ToastHost />
    </div>
  );
}
