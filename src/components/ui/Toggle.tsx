interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  const toggleId = id ?? 'toggle';
  return (
    <label htmlFor={toggleId} className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative">
        <input
          id={toggleId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-black/20'}`} />
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
      </div>
      {label && <span className="text-sm text-text-main/80">{label}</span>}
    </label>
  );
}
