import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Search, ShoppingCart, User } from 'lucide-react';
import { cartCount, useCartStore } from '@/store/useCartStore';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/utils/cn';

export function MobileTabBar() {
  const { pathname } = useLocation();
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const count = cartCount(useCartStore((s) => s.items));

  const tabs = [
    { to: '/home', label: 'Home', icon: Home, active: pathname === '/home' || pathname === '/' },
    { to: '/search', label: 'Search', icon: Search, active: pathname.startsWith('/search') || pathname.startsWith('/category') },
    { to: '__cart', label: 'Cart', icon: ShoppingCart, active: false },
    { to: '/orders', label: 'Orders', icon: Package, active: pathname.startsWith('/orders') },
    { to: '/account', label: 'Account', icon: User, active: pathname.startsWith('/login') || pathname.startsWith('/register') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-brand-ink/8 pb-[env(safe-area-inset-bottom)]" aria-label="Primary">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) =>
          tab.to === '__cart' ? (
            <button
              key={tab.to}
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${count} items`}
              className="relative flex flex-col items-center justify-center gap-1 text-brand-muted"
            >
              <span className="relative">
                <tab.icon className="w-5 h-5" aria-hidden />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-brand-purple text-white text-[10px] font-extrabold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ) : (
            <Link
              key={tab.to}
              to={tab.to}
              aria-current={tab.active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                tab.active ? 'text-brand-purple' : 'text-brand-muted',
              )}
            >
              <tab.icon className="w-5 h-5" aria-hidden />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
