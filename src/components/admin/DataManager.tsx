import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, HardDrive } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { exportDataAsJson, importDataFromJson } from '../../utils/exportImport';
import { getStorageUsageBytes } from '../../utils/storage';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Button } from '../ui/Button';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB estimate

export function DataManager() {
  const { state, dispatch } = useMenu();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const usedBytes = getStorageUsageBytes();
  const usedKB = (usedBytes / 1024).toFixed(1);
  const pct = Math.min(100, Math.round((usedBytes / MAX_BYTES) * 100));

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess(false);
    try {
      const data = await importDataFromJson(file);
      dispatch({ type: 'IMPORT_DATA', payload: data });
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    }
    e.target.value = '';
  };

  return (
    <div className="p-6 md:p-8 max-w-xl">
      <h2 className="text-2xl font-heading font-bold text-text-main mb-6">Data Manager</h2>

      {/* Storage meter */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <HardDrive size={18} className="text-text-main/50" />
          <h3 className="font-semibold text-text-main">Storage Usage</h3>
        </div>
        <div className="w-full bg-bg rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all ${pct > 70 ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm text-text-main/60">
          {usedKB} KB used ({pct}% of ~5 MB).
          {pct > 70 && ' Consider using image URLs instead of uploads to save space.'}
        </p>
      </section>

      {/* Export */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-1">Export</h3>
        <p className="text-sm text-text-main/60 mb-4">
          Download all your menu data as a JSON file. Use this to back up your menu or move it to another device.
        </p>
        <Button onClick={() => exportDataAsJson(state)}>
          <Download size={16} /> Export as JSON
        </Button>
      </section>

      {/* Import */}
      <section className="bg-surface rounded-card p-5 border border-black/5 mb-5">
        <h3 className="font-semibold text-text-main mb-1">Import</h3>
        <p className="text-sm text-text-main/60 mb-4">
          Load a previously exported JSON file. <strong className="text-text-main">This will replace all current data.</strong>
        </p>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Import JSON
        </Button>
        {importError && (
          <p className="mt-3 text-sm text-red-500">{importError}</p>
        )}
        {importSuccess && (
          <p className="mt-3 text-sm text-green-600">Data imported successfully!</p>
        )}
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
      </section>

      {/* Reset */}
      <section className="bg-surface rounded-card p-5 border border-red-200">
        <h3 className="font-semibold text-red-700 mb-1">Reset to Defaults</h3>
        <p className="text-sm text-text-main/60 mb-4">
          Erase all your data and reload the sample menu. This cannot be undone.
        </p>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          <RotateCcw size={16} /> Reset Everything
        </Button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => dispatch({ type: 'RESET_TO_DEFAULTS' })}
        title="Reset to Defaults"
        message="This will delete all your categories, items, theme settings, and restaurant info and replace them with the sample data. Are you sure?"
        confirmLabel="Yes, Reset"
        danger
      />
    </div>
  );
}
