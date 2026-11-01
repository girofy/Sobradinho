// [LAYOUT ARCHETYPE]: Classifieds Marketplace Ad Composer
// [RADIUS & BORDERS]: rounded (4px) modal container, rounded-sm (2px) inputs/buttons, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #059669 (Emerald Green for WhatsApp/Prices)

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, MapPin, X, Trash2, Check, Tag, Phone } from 'lucide-react';
import type { ClassifiedCategory, ClassifiedItem } from '../../types/community';

interface NewClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ad: Omit<ClassifiedItem, 'id' | 'timeAgo' | 'status'>) => void;
  defaultSellerName: string;
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
  'Grande Colorado',
];

const PRESET_PHOTOS = [
  { label: 'Sofá / Móvel', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Imóvel / Quarto', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bicicleta / Bike', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Carro / Moto', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
  { label: 'Eletrônico', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80' },
];

export const NewClassifiedModal: React.FC<NewClassifiedModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultSellerName,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'desapego' | 'imoveis' | 'veiculos' | 'servicos' | 'empregos'>('desapego');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [description, setDescription] = useState('');
  const [sellerWhatsApp, setSellerWhatsApp] = useState('(74) 99999-0001');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
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
    if (!title.trim()) {
      setError('Informe o título do item ou serviço.');
      return;
    }
    if (!price.trim()) {
      setError('Informe o valor (ou "A combinar" / "Grátis").');
      return;
    }
    if (!description.trim()) {
      setError('Adicione uma breve descrição para os compradores.');
      return;
    }

    const cleanImg = imageUrl.trim() || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

    onSubmit({
      title: title.trim(),
      price: price.trim().startsWith('R$') ? price.trim() : `R$ ${price.trim()}`,
      category,
      neighborhood,
      description: description.trim(),
      sellerName: defaultSellerName.trim() || 'Morador de Sobradinho',
      sellerWhatsApp: sellerWhatsApp.replace(/\D/g, '') || '74999990001',
      imageUrl: cleanImg,
      featured: false,
    });

    setTitle('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-none animate-fade-in">
      <div className="w-full max-w-md bg-white rounded border border-zinc-300 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="h-12 border-b border-zinc-200 px-3.5 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-zinc-900 tracking-tight">Criar Anúncio no Classificados</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-sm transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-600 text-xs border-b border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 p-3.5 space-y-3">
          {/* Photo Stage */}
          <div className="border border-zinc-200 rounded-sm bg-zinc-100 overflow-hidden relative">
            {imageUrl ? (
              <div className="relative aspect-[16/9] bg-black flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Pré-visualização do anúncio"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-sm transition-colors"
                  title="Remover foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-white border border-zinc-300 rounded-sm flex items-center justify-center text-zinc-500">
                  <Camera className="w-5 h-5 stroke-[1.5]" />
                </div>
                <p className="text-xs font-semibold text-zinc-800">Foto do produto ou anúncio</p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Escolher foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Instant Presets */}
                <div className="pt-2 border-t border-zinc-200/80">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Fotos de exemplo rápido
                  </span>
                  <div className="flex flex-wrap justify-center gap-1">
                    {PRESET_PHOTOS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className="px-2 py-0.5 text-[10px] font-medium bg-white border border-zinc-300 text-zinc-700 hover:border-blue-600 rounded-sm"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title & Price Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Título do item</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Bicicleta Caloi Aro 29"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Valor (R$)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 450"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          {/* Category & Neighborhood Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              >
                <option value="desapego">Desapego / Usados</option>
                <option value="imoveis">Imóveis / Aluguel</option>
                <option value="veiculos">Automóveis & Motos</option>
                <option value="empregos">Vagas & Empregos</option>
                <option value="servicos">Serviços Locais</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Bairro / Quadra</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">Descrição e detalhes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o estado do item, forma de retirada ou entrega..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm p-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none font-sans"
            />
          </div>

          {/* WhatsApp Contact */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp para contato direto</span>
            </label>
            <input
              type="text"
              value={sellerWhatsApp}
              onChange={(e) => setSellerWhatsApp(e.target.value)}
              placeholder="(74) 99999-0000"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-zinc-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm shadow-sm transition-all uppercase tracking-wider"
          >
            Publicar Anúncio
          </button>
        </div>
      </div>
    </div>
  );
};
