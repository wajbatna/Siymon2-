import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, MapPin, Package, ShoppingCart, User } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { SearchBar } from '@/components/store/SearchBar';
import { useAuthStore } from '@/store/useAuthStore';
import { cartCount, useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { useUiStore } from '@/store/useUiStore';
import { toast } from '@/store/useToastStore';
import { cn } from '@/utils/cn';

export function StoreHeader() {
  const items = useCartStore((s) => s.items);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const categories = useDataStore((s) => s.categories);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const count = cartCount(items);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const visibleCategories = categories.filter((c) => c.visible).sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-brand-ink/6">
      {/* top strip */}
      <div className="hidden md:block bg-brand-navy text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-9 flex items-center justify-between">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-yellow" aria-hidden />
            Deliver to: <span className="text-white font-semibold">Maârif, Casablanca</span>
            <ChevronDown className="w-3 h-3" aria-hidden />
          </p>
          <div className="flex items-center gap-5">
            <span className="text-white/60">Demo storefront — no real orders or payments</span>
            <Link to="/admin" className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors font-semibold">
              <LayoutDashboard className="w-3.5 h-3.5" aria-hidden /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 md:h-[4.5rem] flex items-center gap-3 md:gap-6">
        <Link to="/home" aria-label="SIYMON home" className="shrink-0">
          <Logo />
        </Link>
        <SearchBar className="hidden md:block flex-1 max-w-xl" />
        <div className="flex-1 md:hidden" />
        <nav className="flex items-center gap-1 md:gap-2" aria-label="Account and cart">
          <Link
            to="/orders"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-3.5 rounded-2xl text-sm font-semibold text-brand-ink hover:bg-brand-ink/5 transition-colors"
          >
            <Package className="w-5 h-5" aria-hidden /> My orders
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 h-10 px-3 rounded-2xl text-sm font-semibold text-brand-ink hover:bg-brand-ink/5 transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-brand-gradient text-white flex items-center justify-center font-bold text-sm">
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" aria-hidden />}
              </span>
              <span className="hidden lg:block max-w-28 truncate">{user ? user.name.split(' ')[0] : 'Sign in'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden lg:block" aria-hidden />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lift border border-brand-ink/8 p-2 animate-scale-in">
                {user ? (
                  <>
                    <p className="px-3 py-2 text-xs text-brand-muted">
                      Signed in as <span className="font-bold text-brand-ink">{user.name}</span>
                      {user.role === 'admin' && <span className="ml-1 text-brand-purple font-bold">(admin)</span>}
                    </p>
                    <MenuItem to="/orders" icon={Package} label="My orders" onClick={() => setMenuOpen(false)} />
                    {user.role === 'admin' && (
                      <MenuItem to="/admin" icon={LayoutDashboard} label="Admin dashboard" onClick={() => setMenuOpen(false)} />
                    )}
                    <button
                      role="menuitem"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        toast.info('You have been signed out.');
                        navigate('/home');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-danger hover:bg-danger/8 transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MenuItem to="/login" icon={User} label="Sign in" onClick={() => setMenuOpen(false)} />
                    <MenuItem to="/register" icon={User} label="Create account" onClick={() => setMenuOpen(false)} />
                    <MenuItem to="/orders" icon={Package} label="Track an order" onClick={() => setMenuOpen(false)} />
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-gradient text-white shadow-glow hover:brightness-110 transition-all"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-brand-yellow text-brand-ink text-[11px] font-extrabold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* category nav (desktop) */}
      <div className="hidden md:block border-t border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-11 flex items-center gap-1 overflow-x-auto">
          {visibleCategories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className={cn(
                'px-3.5 h-8 inline-flex items-center rounded-full text-[13px] font-semibold text-brand-muted hover:text-brand-purple hover:bg-brand-purple/8 transition-colors whitespace-nowrap',
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ to, icon: Icon, label, onClick }: { to: string; icon: typeof User; label: string; onClick: () => void }) {
  return (
    <Link
      role="menuitem"
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-brand-cream/80 transition-colors"
    >
      <Icon className="w-4 h-4 text-brand-muted" aria-hidden /> {label}
    </Link>
  );
}
