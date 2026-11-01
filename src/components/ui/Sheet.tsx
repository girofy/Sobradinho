import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/** Bottom sheet padrão de app mobile: fundo escurecido, alça, rolagem interna, fecha com toque fora ou Esc. */
export const Sheet: React.FC<SheetProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/45 animate-fade-in" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white rounded-t-[28px] max-h-[88vh] flex flex-col animate-sheet-up"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="w-10 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3" />
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <h3 className="text-xl font-extrabold text-zinc-900">{title}</h3>
          <button onClick={onClose} aria-label="Fechar" className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-zinc-600 active:bg-zinc-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  , document.body);
};
