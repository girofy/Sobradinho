// [LAYOUT ARCHETYPE]: Bottom Fixed Swiss Toolbar with 4 Core Destinations + Action Button
// [RADIUS & BORDERS]: rounded (4px) central action, rounded-sm (2px) indicators, border-t border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue)

import React from 'react';
import { Newspaper, Wrench, Plus, Tag, User } from 'lucide-react';
import type { MainTab } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';

interface BottomNavigationProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  onOpenComposer: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenComposer,
}) => {
  const { triggerHaptic } = useHaptics();

  const handleTabClick = (tab: MainTab) => {
    triggerHaptic('selection');
    onChangeTab(tab);
  };

  const handleComposeClick = () => {
    triggerHaptic('medium');
    onOpenComposer();
  };

  const isFeedActive = activeTab === 'feed' || activeTab === 'inicio';
  const isServicesActive = activeTab === 'servicos' || activeTab === 'resolve';
  const isClassifiedsActive = activeTab === 'classificados';
  const isProfileActive = activeTab === 'perfil';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-zinc-200 h-13 sm:h-14 flex items-center justify-between px-2 max-w-md mx-auto shadow-sm select-none">
      {/* 1. Feed */}
      <button
        onClick={() => handleTabClick('feed')}
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
          isFeedActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
        title="Feed Comunitário"
      >
        <Newspaper className={`w-4 h-4 mb-0.5 ${isFeedActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-medium leading-none">Feed</span>
      </button>

      {/* 2. Serviços */}
      <button
        onClick={() => handleTabClick('servicos')}
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
          isServicesActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
        title="Serviços & Negócios Locais"
      >
        <Wrench className={`w-4 h-4 mb-0.5 ${isServicesActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-medium leading-none">Serviços</span>
      </button>

      {/* 3. Center Quick Action [+] */}
      <button
        onClick={handleComposeClick}
        className="flex flex-col items-center justify-center px-1 group active:scale-95 transition-transform"
        title="Publicar foto ou relato estilo Instagram"
      >
        <div className="w-8 h-8 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow transition-colors">
          <Plus className="w-4 h-4 stroke-[2.8]" />
        </div>
        <span className="text-[8.5px] font-mono font-bold text-blue-600 mt-0.5">Postar</span>
      </button>

      {/* 4. Classificados */}
      <button
        onClick={() => handleTabClick('classificados')}
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
          isClassifiedsActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
        title="Classificados & Desapego"
      >
        <Tag className={`w-4 h-4 mb-0.5 ${isClassifiedsActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-medium leading-none">Classificados</span>
      </button>

      {/* 5. Perfil */}
      <button
        onClick={() => handleTabClick('perfil')}
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
          isProfileActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
        title="Perfil & Classificação"
      >
        <User className={`w-4 h-4 mb-0.5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-medium leading-none">Perfil</span>
      </button>
    </nav>
  );
};
