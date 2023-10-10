'use client';

import mermaid from 'mermaid';
import { useEffect } from 'react';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
});

/**
 * Initialize mermaid on client side only
 * @constructor
 */
export function ContentedMermaidInit() {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return <></>;
}
