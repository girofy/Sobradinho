import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-[52px] h-8 rounded-full shrink-0 transition-colors ${checked ? 'bg-blue-600' : 'bg-zinc-300'}`}
  >
    <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);
