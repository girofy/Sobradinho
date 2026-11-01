/**
 * Hook for simulating mobile haptic feedback via Navigator.vibrate API.
 * Provides distinct intensities for touch interactions (light, medium, success).
 */
export function useHaptics() {
  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'selection' = 'light') => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
      return;
    }

    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'selection':
          navigator.vibrate(8);
          break;
        case 'success':
          navigator.vibrate([15, 40, 20]);
          break;
      }
    } catch {
      // Haptics not allowed or supported by environment
    }
  };

  return { triggerHaptic };
}
