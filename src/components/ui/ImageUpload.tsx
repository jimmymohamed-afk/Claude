import { useRef, useState } from 'react';
import { Upload, Link, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlMode(false);
      setUrlInput('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-text-main/80">{label}</span>}
      {value ? (
        <div className="relative">
          <img src={value} alt="preview" className="w-full h-40 object-cover rounded-card border border-black/10" />
          <button
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : urlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            className="flex-1 px-3 py-2 text-sm rounded-card border border-black/15 bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            autoFocus
          />
          <button onClick={handleUrlSubmit} className="px-3 py-2 bg-primary text-white text-sm rounded-card hover:opacity-90">Use</button>
          <button onClick={() => setUrlMode(false)} className="px-3 py-2 text-sm text-text-main/60 hover:text-text-main">Cancel</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-black/20 rounded-card hover:border-primary/40 hover:bg-primary/5 text-text-main/50 hover:text-primary transition-colors"
          >
            <Upload size={20} />
            <span className="text-sm">Upload image</span>
          </button>
          <button
            onClick={() => setUrlMode(true)}
            className="flex items-center gap-2 px-4 py-2 border border-black/15 rounded-card hover:bg-bg text-text-main/60 hover:text-text-main text-sm"
          >
            <Link size={16} />
            URL
          </button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
