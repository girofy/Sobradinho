import { useState, useEffect } from 'react';
import type { PersonProfile } from '../types';
import { INITIAL_PEOPLE } from '../../../data/seed-data';
import { useHaptics } from '../../../hooks/useHaptics';

export function usePeople() {
  const { triggerHaptic } = useHaptics();
  const [people, setPeople] = useState<PersonProfile[]>(() => {
    try {
      const saved = localStorage.getItem('sobradinho_people_v2');
      return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
    } catch {
      return INITIAL_PEOPLE;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sobradinho_people_v2', JSON.stringify(people));
    } catch {}
  }, [people]);

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

  const handleSelectPerson = (person: PersonProfile) => {
    triggerHaptic('selection');
    setSelectedPerson(person);
  };

  return {
    people,
    filteredPeople,
    searchQuery,
    setSearchQuery,
    selectedPerson,
    setSelectedPerson,
    handleSelectPerson,
  };
}
