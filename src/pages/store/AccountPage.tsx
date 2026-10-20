import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Mail, MapPin, Package, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { formatDate, formatMoney } from '@/utils/format';

export function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useDataStore((s) => s.orders);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const mine = orders.filter((o) => o.customerId === user.id && o.status !== 'cancelled');
  const spent = mine.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-[2rem] shadow-card p-7 sm:p-9">
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-3xl bg-brand-gradient text-white flex items-center justify-center font-display text-2xl font-extrabold">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-brand-ink">{user.name}</h1>
            <p className="text-sm text-brand-muted">{user.role === 'admin' ? 'Administrator · demo account' : 'Customer · demo account'}</p>
          </div>
        </div>

        <dl className="mt-7 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-brand-cream p-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-brand-muted">Orders</dt>
            <dd className="mt-1 font-display text-2xl font-extrabold text-brand-ink">{mine.length}</dd>
          </div>
          <div className="rounded-2xl bg-brand-cream p-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-brand-muted">Total spent</dt>
            <dd className="mt-1 font-display text-2xl font-extrabold text-brand-ink">{formatMoney(spent)}</dd>
          </div>
          <div className="rounded-2xl bg-brand-cream p-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-brand-muted">Member since</dt>
            <dd className="mt-1 font-display text-lg font-extrabold text-brand-ink">{formatDate(new Date().toISOString())}</dd>
          </div>
        </dl>

        <ul className="mt-7 space-y-3 text-sm text-brand-muted">
          <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-brand-purple" aria-hidden /> {user.email}</li>
          {user.phone && <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-brand-purple" aria-hidden /> {user.phone}</li>}
          {user.address && <li className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-brand-purple" aria-hidden /> {user.address}</li>}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/orders"><Button variant="soft"><Package className="w-4 h-4" aria-hidden /> My orders</Button></Link>
          {user.role === 'admin' && (
            <Link to="/admin"><Button variant="dark"><LayoutDashboard className="w-4 h-4" aria-hidden /> Admin dashboard</Button></Link>
          )}
          <Button
            variant="danger"
            onClick={() => {
              logout();
              toast.info('Signed out. See you soon!');
              navigate('/home');
            }}
          >
            <LogOut className="w-4 h-4" aria-hidden /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
