import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Input } from '@/components/ui/Field';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';

export function Footer() {
  const settings = useDataStore((s) => s.settings);
  const categories = useDataStore((s) => s.categories);
  const [email, setEmail] = useState('');

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thanks! You are on the (demo) newsletter list.');
    setEmail('');
  };

  return (
    <footer className="bg-brand-navy text-white/70 mt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 text-sm leading-relaxed max-w-xs">{settings.tagline} Burgers, pizza, sushi and authentic Moroccan cuisine from the best restaurants in Casablanca.</p>
          <div className="mt-5 flex gap-2.5">
            {[
              { href: settings.facebook, icon: Facebook, label: 'Facebook' },
              { href: settings.instagram, icon: Instagram, label: 'Instagram' },
              { href: settings.twitter, icon: Twitter, label: 'Twitter' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-brand-purple transition-colors flex items-center justify-center"
              >
                <s.icon className="w-4 h-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-white font-bold mb-4">Categories</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="hover:text-brand-yellow transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-white font-bold mb-4">Company</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/home" className="hover:text-brand-yellow transition-colors">Home</Link></li>
            <li><Link to="/orders" className="hover:text-brand-yellow transition-colors">My orders</Link></li>
            <li><Link to="/login" className="hover:text-brand-yellow transition-colors">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-brand-yellow transition-colors">Create account</Link></li>
            <li><Link to="/admin" className="hover:text-brand-yellow transition-colors">Admin dashboard</Link></li>
            <li><Link to="/intro" className="hover:text-brand-yellow transition-colors">Replay intro</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-white font-bold mb-4">Get in touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="w-4 h-4 mt-0.5 text-brand-yellow shrink-0" aria-hidden />{settings.address}</li>
            <li className="flex gap-2.5"><Phone className="w-4 h-4 mt-0.5 text-brand-yellow shrink-0" aria-hidden />{settings.phone}</li>
            <li className="flex gap-2.5"><Mail className="w-4 h-4 mt-0.5 text-brand-yellow shrink-0" aria-hidden />{settings.email}</li>
          </ul>
          <form onSubmit={subscribe} className="mt-5 flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email for offers"
              aria-label="Email for newsletter"
              className="bg-white/10 border-white/15 text-white placeholder:text-white/40 h-10 rounded-xl"
            />
            <button className="h-10 px-4 rounded-xl bg-brand-yellow text-brand-ink text-sm font-bold hover:brightness-105 transition-all shrink-0">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} SIYMON. Front-end demonstration — orders and payments are simulated.</p>
        <p className="text-white/45">Built with React, TypeScript & Vite · Deployed on GitHub Pages</p>
      </div>
    </footer>
  );
}
