// [LAYOUT]: Barra inferior estilo app nativo: 5 ícones grandes, sem texto, aba ativa preenchida.
// [ACCENT]: #2563EB (azul)

import React from 'react';
import { Home, Wrench, Plus, Tag, User } from 'lucide-react';
import type { MainTab } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';

interface BottomNavigationProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  onOpenComposer: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onChangeTab, onOpenComposer }) => {
  const { triggerHaptic } = useHaptics();

  const handleTabClick = (tab: MainTab) => {
    triggerHaptic('selection');
    onChangeTab(tab);
  };

  const handleComposeClick = () => {
    triggerHaptic('medium');
    onOpenComposer();
  };

  const items = [
    { tab: 'feed' as MainTab, label: 'Início', Icon: Home, active: activeTab === 'feed' || activeTab === 'inicio' },
    { tab: 'servicos' as MainTab, label: 'Serviços', Icon: Wrench, active: activeTab === 'servicos' || activeTab === 'resolve' },
    { tab: 'classificados' as MainTab, label: 'Classificados', Icon: Tag, active: activeTab === 'classificados' },
    { tab: 'perfil' as MainTab, label: 'Perfil', Icon: User, active: activeTab === 'perfil' },
  ];

  const renderItem = ({ tab, label, Icon, active }: (typeof items)[number]) => (
    <button
      key={tab}
      onClick={() => handleTabClick(tab)}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="flex-1 h-14 flex items-center justify-center active:scale-90 transition-transform"
    >
      <Icon
        className={`w-7 h-7 ${active ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-400'}`}
        strokeWidth={active ? 2.2 : 1.8}
      />
    </button>
  );

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-zinc-200 max-w-md mx-auto select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center h-14">
        {items.slice(0, 2).map(renderItem)}

        <button
          onClick={handleComposeClick}
          aria-label="Publicar"
          className="flex-1 h-14 flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="w-12 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
            <Plus className="w-6 h-6" strokeWidth={2.8} />
          </span>
        </button>

        {items.slice(2).map(renderItem)}
      </div>
    </nav>
  );
};
