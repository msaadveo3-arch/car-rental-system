import React, { useMemo, useState } from 'react';
import { COUNTRIES } from '../../data/countries';

const CountryInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  withCode?: boolean;
  size?: 'sm' | 'md';
}> = ({ value, onChange, required, withCode = true, size = 'md' }) => {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return COUNTRIES.slice(0, 8);
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [value]);

  return (
    <div className="relative">
      <input
        value={value}
        required={required}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder="Type country name..."
        className={size === 'sm' ? 'app-field-sm w-full' : 'app-field'}
      />
      {open && suggestions.length > 0 && (
      <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-box border border-base-300 bg-base-100 shadow-redwood-lg">
          {suggestions.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(withCode ? `${c.name} (${c.code})` : c.name); setOpen(false); }}
                className={`btn btn-ghost h-auto w-full justify-start text-left text-sm font-normal text-base-content/80 ${
                  size === 'sm' ? 'min-h-9 px-3 py-1.5' : 'min-h-10 px-4 py-2'
                }`}
              >
                {c.name} ({c.code})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryInput;
