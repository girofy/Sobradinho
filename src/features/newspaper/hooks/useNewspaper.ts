import { useState } from 'react';
import type { NewspaperData } from '../types';
import { INITIAL_NEWSPAPER } from '../../../data/seed-data';
import { useHaptics } from '../../../hooks/useHaptics';

export function useNewspaper() {
  const { triggerHaptic } = useHaptics();
  const [newspaper] = useState<NewspaperData>(INITIAL_NEWSPAPER);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleShareNewspaper = () => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(
      `Jornal Sobradinho: ${newspaper.headline}\nhttps://sobradinho.girofy.site/`
    );
  };

  return {
    newspaper,
    selectedStoryId,
    setSelectedStoryId,
    handleShareNewspaper,
  };
}
