import { useState } from 'react';
import { assetUrl } from '@/utils/assets';
import { cn } from '@/utils/cn';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/** Image with lazy loading, fade-in and a branded placeholder fallback. */
export function SmartImage({ src, alt, className, imgClassName, eager = false }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-brand-ink/8', className)}>
      {!failed ? (
        <img
          src={assetUrl(src)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500',
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
            imgClassName,
          )}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-brand-gradient">
          <span className="text-white/80 font-display font-bold text-lg">SIYMON</span>
        </div>
      )}
    </div>
  );
}
