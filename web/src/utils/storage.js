const STUDENTS_KEY = 'sped_students';
const COMMENT_BANK_KEY = 'sped_comment_bank';
const DRAFT_KEY = 'sped_draft';

export function loadStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function loadCommentBank() {
  try {
    const raw = localStorage.getItem(COMMENT_BANK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCommentBank(phrases) {
  localStorage.setItem(COMMENT_BANK_KEY, JSON.stringify(phrases));
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft) {
  if (draft === null) {
    localStorage.removeItem(DRAFT_KEY);
  } else {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }
}

/**
 * Generates a unique ID using crypto.randomUUID when available,
 * falling back to a timestamp-based string.
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
