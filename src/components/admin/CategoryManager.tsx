import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import type { Category } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { generateId } from '../../utils/slugify';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

function SortableRow({
  category,
  itemCount,
  onEdit,
  onDelete,
  onToggle,
}: {
  category: Category;
  itemCount: number;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onToggle: (cat: Category) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-surface rounded-card px-4 py-3 border border-black/5"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-text-main/30 hover:text-text-main/60 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-main">{category.name}</span>
          {!category.visible && (
            <span className="text-xs bg-black/10 text-text-main/50 px-2 py-0.5 rounded-full">Hidden</span>
          )}
        </div>
        {category.description && (
          <p className="text-xs text-text-main/50 mt-0.5 truncate">{category.description}</p>
        )}
        <p className="text-xs text-text-main/40 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(category)}
          className="p-1.5 rounded-card hover:bg-bg text-text-main/40 hover:text-text-main transition-colors"
          title={category.visible ? 'Hide category' : 'Show category'}
        >
          {category.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 rounded-card hover:bg-bg text-text-main/40 hover:text-text-main transition-colors"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-1.5 rounded-card hover:bg-bg text-red-400 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function CategoryForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Category;
  onSave: (cat: Category) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [visible, setVisible] = useState(initial?.visible ?? true);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('Name is required'); return; }
    onSave({
      id: initial?.id ?? generateId(),
      name: name.trim(),
      description: description.trim() || undefined,
      sortOrder: initial?.sortOrder ?? 999,
      visible,
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input
        label="Category Name"
        value={name}
        onChange={e => { setName(e.target.value); setError(''); }}
        error={error}
        autoFocus
        placeholder="e.g. Starters, Mains, Desserts"
      />
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        placeholder="Brief description shown under the category heading"
      />
      <Toggle checked={visible} onChange={setVisible} label="Visible on menu" />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial ? 'Save Changes' : 'Add Category'}</Button>
      </div>
    </div>
  );
}

export function CategoryManager() {
  const { state, dispatch } = useMenu();
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const sorted = [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sorted.findIndex(c => c.id === active.id);
    const newIdx = sorted.findIndex(c => c.id === over.id);
    const reordered = arrayMove(sorted, oldIdx, newIdx).map((c, i) => ({ ...c, sortOrder: i }));
    dispatch({ type: 'REORDER_CATEGORIES', payload: reordered });
  };

  const itemCount = (catId: string) => state.items.filter(i => i.categoryId === catId).length;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-text-main">Categories</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-text-main/40 bg-surface rounded-card border border-dashed border-black/15">
          <p className="text-lg">No categories yet</p>
          <button onClick={() => setShowAdd(true)} className="mt-2 text-primary hover:underline text-sm">
            Add your first category
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sorted.map(cat => (
                <SortableRow
                  key={cat.id}
                  category={cat}
                  itemCount={itemCount(cat.id)}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onToggle={cat => dispatch({ type: 'UPDATE_CATEGORY', payload: { ...cat, visible: !cat.visible } })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Category" size="sm">
        <CategoryForm
          onSave={cat => dispatch({ type: 'ADD_CATEGORY', payload: cat })}
          onClose={() => setShowAdd(false)}
        />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Category" size="sm">
        {editTarget && (
          <CategoryForm
            initial={editTarget}
            onSave={cat => dispatch({ type: 'UPDATE_CATEGORY', payload: cat })}
            onClose={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && dispatch({ type: 'DELETE_CATEGORY', payload: deleteTarget.id })}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? All items in this category will also be deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
