import { useEffect, useRef, useState } from 'react';
import type { Category } from '../../types';

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach(cat => {
      const el = document.getElementById(`category-${cat.id}`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(cat.id);
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [categories]);

  const scrollTo = (catId: string) => {
    const el = document.getElementById(`category-${catId}`);
    if (el) {
      const navHeight = navRef.current?.offsetHeight ?? 56;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (categories.length === 0) return null;

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-black/10 shadow-sm"
      aria-label="Menu categories"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                active === cat.id
                  ? 'bg-primary text-white'
                  : 'text-text-main/60 hover:text-text-main hover:bg-bg'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
