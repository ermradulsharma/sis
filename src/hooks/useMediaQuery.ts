'use client';

import { useState, useEffect } from 'react';

/**
 * Hook for responsive breakpoint detection.
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns Whether the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        // eslint-disable-next-line
        setMatches(media.matches);

        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/** Convenience hooks for common breakpoints. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
