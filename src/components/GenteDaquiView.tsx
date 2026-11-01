// [LAYOUT ARCHETYPE]: Clean Citizen Directory & Profile Cards
// [RADIUS & BORDERS]: rounded-2xl to rounded-full pill buttons
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #F97316 (Solar Orange)

import React, { useState } from 'react';
import {
  ChevronRight,
  MapPin,
  Search,
  Share2,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import type { PersonProfile } from '../types/community';

interface GenteDaquiViewProps {
  people: PersonProfile[];
  onOpenPerson: (person: PersonProfile) => void;
  onOpenMyCitizenCard: () => void;
}

export const GenteDaquiView: React.FC<GenteDaquiViewProps> = ({
  people,
  onOpenPerson,
  onOpenMyCitizenCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeople = people.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.talents.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Banner Hero */}
      <div className="px-1 space-y-1.5">
        <span className="text-sm font-extrabold uppercase tracking-widest text-blue-600 block">
          GENTE DAQUI
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Quem faz acontecer <span className="text-blue-600">tá aqui.</span>
        </h1>
        <p className="text-[15px] text-slate-500 font-medium">
          Seu nome. Seu talento. Gente daqui.
        </p>
      </div>

      {/* Featured Card: "Seu nome. Seu talento." */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-blue-600">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>GENTE DAQUI</span>
          </div>

          <button
            onClick={onOpenMyCitizenCard}
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <span>Meu perfil</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 ">
            <Users className="w-11 h-11" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
              Seu nome. Seu talento.
            </h2>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span>Sobradinho &bull; Bahia</span>
            </div>
          </div>
        </div>

        <p className="text-[15px] text-slate-600 leading-relaxed font-sans">
          A cidade precisa conhecer o que você tem de bom. Participe e conecte-se com sua vizinhança.
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={onOpenMyCitizenCard}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] rounded-2xl hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Meu cartão Gente daqui</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[13px] text-slate-400">
            <Share2 className="w-5 h-5 text-slate-400" />
            <span>Crie uma imagem para compartilhar com quem quiser.</span>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900">
            Quem está por aqui
          </h3>
          <span className="text-sm text-slate-400 font-medium">
            {filteredPeople.length} {filteredPeople.length === 1 ? 'nome' : 'nomes'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nome, talento ou bairro"
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* People Listing */}
        <div className="space-y-2.5 pt-1">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              onClick={() => onOpenPerson(person)}
              className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-3.5 hover:shadow transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-base">
                      {person.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {person.name}
                    </h4>
                    {person.badge && (
                      <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.2 rounded-full border border-blue-200">
                        {person.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 block truncate">
                    @{person.handle} &bull; {person.neighborhood}
                  </span>
                  <span className="text-[13px] text-slate-400 block truncate mt-0.5">
                    {person.talents}
                  </span>
                </div>
              </div>

              <div className="w-11 h-11 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
