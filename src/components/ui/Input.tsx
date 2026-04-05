import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-main/80">{label}</label>}
      <input
        id={inputId}
        className={`w-full px-3 py-2 rounded-card border bg-surface text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${error ? 'border-red-500' : 'border-black/15'} ${className}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-main/50">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-main/80">{label}</label>}
      <textarea
        id={inputId}
        rows={3}
        className={`w-full px-3 py-2 rounded-card border bg-surface text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-y ${error ? 'border-red-500' : 'border-black/15'} ${className}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-main/50">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-main/80">{label}</label>}
      <select
        id={inputId}
        className={`w-full px-3 py-2 rounded-card border bg-surface text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${error ? 'border-red-500' : 'border-black/15'} ${className}`}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
