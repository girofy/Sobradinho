// [LAYOUT ARCHETYPE]: Multi-Tab Citizen Console & Swiss Ranking Table
// [RADIUS & BORDERS]: rounded-2xl (4px) modal container, rounded-xl (2px) buttons/chips, border border-zinc-100
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange)

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
  Sliders,
  Sparkles,
  Trophy,
  User,
  X,
  Phone,
  RotateCcw,
} from 'lucide-react';
import type { CitizenRankItem, FeedPost, UserConfig } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userNeighborhood: string;
  onUpdateUser: (name: string, neighborhood: string) => void;
  savedCount: number;
  rankingList: CitizenRankItem[];
  savedPosts: FeedPost[];
  onUnsavePost: (id: string) => void;
  defaultTab?: 'perfil' | 'classificacao' | 'configuracoes' | 'salvos';
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  userName,
  userNeighborhood,
  onUpdateUser,
  savedCount,
  rankingList,
  savedPosts,
  onUnsavePost,
  defaultTab = 'perfil',
}) => {
  const { triggerHaptic } = useHaptics();
  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'classificacao' | 'configuracoes' | 'salvos'>(defaultTab);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [neighborhoodInput, setNeighborhoodInput] = useState(userNeighborhood);
  const [bioInput, setBioInput] = useState('Morador engajado com as causas e o cotidiano de Sobradinho-BA.');
  const [whatsappInput, setWhatsappInput] = useState('(74) 99999-0001');

  // Configuration Toggles
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

  // Ranking Filter
  const [rankFilter, setRankFilter] = useState<'geral' | 'semana'>('geral');

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    triggerHaptic('medium');
    onUpdateUser(nameInput.trim() || userName, neighborhoodInput.trim() || userNeighborhood);
    setIsEditing(false);
  };

  const topThree = rankingList.slice(0, 3);
  const restOfRanking = rankingList.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-none animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-300 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="h-12 border-b border-zinc-100 px-3.5 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              SO
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Painel do Cidadão
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-xl transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Perfil | Classificação | Salvos | Configurações) */}
        <div className="grid grid-cols-4 border-b border-zinc-100 bg-zinc-100 text-center text-sm font-semibold">
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
                className={`py-2.5 px-1 border-r last:border-r-0 border-zinc-100 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-white text-blue-600 font-bold border-b-2 border-b-blue-600'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[13px] truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: MEU PERFIL */}
          {activeSubTab === 'perfil' && (
            <div className="space-y-4">
              {/* Citizen Card Box */}
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center border border-blue-700">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">
                        {userName}
                      </h3>
                      <span className="text-[13px] text-zinc-500 block">
                        @{userName.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <div className="flex items-center gap-1 text-[13px] text-zinc-600 mt-0.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>{userNeighborhood} • Sobradinho-BA</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl uppercase tracking-wider">
                    Nível 5
                  </span>
                </div>

                {/* Civic Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[13px] text-zinc-600">
                    <span className="font-semibold text-zinc-800">Guardião da Barragem</span>
                    <span>480 / 500 XP</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-none overflow-hidden">
                    <div className="bg-blue-600 h-full w-[94%]" />
                  </div>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed font-sans border-t border-zinc-200/80 pt-2">
                  {bioInput}
                </p>

                {/* Citizen Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-200/80 text-center">
                  <div className="p-3 bg-white border border-zinc-100 rounded-xl">
                    <span className="text-base font-bold text-zinc-900 block leading-tight">480</span>
                    <span className="text-xs uppercase font-semibold text-zinc-500">Pontos Cívicos</span>
                  </div>
                  <div className="p-3 bg-white border border-zinc-100 rounded-xl">
                    <span className="text-base font-bold text-zinc-900 block leading-tight">26</span>
                    <span className="text-xs uppercase font-semibold text-zinc-500">Relatos Criados</span>
                  </div>
                  <div className="p-3 bg-white border border-zinc-100 rounded-xl">
                    <span className="text-base font-bold text-zinc-900 block leading-tight">1º</span>
                    <span className="text-xs uppercase font-semibold text-zinc-500">No Ranking</span>
                  </div>
                </div>
              </div>

              {/* Earned Badges */}
              <div className="space-y-2">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-700 block">
                  Conquistas Comunitárias
                </span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { title: 'Guardião da Barragem', desc: 'Mais de 20 relatos sobre a cidade', icon: Shield, color: 'text-blue-600' },
                    { title: 'Voz da Comunidade', desc: 'Votou em todas as consultas populares', icon: Award, color: 'text-orange-600' },
                    { title: 'Olhar do São Francisco', desc: 'Fotos destacadas na retrospectiva', icon: Sparkles, color: 'text-amber-600' },
                    { title: 'Vizinho Conectado', desc: 'Perfil completo e verificado', icon: Check, color: 'text-emerald-600' },
                  ].map((b) => {
                    const BIcon = b.icon;
                    return (
                      <div key={b.title} className="p-3.5 bg-white border border-zinc-100 rounded-xl flex items-start gap-2">
                        <BIcon className={`w-5 h-5 mt-0.5 shrink-0 ${b.color}`} />
                        <div>
                          <strong className="text-sm font-bold text-zinc-900 block leading-tight">{b.title}</strong>
                          <span className="text-xs text-zinc-500 leading-tight block">{b.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edit Details */}
              {isEditing ? (
                <div className="bg-zinc-50 border border-zinc-300 rounded-2xl p-4 space-y-2.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
                    Editar Dados Pessoais
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 mb-0.5">Nome de exibição</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 mb-0.5">Bairro / Região</label>
                      <input
                        type="text"
                        value={neighborhoodInput}
                        onChange={(e) => setNeighborhoodInput(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 mb-0.5">Biografia resumida</label>
                      <input
                        type="text"
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1 border-t border-zinc-100">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700"
                    >
                      Salvar alterações
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 border border-zinc-300 text-zinc-800 text-sm font-semibold rounded-xl hover:bg-zinc-50 transition-colors uppercase tracking-wider"
                >
                  Editar Meus Dados
                </button>
              )}
            </div>
          )}

          {/* TAB 2: CLASSIFICAÇÃO / RANKING CÍVICO */}
          {activeSubTab === 'classificacao' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">
                    Classificação Comunitária
                  </h3>
                  <span className="text-[13px] text-zinc-500">
                    Moradores que mais colaboram com Sobradinho
                  </span>
                </div>
                <div className="flex rounded-xl border border-zinc-300 overflow-hidden text-[13px] font-semibold">
                  <button
                    onClick={() => setRankFilter('geral')}
                    className={`px-2 py-2 ${rankFilter === 'geral' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700'}`}
                  >
                    Geral
                  </button>
                  <button
                    onClick={() => setRankFilter('semana')}
                    className={`px-2 py-2 ${rankFilter === 'semana' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700'}`}
                  >
                    Esta Semana
                  </button>
                </div>
              </div>

              {/* Podium for Top 3 */}
              <div className="grid grid-cols-3 gap-2 pt-2 pb-1 items-end">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-center flex flex-col items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase">2º Lugar</span>
                    <div className="w-10 h-12 rounded-xl bg-zinc-200 text-zinc-700 font-bold text-[15px] flex items-center justify-center my-1 border border-zinc-300">
                      {topThree[1].name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 truncate w-full">{topThree[1].name}</span>
                    <span className="text-xs font-bold text-blue-600">{topThree[1].points} pts</span>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="bg-amber-50/50 border-2 border-amber-400 rounded-xl p-3.5 text-center flex flex-col items-center relative -mt-3 ">
                    <span className="absolute -top-2.5 px-2 py-0.2 bg-amber-500 text-white text-xs font-bold uppercase rounded-xl">
                      1º Campeão
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-bold text-base flex items-center justify-center my-1 border border-amber-600">
                      {topThree[0].name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 truncate w-full">{topThree[0].name}</span>
                    <span className="text-[13px] font-black text-amber-700">{topThree[0].points} pts</span>
                    <span className="text-xs text-zinc-500 truncate w-full">{topThree[0].neighborhood}</span>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-center flex flex-col items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase">3º Lugar</span>
                    <div className="w-10 h-12 rounded-xl bg-orange-100 text-orange-700 font-bold text-[15px] flex items-center justify-center my-1 border border-orange-200">
                      {topThree[2].name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 truncate w-full">{topThree[2].name}</span>
                    <span className="text-xs font-bold text-blue-600">{topThree[2].points} pts</span>
                  </div>
                )}
              </div>

              {/* Full Leaderboard Table */}
              <div className="border border-zinc-100 rounded-xl overflow-hidden bg-white">
                <div className="bg-zinc-100 px-3 py-2.5 border-b border-zinc-100 flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 ">
                  <span>Posição & Cidadão</span>
                  <span>Pontos</span>
                </div>
                <div className="divide-y divide-zinc-100 text-sm">
                  {rankingList.map((citizen) => (
                    <div
                      key={citizen.id}
                      className={`px-3 py-2 flex items-center justify-between transition-colors ${
                        citizen.isCurrentUser ? 'bg-blue-50/70 font-semibold' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5  text-sm font-bold ${citizen.rank <= 3 ? 'text-amber-600' : 'text-zinc-400'}`}>
                          #{citizen.rank}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-900 font-bold truncate">{citizen.name}</span>
                            {citizen.isCurrentUser && (
                              <span className="px-1.5 py-0.2 bg-blue-600 text-white text-xs font-bold rounded-xl">
                                VOCÊ
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-500 block truncate">
                            {citizen.badge} &bull; {citizen.neighborhood}
                          </span>
                        </div>
                      </div>
                      <span className=" font-bold text-zinc-900 text-sm shrink-0 pl-2">
                        {citizen.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points Rules Guide */}
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1 text-sm">
                <strong className="text-[13px] uppercase font-bold text-zinc-700 block flex items-center gap-1">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>Como somar pontos no ranking?</span>
                </strong>
                <ul className="text-[13px] text-zinc-600 space-y-0.5 ">
                  <li>• Publicar relato com foto de Sobradinho: <strong className="text-zinc-900">+50 pts</strong></li>
                  <li>• Votar em consulta popular semanal: <strong className="text-zinc-900">+30 pts</strong></li>
                  <li>• Prestar serviço ou responder dúvida de vizinho: <strong className="text-zinc-900">+100 pts</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: ITENS SALVOS */}
          {activeSubTab === 'salvos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">
                    Itens Salvos
                  </h3>
                  <span className="text-[13px] text-zinc-500">
                    Relatos marcados para reler ou consultar
                  </span>
                </div>
                <span className=" text-sm font-bold text-zinc-500">
                  {savedPosts.length} itens
                </span>
              </div>

              {savedPosts.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-zinc-300 rounded-xl bg-zinc-50 space-y-2">
                  <Bookmark className="w-11 h-11 mx-auto text-zinc-400 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-zinc-700">Nenhum item salvo ainda</p>
                  <p className="text-[13px] text-zinc-500">
                    Toque no ícone de marcador nos relatos do feed para acessá-los rapidamente aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-white border border-zinc-100 rounded-xl flex items-start justify-between gap-3 hover:border-zinc-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-zinc-500 ">
                          <span className="font-bold text-zinc-800">{post.authorName}</span>
                          <span>•</span>
                          <span>{post.neighborhood}</span>
                        </div>
                        <p className="text-sm text-zinc-800 line-clamp-2 leading-snug">
                          {post.content}
                        </p>
                      </div>
                      <button
                        onClick={() => onUnsavePost(post.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold shrink-0 p-1"
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

          {/* TAB 4: CONFIGURAÇÕES */}
          {activeSubTab === 'configuracoes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">
                  Configurações do Aplicativo
                </h3>
                <span className="text-[13px] text-zinc-500">
                  Personalize alertas, privacidade e notificações
                </span>
              </div>

              {/* Notification Toggles */}
              <div className="border border-zinc-100 rounded-xl divide-y divide-zinc-100 bg-white text-sm">
                <div className="p-4 flex items-center justify-between">
                  <div className="pr-2">
                    <strong className="font-bold text-zinc-900 block leading-tight">
                      Avisos de Emergência & Barragem CHESF
                    </strong>
                    <span className="text-[13px] text-zinc-500">
                      Vazão do lago, segurança e comunicados prioritários da defesa civil
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifyAlerts}
                    onChange={(e) => setConfig({ ...config, notifyAlerts: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="pr-2">
                    <strong className="font-bold text-zinc-900 block leading-tight">
                      Relatos no meu bairro ({userNeighborhood})
                    </strong>
                    <span className="text-[13px] text-zinc-500">
                      Receba avisos quando novos moradores postarem na sua região
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifyNeighborhood}
                    onChange={(e) => setConfig({ ...config, notifyNeighborhood: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="pr-2">
                    <strong className="font-bold text-zinc-900 block leading-tight">
                      Consultas Populares & Enquetes
                    </strong>
                    <span className="text-[13px] text-zinc-500">
                      Avisar quando a nova pergunta da semana for aberta no Participa
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifyPolls}
                    onChange={(e) => setConfig({ ...config, notifyPolls: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="pr-2">
                    <strong className="font-bold text-zinc-900 block leading-tight">
                      Exibir WhatsApp na lista de prestadores
                    </strong>
                    <span className="text-[13px] text-zinc-500">
                      Permite que vizinhos entrem em contato direto pelo Resolve
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showWhatsappPublic}
                    onChange={(e) => setConfig({ ...config, showWhatsappPublic: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* System Info & Reset */}
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2 text-sm">
                <div className="flex items-center justify-between text-[13px] text-zinc-500">
                  <span>Versão do Portal:</span>
                  <span className="font-bold text-zinc-800">Sobradinho Online v2.4</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-zinc-500">
                  <span>Armazenamento local:</span>
                  <span className="font-bold text-zinc-800">Ativo (localStorage)</span>
                </div>
                <div className="pt-2 border-t border-zinc-100 flex justify-end">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="text-[13px] font-semibold text-zinc-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Redefinir dados locais</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors uppercase tracking-wider"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
