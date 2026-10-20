import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="inline-flex w-20 h-20 rounded-[1.75rem] bg-brand-purple/10 items-center justify-center">
        <Compass className="w-10 h-10 text-brand-purple" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-4xl font-extrabold text-brand-ink">404 — lost in the kitchen</h1>
      <p className="mt-3 text-brand-muted">The page you are looking for was eaten, moved, or never existed. Let's get you back to the menu.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/home"><Button>Back to home</Button></Link>
        <Link to="/search"><Button variant="outline">Browse menu</Button></Link>
      </div>
    </div>
  );
}
