import type { Category, MenuItem, ThemeConfig } from '../../types';
import { MenuItemCard } from './MenuItemCard';

interface CategorySectionProps {
  category: Category;
  items: MenuItem[];
  theme: ThemeConfig;
  onSelectItem: (item: MenuItem) => void;
}

export function CategorySection({ category, items, theme, onSelectItem }: CategorySectionProps) {
  const visibleItems = theme.hideUnavailableItems ? items.filter(i => i.available) : items;
  if (visibleItems.length === 0) return null;

  const isCompact = theme.cardStyle === 'compact';
  const isList = theme.layout === 'list' || theme.cardStyle === 'image-left' || theme.cardStyle === 'compact';

  return (
    <section id={`category-${category.id}`} className="scroll-mt-20">
      <div className="mb-4">
        <h2 className="text-2xl font-heading font-bold text-text-main">{category.name}</h2>
        {category.description && (
          <p className="text-text-main/55 text-sm mt-1">{category.description}</p>
        )}
      </div>
      {isCompact ? (
        <div className="bg-surface rounded-card overflow-hidden divide-y divide-black/5">
          {visibleItems.map(item => (
            <MenuItemCard key={item.id} item={item} theme={theme} onSelect={onSelectItem} />
          ))}
        </div>
      ) : isList ? (
        <div className="flex flex-col gap-3">
          {visibleItems.map(item => (
            <MenuItemCard key={item.id} item={item} theme={theme} onSelect={onSelectItem} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map(item => (
            <MenuItemCard key={item.id} item={item} theme={theme} onSelect={onSelectItem} />
          ))}
        </div>
      )}
    </section>
  );
}
