import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { isEmail, type FieldErrors } from '@/utils/validation';

export function LoginPage() {
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
      email: isEmail(email) ? undefined : 'Enter a valid email address',
      password: password ? undefined : 'Password is required',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demo = async (kind: 'customer' | 'admin') => {
    try {
      const user = kind === 'admin'
        ? await useAuthStore.getState().login('admin@siymon.ma', 'admin1234')
        : await useAuthStore.getState().login('demo@siymon.ma', 'demo1234');
      toast.success(`Demo ${kind} session started.`);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch {
      toast.error('Demo login failed — reset demo data from Admin → Settings.');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-card p-7 sm:p-9">
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Welcome back</h1>
      <p className="text-sm text-brand-muted mt-1.5">Sign in to track orders and sync your demo profile.</p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Email" required error={errors.email} htmlFor="login-email">
          <Input id="login-email" type="email" autoComplete="email" value={email} invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.ma" />
        </Field>
        <Field label="Password" required error={errors.password} htmlFor="login-password">
          <div className="relative">
            <Input id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} invalid={!!errors.password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-11" />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-muted hover:text-brand-ink">
              {show ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </Field>
        <Button type="submit" block size="lg" loading={loading}>Sign in</Button>
      </form>

      <div className="mt-6 rounded-2xl bg-brand-cream border border-brand-yellow/50 p-4">
        <p className="flex items-center gap-2 text-xs font-bold text-brand-ink"><KeyRound className="w-3.5 h-3.5 text-brand-purple" aria-hidden /> Demo accounts</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Button variant="outline" size="sm" onClick={() => demo('customer')}>Customer demo</Button>
          <Button variant="dark" size="sm" onClick={() => demo('admin')}>Admin demo</Button>
        </div>
        <p className="mt-2.5 text-[11px] text-brand-muted">demo@siymon.ma / demo1234 · admin@siymon.ma / admin1234</p>
      </div>

      <p className="mt-5 flex gap-2 text-[11px] text-brand-muted bg-warning/10 rounded-xl px-3 py-2.5">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-warning mt-0.5" aria-hidden />
        Client-side authentication is for demonstration only and provides no real security. Production requires a trusted backend or auth service.
      </p>

      <p className="mt-6 text-sm text-brand-muted text-center">
        New here? <Link to="/register" className="font-bold text-brand-purple hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
