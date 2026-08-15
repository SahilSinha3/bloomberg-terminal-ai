'use client';

import { useEffect, useRef } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';

export function useTerminalKeyboardShortcuts() {
  const { setActivePanel, setCommandPaletteOpen, commandPaletteOpen } = useTerminalStore();
  const sequenceRef = useRef<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      const key = e.key.toLowerCase();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      sequenceRef.current += key;

      if (sequenceRef.current.startsWith('g')) {
        if (sequenceRef.current === 'gc') {
          e.preventDefault();
          setActivePanel('CHART');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'gf') {
          e.preventDefault();
          setActivePanel('FINANCIALS');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'gr') {
          e.preventDefault();
          setActivePanel('FILINGS');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'ga') {
          e.preventDefault();
          setActivePanel('RESEARCH');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'gn') {
          e.preventDefault();
          setActivePanel('NEWS');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'gv') {
          e.preventDefault();
          setActivePanel('VESSELS');
          sequenceRef.current = '';
          return;
        }
        if (sequenceRef.current === 'gj') {
          e.preventDefault();
          setActivePanel('FLIGHTS');
          sequenceRef.current = '';
          return;
        }
      } else {
        sequenceRef.current = '';
      }

      timerRef.current = setTimeout(() => {
        sequenceRef.current = '';
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [setActivePanel, setCommandPaletteOpen, commandPaletteOpen]);
}
