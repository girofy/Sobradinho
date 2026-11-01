import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import type { NewspaperData } from '../types';
import { useHaptics } from '../../../hooks/useHaptics';

interface NewspaperSheetProps {
  newspaper: NewspaperData;
  onBack: () => void;
  onShare: () => void;
}

export const NewspaperSheet: React.FC<NewspaperSheetProps> = ({
  newspaper,
  onBack,
  onShare,
}) => {
  const { triggerHaptic } = useHaptics();

  const handleBack = () => {
    triggerHaptic('light');
    onBack();
  };

  const handleShareClick = () => {
    triggerHaptic('selection');
    onShare();
  };

  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
          EDIÇÃO DA CIDADE
        </span>

        <button
          onClick={handleShareClick}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Jornal Sobradinho
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          A voz, as ideias e o cotidiano da nossa terra.
        </p>
      </div>

      {/* Physical Newspaper Sheet Mockup */}
      <div className="bg-[#FAF8F5] border border-amber-200/70 rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden text-slate-900">
        <div className="border-b-2 border-slate-800 pb-4 mb-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 border-b border-slate-300 pb-1.5 mb-3">
            <span>FEITO POR QUEM MORA AQUI</span>
            <span>BAHIA &bull; COMUNIDADE</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-slate-700 block font-newspaper">
                J O R N A L
              </span>
              <h2 className="text-3xl sm:text-4xl font-newspaper font-black tracking-tight text-slate-900 uppercase">
                SOBRADINHO
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 block mt-0.5">
                O N L I N E
              </span>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow">
              SO
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-600 border-t border-slate-300 pt-1.5 mt-3">
            <span>Encontros &bull; Conversas &bull; Oportunidades</span>
            <span className="font-bold uppercase text-blue-700">EDIÇÃO ABERTA</span>
          </div>
        </div>

        {/* Cover Story Section */}
        <section className="space-y-3 pb-5 border-b border-slate-300">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block">
            NA CAPA AGORA
          </span>

          <h3 className="text-xl sm:text-2xl font-newspaper font-bold text-slate-900 leading-tight">
            {newspaper.headline}
          </h3>

          <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-200">
            <img
              src={newspaper.coverImageUrl}
              alt={newspaper.headline}
              className="w-full h-52 sm:h-64 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              ILUSTRAÇÃO
            </div>
          </div>

          <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
            {newspaper.lead}
          </p>

          <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed font-sans pt-1">
            {newspaper.bodyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Side Stories Grid */}
        <section className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newspaper.sideStories.map((story) => (
              <div
                key={story.id}
                className="bg-white/80 border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 transition-colors group cursor-pointer"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                  {story.kicker}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {story.headline}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {story.lead}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider">
          <span>Sobradinho Online &bull; Edição Colaborativa</span>
          <span>Atualização Contínua</span>
        </div>
      </div>
    </div>
  );
};
