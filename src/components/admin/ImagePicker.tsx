import { useState } from 'react';
import { AVAILABLE_IMAGES } from '@/data/images';
import { SmartImage } from '@/components/ui/SmartImage';
import { Input } from '@/components/ui/Field';
import { cn } from '@/utils/cn';

export function ImagePicker({ value, onChange }: { value: string; onChange: (path: string) => void }) {
  const [filter, setFilter] = useState('');
  const list = AVAILABLE_IMAGES.filter((i) => i.label.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <SmartImage src={value || 'images/burger-classic.jpg'} alt="Selected preview" className="w-16 h-16 rounded-2xl shrink-0 border-2 border-brand-purple/40" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="images/… or pick below" aria-label="Image path" />
      </div>
      <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter library…" aria-label="Filter image library" className="mb-3 h-10" />
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto pr-1">
        {list.map((img) => (
          <button
            key={img.path}
            type="button"
            title={img.label}
            aria-label={`Use image: ${img.label}`}
            onClick={() => onChange(img.path)}
            className={cn(
              'rounded-xl overflow-hidden border-2 transition-all',
              value === img.path ? 'border-brand-purple ring-2 ring-brand-purple/30' : 'border-transparent hover:border-brand-purple/40',
            )}
          >
            <SmartImage src={img.path} alt={img.label} className="w-full aspect-square" />
          </button>
        ))}
      </div>
    </div>
  );
}
