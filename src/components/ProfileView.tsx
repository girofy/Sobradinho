// [LAYOUT ARCHETYPE]: Dedicated Citizen Profile & Community Leaderboard View
// [RADIUS & BORDERS]: rounded (4px) containers, rounded-sm (2px) buttons/chips, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange for badges)

import React, { useState } from 'react';
import {
  Award,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  HelpCircle,
  MapPin,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  User,
  Phone,
  RotateCcw,
} from 'lucide-react';
import type { CitizenRankItem, FeedPost, UserConfig } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';

interface ProfileViewProps {
  userName: string;
  userNeighborhood: string;
  onUpdateUser: (name: string, neighborhood: string) => void;
  savedCount: number;
  rankingList: CitizenRankItem[];
  savedPosts: FeedPost[];
  onUnsavePost: (id: string) => void;
  defaultSubTab?: 'perfil' | 'classificacao' | 'salvos' | 'configuracoes';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName,
  userNeighborhood,
  onUpdateUser,
  savedCount,
  rankingList,
  savedPosts,
  onUnsavePost,
  defaultSubTab = 'perfil',
}) => {
  const { triggerHaptic } = useHaptics();
  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'classificacao' | 'salvos' | 'configuracoes'>(defaultSubTab);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [neighborhoodInput, setNeighborhoodInput] = useState(userNeighborhood);
  const [bioInput, setBioInput] = useState('Morador engajado com o cotidiano e causas comunitárias de Sobradinho.');

  // Config Toggles
  const [config, setConfig] = useState<UserConfig>({
    name: userName,
    handle: userName.toLowerCase().replace(/\s+/g, ''),
    neighborhood: userNeighborhood,
    bio: 'Morador engajado de Sobradinho.',
    whatsapp: '74999990001',
    notifyAlerts: true,
    notifyNeighborhood: true,
    notifyPolls: true,
    showWhatsappPublic: true,
  });

  const [rankFilter, setRankFilter] = useState<'geral' | 'semana'>('geral');

  const handleSaveProfile = () => {
    triggerHaptic('medium');
    onUpdateUser(nameInput.trim() || userName, neighborhoodInput.trim() || userNeighborhood);
    setIsEditing(false);
  };

  const topThree = rankingList.slice(0, 3);

  return (
    <div className="space-y-3.5 animate-fade-in pb-4">
      {/* Top Segmented Sub-Header Tabs */}
      <div className="bg-white border border-zinc-200 rounded p-1 flex items-center justify-between text-xs font-semibold">
        {[
          { key: 'perfil', label: 'Meu Perfil', icon: User },
          { key: 'classificacao', label: 'Classificação', icon: Trophy },
          { key: 'salvos', label: `Salvos (${savedCount})`, icon: Bookmark },
          { key: 'configuracoes', label: 'Ajustes', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                triggerHaptic('selection');
                setActiveSubTab(tab.key as any);
              }}
              className={`flex-1 py-1.5 px-1 rounded-sm transition-colors flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-zinc-900 text-white font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: MEU PERFIL */}
      {activeSubTab === 'perfil' && (
        <div className="space-y-3.5">
          {/* Main Citizen Card */}
          <div className="bg-white border border-zinc-200 rounded p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-blue-600 text-white font-mono font-bold text-xl flex items-center justify-center border border-blue-700 shadow-sm shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight truncate">
                    {userName}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500 block">
                    @{userName.toLowerCase().replace(/\s+/g, '')}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-600 mt-0.5">
                    <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                    <span className="truncate">{userNeighborhood} • Sobradinho-BA</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold rounded-sm uppercase tracking-wider shrink-0 font-mono">
                Nível 5
              </span>
            </div>

            {/* Civic Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-600">
                <span className="font-semibold text-zinc-800">Guardião da Barragem</span>
                <span>480 / 500 XP</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-none overflow-hidden border border-zinc-200">
                <div className="bg-blue-600 h-full w-[94%]" />
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed font-sans border-t border-zinc-100 pt-2">
              {bioInput}
            </p>

            {/* Citizen Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-100 text-center">
              <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="text-base font-bold font-mono text-zinc-900 block leading-tight">480</span>
                <span className="text-[10px] uppercase font-semibold text-zinc-500">Pontos Cívicos</span>
              </div>
              <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="text-base font-bold font-mono text-zinc-900 block leading-tight">26</span>
                <span className="text-[10px] uppercase font-semibold text-zinc-500">Relatos Criados</span>
              </div>
              <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="text-base font-bold font-mono text-zinc-900 block leading-tight">1º</span>
                <span className="text-[10px] uppercase font-semibold text-zinc-500">No Ranking</span>
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          <div className="bg-white border border-zinc-200 rounded p-3.5 space-y-2.5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
              Conquistas Comunitárias
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { title: 'Guardião da Barragem', desc: 'Mais de 20 relatos sobre a cidade', icon: Shield, color: 'text-blue-600' },
                { title: 'Voz da Comunidade', desc: 'Votou em todas as consultas populares', icon: Award, color: 'text-orange-600' },
                { title: 'Olhar do São Francisco', desc: 'Fotos destacadas na retrospectiva', icon: Sparkles, color: 'text-amber-600' },
                { title: 'Vizinho Conectado', desc: 'Perfil completo e verificado', icon: Check, color: 'text-emerald-600' },
              ].map((b) => {
                const BIcon = b.icon;
                return (
                  <div key={b.title} className="p-2 bg-zinc-50 border border-zinc-200 rounded-sm flex items-start gap-2">
                    <BIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${b.color}`} />
                    <div>
                      <strong className="text-xs font-bold text-zinc-900 block leading-tight">{b.title}</strong>
                      <span className="text-[10px] text-zinc-500 leading-tight block">{b.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edit Details */}
          {isEditing ? (
            <div className="bg-white border border-zinc-200 rounded p-3.5 space-y-2.5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Editar Meus Dados
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Nome de exibição</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Bairro / Região</label>
                  <input
                    type="text"
                    value={neighborhoodInput}
                    onChange={(e) => setNeighborhoodInput(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Biografia resumida</label>
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1 border-t border-zinc-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs text-zinc-600 hover:text-zinc-900 rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-sm hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-sm hover:bg-zinc-50 transition-colors uppercase tracking-wider shadow-sm"
            >
              Editar Meus Dados
            </button>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CLASSIFICAÇÃO / RANKING */}
      {activeSubTab === 'classificacao' && (
        <div className="space-y-3.5">
          <div className="bg-white border border-zinc-200 rounded p-3 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-tight">
                Classificação Comunitária
              </h3>
              <span className="text-[11px] text-zinc-500">
                Moradores que mais colaboram com Sobradinho
              </span>
            </div>
            <div className="flex rounded-sm border border-zinc-200 overflow-hidden text-[11px] font-semibold">
              <button
                onClick={() => setRankFilter('geral')}
                className={`px-2 py-1 ${rankFilter === 'geral' ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-50 text-zinc-700'}`}
              >
                Geral
              </button>
              <button
                onClick={() => setRankFilter('semana')}
                className={`px-2 py-1 ${rankFilter === 'semana' ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-50 text-zinc-700'}`}
              >
                Semana
              </button>
            </div>
          </div>

          {/* Podium */}
          <div className="grid grid-cols-3 gap-2 pt-1 pb-1 items-end">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="bg-white border border-zinc-200 rounded-sm p-2 text-center flex flex-col items-center shadow-sm">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">2º Lugar</span>
                <div className="w-10 h-10 rounded-sm bg-zinc-200 text-zinc-700 font-bold font-mono text-sm flex items-center justify-center my-1 border border-zinc-300">
                  {topThree[1].name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-zinc-900 truncate w-full">{topThree[1].name}</span>
                <span className="text-[10px] font-mono font-bold text-blue-600">{topThree[1].points} pts</span>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="bg-amber-50/70 border-2 border-amber-400 rounded-sm p-2.5 text-center flex flex-col items-center relative -mt-3 shadow-sm">
                <span className="absolute -top-2.5 px-2 py-0.2 bg-amber-500 text-white font-mono text-[9px] font-bold uppercase rounded-sm">
                  1º Campeão
                </span>
                <div className="w-11 h-11 rounded-sm bg-amber-500 text-white font-bold font-mono text-base flex items-center justify-center my-1 border border-amber-600">
                  {topThree[0].name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-zinc-900 truncate w-full">{topThree[0].name}</span>
                <span className="text-[11px] font-mono font-black text-amber-700">{topThree[0].points} pts</span>
                <span className="text-[9px] text-zinc-500 truncate w-full">{topThree[0].neighborhood}</span>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="bg-white border border-zinc-200 rounded-sm p-2 text-center flex flex-col items-center shadow-sm">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">3º Lugar</span>
                <div className="w-10 h-10 rounded-sm bg-orange-100 text-orange-700 font-bold font-mono text-sm flex items-center justify-center my-1 border border-orange-200">
                  {topThree[2].name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-zinc-900 truncate w-full">{topThree[2].name}</span>
                <span className="text-[10px] font-mono font-bold text-blue-600">{topThree[2].points} pts</span>
              </div>
            )}
          </div>

          {/* Full Leaderboard Table */}
          <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white shadow-sm">
            <div className="bg-zinc-100 px-3 py-1.5 border-b border-zinc-200 flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
              <span>Posição & Cidadão</span>
              <span>Pontos</span>
            </div>
            <div className="divide-y divide-zinc-100 text-xs">
              {rankingList.map((citizen) => (
                <div
                  key={citizen.id}
                  className={`px-3 py-2 flex items-center justify-between transition-colors ${
                    citizen.isCurrentUser ? 'bg-blue-50/70 font-semibold' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 font-mono text-xs font-bold ${citizen.rank <= 3 ? 'text-amber-600' : 'text-zinc-400'}`}>
                      #{citizen.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-900 font-bold truncate">{citizen.name}</span>
                        {citizen.isCurrentUser && (
                          <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] font-bold rounded-sm">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 block truncate">
                        {citizen.badge} &bull; {citizen.neighborhood}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 text-xs shrink-0 pl-2">
                    {citizen.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guide */}
          <div className="p-3 bg-white border border-zinc-200 rounded-sm space-y-1 text-xs shadow-sm">
            <strong className="text-[11px] uppercase font-bold text-zinc-700 block flex items-center gap-1 font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Como somar pontos no ranking?</span>
            </strong>
            <ul className="text-[11px] text-zinc-600 space-y-0.5 font-mono">
              <li>• Publicar relato com foto de Sobradinho: <strong className="text-zinc-900">+50 pts</strong></li>
              <li>• Votar em consulta popular semanal: <strong className="text-zinc-900">+30 pts</strong></li>
              <li>• Prestar serviço ou tirar dúvida de vizinho: <strong className="text-zinc-900">+100 pts</strong></li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SALVOS */}
      {activeSubTab === 'salvos' && (
        <div className="space-y-3">
          <div className="bg-white border border-zinc-200 rounded p-3 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-tight">
                Itens Salvos
              </h3>
              <span className="text-[11px] text-zinc-500">
                Relatos marcados para reler ou consultar
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">
              {savedPosts.length} itens
            </span>
          </div>

          {savedPosts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-300 rounded-sm bg-white space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-zinc-400 stroke-[1.5]" />
              <p className="text-xs font-semibold text-zinc-700">Nenhum item salvo ainda</p>
              <p className="text-[11px] text-zinc-500">
                Toque no ícone de marcador nos relatos do feed para salvá-los aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-white border border-zinc-200 rounded-sm flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <span className="font-bold text-zinc-800">{post.authorName}</span>
                      <span>•</span>
                      <span>{post.neighborhood}</span>
                    </div>
                    <p className="text-xs text-zinc-800 line-clamp-2 leading-snug">
                      {post.content}
                    </p>
                  </div>
                  <button
                    onClick={() => onUnsavePost(post.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold shrink-0 p-1"
                    title="Remover dos salvos"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: CONFIGURAÇÕES */}
      {activeSubTab === 'configuracoes' && (
        <div className="space-y-3.5">
          <div className="bg-white border border-zinc-200 rounded p-3 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 leading-tight">
              Ajustes do Aplicativo
            </h3>
            <span className="text-[11px] text-zinc-500">
              Personalize notificações e alertas de Sobradinho
            </span>
          </div>

          <div className="border border-zinc-200 rounded divide-y divide-zinc-100 bg-white text-xs shadow-sm">
            <div className="p-3 flex items-center justify-between">
              <div className="pr-2">
                <strong className="font-bold text-zinc-900 block leading-tight">
                  Avisos de Emergência & Barragem CHESF
                </strong>
                <span className="text-[11px] text-zinc-500">
                  Vazão do lago, segurança e comunicados prioritários
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.notifyAlerts}
                onChange={(e) => setConfig({ ...config, notifyAlerts: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="pr-2">
                <strong className="font-bold text-zinc-900 block leading-tight">
                  Relatos no meu bairro ({userNeighborhood})
                </strong>
                <span className="text-[11px] text-zinc-500">
                  Receba avisos quando vizinhos postarem na sua região
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.notifyNeighborhood}
                onChange={(e) => setConfig({ ...config, notifyNeighborhood: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div className="pr-2">
                <strong className="font-bold text-zinc-900 block leading-tight">
                  Consultas Populares & Enquetes
                </strong>
                <span className="text-[11px] text-zinc-500">
                  Avisar quando novas votações forem abertas
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.notifyPolls}
                onChange={(e) => setConfig({ ...config, notifyPolls: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* System Info */}
          <div className="p-3 bg-white border border-zinc-200 rounded space-y-2 text-xs shadow-sm">
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <span>Portal:</span>
              <span className="font-bold text-zinc-800">Sobradinho Online v2.5</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <span>Modo:</span>
              <span className="font-bold text-emerald-600">Local Ativo</span>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-[11px] font-semibold text-zinc-600 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar padrões locais</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
