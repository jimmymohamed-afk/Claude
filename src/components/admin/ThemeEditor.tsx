import { useMenu } from '../../context/MenuContext';
import type { ThemeConfig, FontFamily, BorderRadiusOption, LayoutOption, CardStyle } from '../../types';
import { ColorPicker } from '../ui/ColorPicker';
import { Toggle } from '../ui/Toggle';
import { PRESET_THEMES } from '../../data/defaults';

const FONTS: { value: FontFamily; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'lato', label: 'Lato' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'poppins', label: 'Poppins' },
];

const FONT_STACKS: Record<FontFamily, string> = {
  inter: "'Inter', sans-serif",
  playfair: "'Playfair Display', serif",
  lato: "'Lato', sans-serif",
  merriweather: "'Merriweather', serif",
  poppins: "'Poppins', sans-serif",
};

const RADII: { value: BorderRadiusOption; label: string }[] = [
  { value: 'none', label: 'Sharp' },
  { value: 'sm', label: 'Slight' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Rounded' },
  { value: 'xl', label: 'Large' },
  { value: 'full', label: 'Pill' },
];

const CARD_STYLES: { value: CardStyle; label: string; desc: string }[] = [
  { value: 'image-top', label: 'Image Top', desc: 'Photo above text in a card' },
  { value: 'image-left', label: 'Image Left', desc: 'Thumbnail on the left' },
  { value: 'minimal', label: 'Minimal', desc: 'Text only, no image container' },
  { value: 'compact', label: 'Compact', desc: 'Slim list rows' },
];

export function ThemeEditor() {
  const { state, dispatch } = useMenu();
  const theme = state.theme;

  const update = (partial: Partial<ThemeConfig>) => {
    dispatch({ type: 'SET_THEME', payload: partial });
  };

  const applyPreset = (key: string) => {
    const preset = PRESET_THEMES[key];
    if (!preset) return;
    const { name: _name, ...rest } = preset;
    update(rest as Partial<ThemeConfig>);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-text-main mb-2">Theme Editor</h2>
      <p className="text-text-main/50 text-sm mb-6">Changes apply live — open the menu in another tab to preview.</p>

      {/* Presets */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-3">Preset Themes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(PRESET_THEMES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="flex items-center gap-2 px-3 py-2 rounded-card border border-black/10 hover:border-primary/40 hover:bg-bg transition-colors text-left"
            >
              <div className="flex gap-1 flex-shrink-0">
                <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: preset.primaryColor }} />
                <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: preset.accentColor }} />
                <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: preset.backgroundColor }} />
              </div>
              <span className="text-xs font-medium text-text-main truncate">{preset.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5 space-y-4">
        <h3 className="font-semibold text-text-main">Colors</h3>
        <ColorPicker label="Primary" value={theme.primaryColor} onChange={v => update({ primaryColor: v })} />
        <ColorPicker label="Accent" value={theme.accentColor} onChange={v => update({ accentColor: v })} />
        <ColorPicker label="Background" value={theme.backgroundColor} onChange={v => update({ backgroundColor: v })} />
        <ColorPicker label="Card Surface" value={theme.surfaceColor} onChange={v => update({ surfaceColor: v })} />
        <ColorPicker label="Text" value={theme.textColor} onChange={v => update({ textColor: v })} />
      </section>

      {/* Typography */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-3">Font</h3>
        <div className="grid grid-cols-1 gap-2">
          {FONTS.map(f => (
            <button
              key={f.value}
              onClick={() => update({ fontFamily: f.value })}
              className={`flex items-center justify-between px-4 py-2.5 rounded-card border transition-colors ${
                theme.fontFamily === f.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-black/10 hover:border-primary/30 hover:bg-bg text-text-main'
              }`}
            >
              <span className="text-sm font-medium">{f.label}</span>
              <span className="text-base" style={{ fontFamily: FONT_STACKS[f.value] }}>{f.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-3">Corner Style</h3>
        <div className="flex gap-2 flex-wrap">
          {RADII.map(r => (
            <button
              key={r.value}
              onClick={() => update({ borderRadius: r.value })}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                theme.borderRadius === r.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-black/15 text-text-main hover:border-primary/40'
              }`}
              style={{ borderRadius: r.value === 'none' ? '0' : r.value === 'full' ? '9999px' : r.value === 'sm' ? '4px' : r.value === 'md' ? '8px' : r.value === 'lg' ? '12px' : '16px' }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </section>

      {/* Layout & Card Style */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-3">Card Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {CARD_STYLES.map(s => (
            <button
              key={s.value}
              onClick={() => update({ cardStyle: s.value as CardStyle })}
              className={`flex flex-col items-start px-4 py-3 rounded-card border transition-colors text-left ${
                theme.cardStyle === s.value
                  ? 'border-primary bg-primary/5'
                  : 'border-black/10 hover:border-primary/30 hover:bg-bg'
              }`}
            >
              <span className={`text-sm font-medium ${theme.cardStyle === s.value ? 'text-primary' : 'text-text-main'}`}>{s.label}</span>
              <span className="text-xs text-text-main/50 mt-0.5">{s.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-black/10">
          <span className="text-sm font-medium text-text-main/80 block mb-2">Grid or List</span>
          <div className="flex gap-2">
            {(['grid', 'list'] as LayoutOption[]).map(l => (
              <button
                key={l}
                onClick={() => update({ layout: l })}
                className={`flex-1 py-2 rounded-card text-sm font-medium border transition-colors capitalize ${
                  theme.layout === l
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-black/15 text-text-main hover:border-primary/40'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Currency & Misc */}
      <section className="bg-surface rounded-card p-5 border border-black/5 space-y-4">
        <h3 className="font-semibold text-text-main">Currency & Display</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-text-main/80">Symbol</label>
            <input
              type="text"
              value={theme.currencySymbol}
              onChange={e => update({ currencySymbol: e.target.value })}
              maxLength={3}
              className="w-16 px-3 py-2 rounded-card border border-black/15 bg-surface text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-text-main/80">Position</label>
            <div className="flex gap-2">
              {(['before', 'after'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => update({ currencyPosition: p })}
                  className={`flex-1 py-2 rounded-card text-sm border transition-colors capitalize ${
                    theme.currencyPosition === p
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-black/15 text-text-main'
                  }`}
                >
                  {p === 'before' ? `${theme.currencySymbol}10` : `10${theme.currencySymbol}`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Toggle
          checked={theme.hideUnavailableItems}
          onChange={v => update({ hideUnavailableItems: v })}
          label="Hide unavailable items from menu"
          id="hide-unavailable"
        />
      </section>
    </div>
  );
}
