import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'image-selections';

interface ImageSelections {
  [imageId: string]: number;
}

// Créer un événement personnalisé pour la synchronisation
const selectionChangeEvent = new EventTarget();
const SELECTION_CHANGE = 'selection-change';

export function useImageSelections() {
  const [selections, setSelections] = useState<ImageSelections>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  // Écouter les changements de sélection
  useEffect(() => {
    const handleChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelections(JSON.parse(stored));
      }
    };

    selectionChangeEvent.addEventListener(SELECTION_CHANGE, handleChange);
    return () => {
      selectionChangeEvent.removeEventListener(SELECTION_CHANGE, handleChange);
    };
  }, []);

  const setImageSelection = useCallback((imageId: string, version: number) => {
    const newSelections = {
      ...selections,
      [imageId]: version
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelections));
    setSelections(newSelections);
    // Notifier les autres instances du hook
    selectionChangeEvent.dispatchEvent(new Event(SELECTION_CHANGE));
  }, [selections]);

  const clearSelections = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSelections({});
    selectionChangeEvent.dispatchEvent(new Event(SELECTION_CHANGE));
  }, []);

  const getImageSelection = useCallback((imageId: string) => 
    selections[imageId] || 0
  , [selections]);

  return {
    setImageSelection,
    getImageSelection,
    clearSelections
  };
}