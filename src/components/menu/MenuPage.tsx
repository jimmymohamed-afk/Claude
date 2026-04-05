import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import type { MenuItem } from '../../types';
import { HeroHeader } from './HeroHeader';
import { CategoryNav } from './CategoryNav';
import { CategorySection } from './CategorySection';
import { ItemDetailModal } from './ItemDetailModal';

export function MenuPage() {
  const { state } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const visibleCategories = state.categories
    .filter(c => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getCategoryItems = (categoryId: string) =>
    state.items
      .filter(i => i.categoryId === categoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen bg-bg">
      <HeroHeader />
      <CategoryNav categories={visibleCategories} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {visibleCategories.length === 0 ? (
          <div className="text-center py-20 text-text-main/40">
            <p className="text-xl">No menu items yet.</p>
            <Link to="/admin" className="mt-4 inline-block text-primary hover:underline text-sm">
              Go to admin panel to add items
            </Link>
          </div>
        ) : (
          visibleCategories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              items={getCategoryItems(category.id)}
              theme={state.theme}
              onSelectItem={setSelectedItem}
            />
          ))
        )}
      </main>

      <footer className="mt-16 border-t border-black/10 py-8 text-center text-sm text-text-main/40">
        <p className="font-medium">{state.restaurantInfo.name}</p>
        {state.restaurantInfo.address && <p className="mt-1">{state.restaurantInfo.address}</p>}
        {state.restaurantInfo.phone && <p className="mt-1">{state.restaurantInfo.phone}</p>}
        {state.restaurantInfo.openingHours && <p className="mt-1">{state.restaurantInfo.openingHours}</p>}
      </footer>

      <Link
        to="/admin"
        className="fixed bottom-6 right-6 p-3 bg-surface shadow-lg rounded-full hover:bg-bg border border-black/10 text-text-main/50 hover:text-primary transition-colors"
        title="Admin panel"
        aria-label="Go to admin panel"
      >
        <Settings size={20} />
      </Link>

      <ItemDetailModal
        item={selectedItem}
        theme={state.theme}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
