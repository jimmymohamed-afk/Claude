import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { MenuItem, DietaryFlag } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { generateId } from '../../utils/slugify';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import { ImageUpload } from '../ui/ImageUpload';

const ALL_FLAGS: DietaryFlag[] = [
  'vegan', 'vegetarian', 'gluten-free', 'spicy', 'contains-nuts', 'halal', 'new', 'popular'
];

function ItemForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: MenuItem;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const { state } = useMenu();
  const [name, setName] = useState(initial?.name ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? state.categories[0]?.id ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageBase64, setImageBase64] = useState(initial?.imageBase64);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [flags, setFlags] = useState<DietaryFlag[]>(initial?.dietaryFlags ?? []);
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleFlag = (flag: DietaryFlag) => {
    setFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]);
  };

  const handleImageChange = (val: string | undefined) => {
    if (!val) { setImageBase64(undefined); setImageUrl(''); return; }
    if (val.startsWith('data:')) { setImageBase64(val); setImageUrl(''); }
    else { setImageUrl(val); setImageBase64(undefined); }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!categoryId) newErrors.categoryId = 'Category is required';
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) newErrors.price = 'Enter a valid price';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    onSave({
      id: initial?.id ?? generateId(),
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      imageBase64,
      imageUrl: imageUrl || undefined,
      dietaryFlags: flags,
      available,
      featured,
      sortOrder: initial?.sortOrder ?? 999,
    });
    onClose();
  };

  const categoryOptions = state.categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="space-y-5">
      <Input
        label="Item Name"
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
        error={errors.name}
        autoFocus
        placeholder="e.g. Grilled Salmon"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          value={categoryId}
          onChange={e => { setCategoryId(e.target.value); setErrors(p => ({ ...p, categoryId: '' })); }}
          options={categoryOptions}
          error={errors.categoryId}
        />
        <Input
          label={`Price (${state.theme.currencySymbol})`}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }}
          error={errors.price}
          placeholder="0.00"
        />
      </div>
      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        placeholder="Describe the dish, ingredients, preparation..."
      />
      <ImageUpload
        value={imageBase64 || imageUrl || undefined}
        onChange={handleImageChange}
        label="Item Image"
      />
      <div>
        <span className="block text-sm font-medium text-text-main/80 mb-2">Dietary & Labels</span>
        <div className="flex flex-wrap gap-2">
          {ALL_FLAGS.map(flag => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`transition-opacity ${flags.includes(flag) ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <Badge flag={flag} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-6">
        <Toggle checked={available} onChange={setAvailable} label="Available" id="item-available" />
        <Toggle checked={featured} onChange={setFeatured} label="Featured" id="item-featured" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial ? 'Save Changes' : 'Add Item'}</Button>
      </div>
    </div>
  );
}

export function ItemManager() {
  const { state, dispatch } = useMenu();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const categoryMap = Object.fromEntries(state.categories.map(c => [c.id, c.name]));

  const filtered = state.items
    .filter(item => {
      if (filterCat && item.categoryId !== filterCat) return false;
      if (search) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (a.categoryId !== b.categoryId) return a.categoryId.localeCompare(b.categoryId);
      return a.sortOrder - b.sortOrder;
    });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...state.categories.sort((a, b) => a.sortOrder - b.sortOrder).map(c => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-text-main">Menu Items</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
          <input
            type="search"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-card border border-black/15 bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm rounded-card border border-black/15 bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-main/40 bg-surface rounded-card border border-dashed border-black/15">
          <p className="text-lg">{state.items.length === 0 ? 'No items yet' : 'No items match your filter'}</p>
          {state.items.length === 0 && (
            <button onClick={() => setShowAdd(true)} className="mt-2 text-primary hover:underline text-sm">
              Add your first menu item
            </button>
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-card border border-black/5 divide-y divide-black/5">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              {(item.imageBase64 || item.imageUrl) && (
                <img
                  src={item.imageBase64 || item.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-card object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-main text-sm">{item.name}</span>
                  {!item.available && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Unavailable</span>
                  )}
                  {item.featured && (
                    <span className="text-xs bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                <p className="text-xs text-text-main/50 truncate">{categoryMap[item.categoryId] ?? '—'}</p>
              </div>
              <span className="font-semibold text-primary text-sm flex-shrink-0">
                {state.theme.currencyPosition === 'before'
                  ? `${state.theme.currencySymbol}${item.price.toFixed(2)}`
                  : `${item.price.toFixed(2)}${state.theme.currencySymbol}`}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditTarget(item)}
                  className="p-1.5 rounded-card hover:bg-bg text-text-main/40 hover:text-text-main transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-card hover:bg-bg text-red-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Menu Item" size="lg">
        <ItemForm
          onSave={item => dispatch({ type: 'ADD_ITEM', payload: item })}
          onClose={() => setShowAdd(false)}
        />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Menu Item" size="lg">
        {editTarget && (
          <ItemForm
            initial={editTarget}
            onSave={item => dispatch({ type: 'UPDATE_ITEM', payload: item })}
            onClose={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && dispatch({ type: 'DELETE_ITEM', payload: deleteTarget.id })}
        title="Delete Item"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
