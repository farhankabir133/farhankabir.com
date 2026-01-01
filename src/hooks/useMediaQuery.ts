import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Older browsers support addListener
    if (typeof m.addEventListener === 'function') {
      m.addEventListener('change', handler as any);
      return () => m.removeEventListener('change', handler as any);
    }
    m.addListener(handler as any);
    return () => m.removeListener(handler as any);
  }, [query]);

  return matches;
}
