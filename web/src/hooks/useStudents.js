import { useState, useCallback } from 'react';
import { loadStudents, saveStudents, generateId } from '../utils/storage.js';

/**
 * Hook for managing the students array with full CRUD and goal management.
 */
export function useStudents() {
  const [students, setStudents] = useState(() => loadStudents());

  const persist = useCallback((updated) => {
    setStudents(updated);
    saveStudents(updated);
  }, []);

  const addStudent = useCallback(
    (data) => {
      const student = { ...data, id: generateId(), goals: [] };
      persist([...students, student]);
      return student;
    },
    [students, persist]
  );

  const updateStudent = useCallback(
    (id, data) => {
      const updated = students.map((s) => (s.id === id ? { ...s, ...data } : s));
      persist(updated);
    },
    [students, persist]
  );

  const deleteStudent = useCallback(
    (id) => {
      persist(students.filter((s) => s.id !== id));
    },
    [students, persist]
  );

  const addGoal = useCallback(
    (studentId, goalData) => {
      const goal = { ...goalData, id: generateId() };
      const updated = students.map((s) =>
        s.id === studentId ? { ...s, goals: [...(s.goals || []), goal] } : s
      );
      persist(updated);
      return goal;
    },
    [students, persist]
  );

  const updateGoal = useCallback(
    (studentId, goalId, data) => {
      const updated = students.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          goals: s.goals.map((g) => (g.id === goalId ? { ...g, ...data } : g)),
        };
      });
      persist(updated);
    },
    [students, persist]
  );

  const deleteGoal = useCallback(
    (studentId, goalId) => {
      const updated = students.map((s) => {
        if (s.id !== studentId) return s;
        return { ...s, goals: s.goals.filter((g) => g.id !== goalId) };
      });
      persist(updated);
    },
    [students, persist]
  );

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
