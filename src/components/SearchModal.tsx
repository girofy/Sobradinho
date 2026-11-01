// [LAYOUT ARCHETYPE]: Global Search Modal & Instant List
// [RADIUS & BORDERS]: rounded-3xl container & rounded-2xl search bar
// [ACCENT LOGIC]: #2563EB (Royal Blue)

import React, { useState } from 'react';
import { Search, X, Users, Wrench, FileText } from 'lucide-react';
import type { FeedPost, PersonProfile, ServiceItem } from '../types/community';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: FeedPost[];
  services: ServiceItem[];
  people: PersonProfile[];
  onSelectPerson: (person: PersonProfile) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  services,
  people,
  onSelectPerson,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingPosts = q
    ? posts.filter((p) => p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q))
    : [];

  const matchingServices = q
    ? services.filter((s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.neighborhood.toLowerCase().includes(q))
    : [];

  const matchingPeople = q
    ? people.filter((p) => p.name.toLowerCase().includes(q) || p.talents.toLowerCase().includes(q) || p.neighborhood.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por morador, serviço, bairro ou assunto..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!q ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            Digite algo para buscar em toda a comunidade de Sobradinho.
          </div>
        ) : (
          <div className="space-y-4">
            {/* People */}
            {matchingPeople.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Moradores ({matchingPeople.length})
                </span>
                {matchingPeople.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => {
                      onSelectPerson(person);
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <strong className="text-xs font-bold text-slate-900">{person.name}</strong>
                      <span className="text-xs text-slate-500 block">@{person.handle} &bull; {person.neighborhood}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">Ver &rarr;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Services */}
            {matchingServices.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" /> Serviços ({matchingServices.length})
                </span>
                {matchingServices.map((service) => (
                  <div key={service.id} className="p-2.5 rounded-2xl bg-slate-50 text-xs">
                    <strong className="text-slate-900 block font-bold">{service.title}</strong>
                    <span className="text-slate-500">{service.providerName} &bull; {service.neighborhood}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Posts */}
            {matchingPosts.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Publicações ({matchingPosts.length})
                </span>
                {matchingPosts.map((post) => (
                  <div key={post.id} className="p-2.5 rounded-2xl bg-slate-50 text-xs">
                    <strong className="text-slate-900 block font-bold">{post.authorName} ({post.neighborhood})</strong>
                    <p className="text-slate-600 line-clamp-2 mt-0.5">{post.content}</p>
                  </div>
                ))}
              </div>
            )}

            {matchingPeople.length === 0 && matchingServices.length === 0 && matchingPosts.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhum resultado encontrado para "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
