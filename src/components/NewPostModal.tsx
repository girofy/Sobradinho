// [LAYOUT ARCHETYPE]: Instagram Single-Stage Media Composer
// [RADIUS & BORDERS]: rounded-2xl (4px) containers, rounded-xl (2px) inputs, border border-zinc-100
// [ACCENT LOGIC]: #2563EB (Royal Blue)

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, MapPin, X, Trash2, Check } from 'lucide-react';
import type { FeedPost } from '../types/community';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<FeedPost, 'id' | 'timeAgo' | 'likesCount' | 'commentsCount' | 'comments' | 'isLiked' | 'isSaved'>) => void;
  defaultAuthorName: string;
}

const NEIGHBORHOODS = [
  'Vila São Joaquim',
  'Centro',
  'Balneário Chico Periperi',
  'Vila São Francisco',
  'Portelinha',
  'Barragem / CHESF',
  'Quadra 1',
  'Quadra 2',
  'Quadra 3',
  'Quadra 4',
  'Santana',
  'Lá na praça',
];

const QUICK_PHOTOS = [
  { label: 'Lago', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Barragem CHESF', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Balneário', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Feira Livre', url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pôr do Sol', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
];

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultAuthorName,
}) => {
  const [content, setContent] = useState('');
  const [neighborhood, setNeighborhood] = useState('Vila São Joaquim');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !imageUrl) {
      setError('Adicione uma foto ou escreva uma mensagem.');
      return;
    }

    const cleanAuthor = defaultAuthorName.trim() || 'Cidadão de Sobradinho';
    const cleanHandle = cleanAuthor.toLowerCase().replace(/\s+/g, '');

    onSubmit({
      authorName: cleanAuthor,
      authorHandle: cleanHandle,
      neighborhood,
      content: content.trim() || '📸 Registro de Sobradinho',
      imageUrl: imageUrl.trim() || undefined,
      category: 'geral',
    });

    setContent('');
    setImageUrl('');
    setError('');
    setShowLocationPicker(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-none animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-300 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Instagram-style Top Header */}
        <div className="h-12 border-b border-zinc-100 px-3.5 flex items-center justify-between bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-black rounded-xl transition-colors"
            title="Cancelar"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[15px] font-bold text-zinc-900 tracking-tight">Nova publicação</span>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors uppercase tracking-wider"
          >
            Compartilhar
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 text-sm border-b border-red-200 font-medium">
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-3.5 space-y-3.5">
          {/* Media Stage: Instagram Style */}
          <div className="border border-zinc-100 rounded-xl bg-zinc-100 overflow-hidden relative">
            {imageUrl ? (
              <div className="relative aspect-square sm:aspect-[4/3] bg-black flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Pré-visualização da publicação"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-xl transition-colors"
                  title="Remover foto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-white border border-zinc-300 rounded-xl flex items-center justify-center text-zinc-500">
                  <Camera className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">Selecione uma foto da cidade</p>
                  <p className="text-[13px] text-zinc-500">Envie do seu celular ou escolha um ponto turístico</p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-zinc-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Galeria / Câmera</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Instant Preset Captures */}
                <div className="pt-2 border-t border-zinc-200/80">
                  <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider block mb-1.5">
                    Fotos rápidas de Sobradinho
                  </span>
                  <div className="flex flex-wrap justify-center gap-1">
                    {QUICK_PHOTOS.map((qp) => (
                      <button
                        key={qp.label}
                        type="button"
                        onClick={() => setImageUrl(qp.url)}
                        className="px-2 py-2 text-[13px] font-medium bg-white border border-zinc-300 text-zinc-700 hover:border-blue-600 rounded-xl transition-colors"
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caption Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {defaultAuthorName.charAt(0).toUpperCase() || 'C'}
                </span>
                <span>{defaultAuthorName || 'Cidadão'}</span>
              </span>
              <span className=" text-[13px]">{content.length}/500</span>
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              placeholder="Escreva uma legenda... use #sobradinho"
              className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-none font-sans"
            />
          </div>

          {/* Neighborhood Location Tag */}
          <div className="border border-zinc-100 rounded-xl p-3.5 bg-zinc-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-zinc-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Localização:</span>
                <span className="font-medium text-zinc-900">{neighborhood}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="text-[13px] font-bold text-blue-600 hover:text-blue-700"
              >
                {showLocationPicker ? 'Fechar' : 'Alterar'}
              </button>
            </div>

            {showLocationPicker && (
              <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                {NEIGHBORHOODS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setNeighborhood(n);
                      setShowLocationPicker(false);
                    }}
                    className={`text-left px-2 py-2 text-[13px] rounded-xl transition-colors flex items-center justify-between ${
                      neighborhood === n
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-white border border-zinc-100 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="truncate">{n}</span>
                    {neighborhood === n && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar Action */}
        <div className="p-4 border-t border-zinc-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl transition-colors"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all uppercase tracking-wider"
          >
            Publicar agora
          </button>
        </div>
      </div>
    </div>
  );
};
