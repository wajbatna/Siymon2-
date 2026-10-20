import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { assetUrl } from '@/utils/assets';
import { cn } from '@/utils/cn';
import { writeJson } from '@/utils/storage';

const ONBOARD_KEY = 'siymon.onboarded';

const SLIDES = [
  {
    image: 'images/hero-onboarding.jpg',
    title: 'Delicious Food, Delivered to Your Door.',
    text: 'From smash burgers to sushi platters and slow-cooked tagine — order from the best kitchens in Casablanca in a few taps.',
  },
  {
    image: 'images/hero-banner.jpg',
    title: 'Authentic Moroccan Cuisine',
    text: 'Tagine, royal couscous, harira and mint tea, prepared the traditional way by local restaurants we trust.',
  },
  {
    image: 'images/sushi-platter.jpg',
    title: 'Fresh, Fast & Tracked',
    text: 'Live order status from confirmation to delivery, honest prep times and friendly drivers at your door.',
  },
];

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  useEffect(() => {
    document.title = 'Welcome — SIYMON';
  }, []);

  const finish = () => {
    writeJson(ONBOARD_KEY, true);
    navigate('/home');
  };

  const skip = () => finish();

  return (
    <div className="min-h-screen bg-brand-navy text-white flex flex-col relative overflow-hidden">
      {/* background image */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <img
            key={s.image}
            src={assetUrl(s.image)}
            alt=""
            aria-hidden={i !== index}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-brand-navy/25" />
        <div className="absolute inset-0 bg-brand-purple/10 mix-blend-multiply" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 h-20">
        <Logo dark />
        <button onClick={skip} className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
          Skip
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col justify-end px-6 sm:px-10 pb-10 max-w-3xl w-full mx-auto">
        <div key={index} className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow text-brand-ink text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" aria-hidden /> Food delivery, done right
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {slide.title}
          </h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">{slide.text}</p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2" role="tablist" aria-label="Onboarding slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-brand-yellow' : 'w-2 bg-white/30 hover:bg-white/50',
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
              className="w-11 h-11 rounded-2xl border-2 border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            {isLast ? (
              <Button size="lg" variant="secondary" onClick={finish}>
                Get Started <ArrowRight className="w-4 h-4" aria-hidden />
              </Button>
            ) : (
              <Button size="lg" onClick={() => setIndex((i) => i + 1)}>
                Continue <ChevronRight className="w-4 h-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
