import { useState, useEffect } from 'react';

const breakpoints = {
  sm: '40em', // 640px
  md: '48em', // 768px
  lg: '64em', // 1024px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
} as const;

type BreakpointKey = keyof typeof breakpoints;

// changes state depending on whether the screen is at least large enough for
// the specified breakpoint
export default function useMinBreakpoint(
  breakpointKey: BreakpointKey,
): boolean {
  const query = `(min-width: ${breakpoints[breakpointKey]})`;
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Initial check
    setMatches(media.matches);

    function listener(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    media.addEventListener('change', listener);

    return function cleanup() {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
