import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { ToastHost } from '@/components/ui/ToastHost';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { isEmail, type FieldErrors } from '@/utils/validation';

export function AdminLoginPage() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      email: isEmail(email) ? undefined : 'Enter a valid email',
      password: password ? undefined : 'Password is required',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access.');
        return;
      }
      toast.success('Welcome to the admin dashboard.');
      navigate('/admin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-purple/25 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo dark />
        </div>
        <div className="bg-white rounded-[2rem] shadow-lift p-7 sm:p-9">
          <h1 className="font-display text-2xl font-extrabold text-brand-ink">Admin sign in</h1>
          <p className="text-sm text-brand-muted mt-1.5">Manage orders, products, restaurants and promotions.</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-5">
            <Field label="Email" required error={errors.email} htmlFor="adm-email">
              <Input id="adm-email" type="email" value={email} invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@siymon.ma" />
            </Field>
            <Field label="Password" required error={errors.password} htmlFor="adm-password">
              <div className="relative">
                <Input id="adm-password" type={show ? 'text' : 'password'} value={password} invalid={!!errors.password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-11" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-muted hover:text-brand-ink">
                  {show ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
                </button>
              </div>
            </Field>
            <Button type="submit" block size="lg" loading={loading}>Sign in to dashboard</Button>
            <Button
              type="button"
              block
              variant="soft"
              onClick={async () => {
                const user = await useAuthStore.getState().login('admin@siymon.ma', 'admin1234');
                toast.success(`Demo admin session: ${user.name}`);
                navigate('/admin');
              }}
            >
              <ShieldCheck className="w-4 h-4" aria-hidden /> Use demo admin account
            </Button>
          </form>
          <p className="mt-5 text-[11px] text-brand-muted text-center">admin@siymon.ma / admin1234 · demo only, no real security</p>
        </div>
        <p className="mt-6 text-center text-sm text-white/60">
          <Link to="/home" className="hover:text-white font-semibold transition-colors">← Back to the store</Link>
        </p>
      </div>
      <ToastHost />
    </div>
  );
}
