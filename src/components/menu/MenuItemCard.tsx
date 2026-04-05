import { useState } from 'react';
import type { MenuItem, ThemeConfig } from '../../types';
import { BadgeList } from '../ui/Badge';
import { Star } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  theme: ThemeConfig;
  onSelect: (item: MenuItem) => void;
}

function formatPrice(price: number, symbol: string, position: 'before' | 'after') {
  const formatted = price.toFixed(2);
  return position === 'before' ? `${symbol}${formatted}` : `${formatted}${symbol}`;
}

export function MenuItemCard({ item, theme, onSelect }: MenuItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = item.imageBase64 || item.imageUrl;
  const hasImage = !!imgSrc && !imgError;
  const price = formatPrice(item.price, theme.currencySymbol, theme.currencyPosition);
  const unavailable = !item.available;

  if (theme.cardStyle === 'image-left') {
    return (
      <article
        onClick={() => onSelect(item)}
        className={`flex gap-3 bg-surface rounded-card p-3 cursor-pointer hover:shadow-md transition-shadow ${unavailable ? 'opacity-60' : ''} ${item.featured ? 'ring-2 ring-accent' : ''}`}
      >
        {hasImage && (
          <div className="flex-shrink-0 w-24 h-24 rounded-card overflow-hidden">
            <img src={imgSrc!} alt={item.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {item.featured && (
              <div className="flex items-center gap-1 text-accent text-xs font-medium mb-1">
                <Star size={12} fill="currentColor" /> Featured
              </div>
            )}
            <h3 className="font-semibold text-text-main text-sm leading-snug">{item.name}</h3>
            <p className="text-text-main/55 text-xs mt-0.5 line-clamp-2">{item.description}</p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <BadgeList flags={item.dietaryFlags} />
            <span className="font-bold text-primary text-sm flex-shrink-0 ml-2">{price}</span>
          </div>
        </div>
      </article>
    );
  }

  if (theme.cardStyle === 'compact') {
    return (
      <article
        onClick={() => onSelect(item)}
        className={`flex items-center justify-between bg-surface px-4 py-3 cursor-pointer hover:bg-bg/50 transition-colors ${unavailable ? 'opacity-60' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {item.featured && <Star size={12} className="text-accent flex-shrink-0" fill="currentColor" />}
            <span className="font-medium text-text-main text-sm">{item.name}</span>
          </div>
          <BadgeList flags={item.dietaryFlags} />
        </div>
        <span className="font-bold text-primary text-sm ml-4 flex-shrink-0">{price}</span>
      </article>
    );
  }

  if (theme.cardStyle === 'minimal') {
    return (
      <article
        onClick={() => onSelect(item)}
        className={`bg-surface rounded-card p-4 cursor-pointer hover:shadow-md transition-shadow ${unavailable ? 'opacity-60' : ''} ${item.featured ? 'ring-2 ring-accent' : ''}`}
      >
        {item.featured && (
          <div className="flex items-center gap-1 text-accent text-xs font-medium mb-2">
            <Star size={12} fill="currentColor" /> Featured
          </div>
        )}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-text-main">{item.name}</h3>
            <p className="text-text-main/55 text-sm mt-1 line-clamp-2">{item.description}</p>
            <div className="mt-2"><BadgeList flags={item.dietaryFlags} /></div>
          </div>
          <span className="font-bold text-primary text-base flex-shrink-0">{price}</span>
        </div>
      </article>
    );
  }

  // image-top (default)
  return (
    <article
      onClick={() => onSelect(item)}
      className={`bg-surface rounded-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${unavailable ? 'opacity-60' : ''} ${item.featured ? 'ring-2 ring-accent' : ''}`}
    >
      {hasImage ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={imgSrc!}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {item.featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">
              <Star size={10} fill="currentColor" /> Popular
            </div>
          )}
          {unavailable && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">Unavailable</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-44 bg-bg flex items-center justify-center text-text-main/20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14zm-9-7 3 4h-6l3-4z" />
          </svg>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-text-main leading-snug">{item.name}</h3>
        <p className="text-text-main/55 text-sm mt-1 line-clamp-2">{item.description}</p>
        <div className="mt-2 flex items-end justify-between">
          <BadgeList flags={item.dietaryFlags} />
          <span className="font-bold text-primary text-base ml-2 flex-shrink-0">{price}</span>
        </div>
      </div>
    </article>
  );
}
