import { useState, useCallback } from 'react';
import { loadCommentBank, saveCommentBank, generateId } from '../utils/storage.js';

/**
 * Hook for managing the comment bank (reusable phrases).
 */
export function useCommentBank() {
  const [phrases, setPhrases] = useState(() => loadCommentBank());

  const persist = useCallback((updated) => {
    setPhrases(updated);
    saveCommentBank(updated);
  }, []);

  const addPhrase = useCallback(
    (data) => {
      const phrase = { ...data, id: generateId() };
      persist([...phrases, phrase]);
      return phrase;
    },
    [phrases, persist]
  );

  const updatePhrase = useCallback(
    (id, data) => {
      persist(phrases.map((p) => (p.id === id ? { ...p, ...data } : p)));
    },
    [phrases, persist]
  );

  const deletePhrase = useCallback(
    (id) => {
      persist(phrases.filter((p) => p.id !== id));
    },
    [phrases, persist]
  );

  return { phrases, addPhrase, updatePhrase, deletePhrase };
}
