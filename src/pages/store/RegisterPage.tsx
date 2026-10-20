import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { isEmail, isPhone, minLen, type FieldErrors } from '@/utils/validation';

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      name: minLen(form.name, 3, 'Full name'),
      email: isEmail(form.email) ? undefined : 'Enter a valid email address',
      phone: form.phone && !isPhone(form.phone) ? 'Enter a valid phone number' : undefined,
      password: minLen(form.password, 6, 'Password'),
      confirm: form.confirm === form.password ? undefined : 'Passwords do not match',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined, address: form.address || undefined });
      toast.success(`Account created — welcome, ${user.name.split(' ')[0]}!`);
      navigate('/home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-card p-7 sm:p-9">
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Create your account</h1>
      <p className="text-sm text-brand-muted mt-1.5">Join SIYMON — it takes less than a minute.</p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Full name" required error={errors.name} htmlFor="reg-name">
          <Input id="reg-name" value={form.name} invalid={!!errors.name} onChange={(e) => set('name')(e.target.value)} placeholder="Youssef El Amrani" autoComplete="name" />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor="reg-email">
          <Input id="reg-email" type="email" value={form.email} invalid={!!errors.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@example.ma" autoComplete="email" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone" error={errors.phone} htmlFor="reg-phone">
            <Input id="reg-phone" value={form.phone} invalid={!!errors.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+212 6XX XXX XXX" inputMode="tel" />
          </Field>
          <Field label="City / address" htmlFor="reg-address">
            <Input id="reg-address" value={form.address} onChange={(e) => set('address')(e.target.value)} placeholder="Casablanca" />
          </Field>
        </div>
        <Field label="Password" required error={errors.password} htmlFor="reg-password" hint="At least 6 characters">
          <div className="relative">
            <Input id="reg-password" type={show ? 'text' : 'password'} value={form.password} invalid={!!errors.password} onChange={(e) => set('password')(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="pr-11" />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-muted hover:text-brand-ink">
              {show ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password" required error={errors.confirm} htmlFor="reg-confirm">
          <Input id="reg-confirm" type={show ? 'text' : 'password'} value={form.confirm} invalid={!!errors.confirm} onChange={(e) => set('confirm')(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
        </Field>
        <Button type="submit" block size="lg" loading={loading}>Create account</Button>
      </form>

      <p className="mt-5 flex gap-2 text-[11px] text-brand-muted bg-warning/10 rounded-xl px-3 py-2.5">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-warning mt-0.5" aria-hidden />
        Accounts are stored in this browser's localStorage only (plain text, demo grade). Never reuse a real password here.
      </p>

      <p className="mt-6 text-sm text-brand-muted text-center">
        Already have an account? <Link to="/login" className="font-bold text-brand-purple hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
