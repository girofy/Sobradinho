import { useState, useEffect } from 'react';
import type { ServiceItem } from '../types';
import { INITIAL_SERVICES } from '../../../data/seed-data';
import { filterServicesByCategory } from '../../../lib/community-logic';
import { useHaptics } from '../../../hooks/useHaptics';

export function useServices() {
  const { triggerHaptic } = useHaptics();
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('sobradinho_services_v2');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('sobradinho_services_v2', JSON.stringify(services));
    } catch {}
  }, [services]);

  const displayedServices = filterServicesByCategory(services, activeCategory, searchQuery);

  const handleSelectCategory = (cat: string) => {
    triggerHaptic('selection');
    setActiveCategory(cat);
  };

  const handleContactProvider = (service: ServiceItem) => {
    triggerHaptic('medium');
    const text = encodeURIComponent(
      `Olá ${service.providerName}, vi seu anúncio no Sobradinho Online (${service.title}) e gostaria de mais informações!`
    );
    window.open(`https://wa.me/55${service.contactNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return {
    services,
    displayedServices,
    activeCategory,
    handleSelectCategory,
    searchQuery,
    setSearchQuery,
    handleContactProvider,
  };
}
