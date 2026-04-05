import type { MenuItem, ThemeConfig } from '../../types';
import { Modal } from '../ui/Modal';
import { BadgeList } from '../ui/Badge';
import { Star } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  theme: ThemeConfig;
  onClose: () => void;
}

function formatPrice(price: number, symbol: string, position: 'before' | 'after') {
  const formatted = price.toFixed(2);
  return position === 'before' ? `${symbol}${formatted}` : `${formatted}${symbol}`;
}

export function ItemDetailModal({ item, theme, onClose }: ItemDetailModalProps) {
  const imgSrc = item?.imageBase64 || item?.imageUrl;
  const price = item ? formatPrice(item.price, theme.currencySymbol, theme.currencyPosition) : '';

  return (
    <Modal open={!!item} onClose={onClose} size="md">
      {item && (
        <>
          {imgSrc && (
            <div className="-mx-6 -mt-6 mb-4 h-56 overflow-hidden rounded-t-card">
              <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            {item.featured && (
              <div className="flex items-center gap-1 text-accent text-sm font-medium mb-2">
                <Star size={14} fill="currentColor" /> Popular choice
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-heading font-bold text-text-main">{item.name}</h2>
              <span className="text-2xl font-bold text-primary flex-shrink-0">{price}</span>
            </div>
            {item.description && (
              <p className="mt-3 text-text-main/70 leading-relaxed">{item.description}</p>
            )}
            {item.dietaryFlags.length > 0 && (
              <div className="mt-4">
                <BadgeList flags={item.dietaryFlags} />
              </div>
            )}
            {!item.available && (
              <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-card">
                Currently unavailable
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
