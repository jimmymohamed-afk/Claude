import type { DietaryFlag } from '../../types';

const FLAG_CONFIG: Record<DietaryFlag, { label: string; color: string }> = {
  vegan: { label: 'Vegan', color: 'bg-green-100 text-green-800' },
  vegetarian: { label: 'Vegetarian', color: 'bg-lime-100 text-lime-800' },
  'gluten-free': { label: 'GF', color: 'bg-yellow-100 text-yellow-800' },
  spicy: { label: 'Spicy', color: 'bg-red-100 text-red-800' },
  'contains-nuts': { label: 'Nuts', color: 'bg-orange-100 text-orange-800' },
  halal: { label: 'Halal', color: 'bg-teal-100 text-teal-800' },
  new: { label: 'New', color: 'bg-primary/15 text-primary' },
  popular: { label: 'Popular', color: 'bg-accent/15 text-accent' },
};

export function Badge({ flag }: { flag: DietaryFlag }) {
  const config = FLAG_CONFIG[flag];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

export function BadgeList({ flags }: { flags: DietaryFlag[] }) {
  if (!flags.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map(f => <Badge key={f} flag={f} />)}
    </div>
  );
}
