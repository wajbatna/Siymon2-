import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bike,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Percent,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Users,
  X,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ToastHost } from '@/components/ui/ToastHost';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { cn } from '@/utils/cn';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery', label: 'Delivery Personnel', icon: Bike },
  { to: '/admin/promotions', label: 'Promotions', icon: Percent },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const title = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? 'Admin';

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-5 border-b border-white/8 shrink-0">
        <Link to="/home" aria-label="Back to store">
          <Logo dark />
        </Link>
        <button onClick={() => setOpen(false)} className="ml-auto lg:hidden p-2 text-white/60 hover:text-white" aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Admin navigation">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 h-11 rounded-2xl text-sm font-semibold transition-colors',
                isActive ? 'bg-brand-gradient text-white shadow-glow' : 'text-white/60 hover:text-white hover:bg-white/6',
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/8 space-y-1 shrink-0">
        <Link to="/home" className="flex items-center gap-3 px-3.5 h-11 rounded-2xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/6 transition-colors">
          <Store className="w-5 h-5 shrink-0" aria-hidden /> Back to Store
        </Link>
        <button
          onClick={() => {
            logout();
            toast.info('Admin session ended.');
            navigate('/admin/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 h-11 rounded-2xl text-sm font-semibold text-white/60 hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F5FB]">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-brand-navy flex-col z-40">{sidebar}</aside>

      {/* mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-brand-navy flex flex-col animate-fade-in">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur border-b border-brand-ink/6 flex items-center gap-4 px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl text-brand-ink hover:bg-brand-ink/5" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-extrabold text-brand-ink">{title}</h1>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-warning/15 text-[#B26A00] text-[10px] font-extrabold uppercase tracking-wide">
            Demo analytics
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/home" className="text-sm font-bold text-brand-muted hover:text-brand-purple transition-colors hidden sm:block">
              View store
            </Link>
            <span className="w-9 h-9 rounded-xl bg-brand-gradient text-white flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
