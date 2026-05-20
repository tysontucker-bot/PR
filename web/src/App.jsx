import React, { useState } from 'react';
import Shell from './components/Layout/Shell.jsx';
import StudentList from './components/Students/StudentList.jsx';
import StudentForm from './components/Students/StudentForm.jsx';
import GoalList from './components/Goals/GoalList.jsx';
import WorkflowWizard from './components/Workflow/WorkflowWizard.jsx';
import CommentBank from './components/CommentBank/CommentBank.jsx';
import Modal from './components/Common/Modal.jsx';
import { useStudents } from './hooks/useStudents.js';
import { useCommentBank } from './hooks/useCommentBank.js';

export default function App() {
  const [view, setView] = useState('students');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [workflowGoalId, setWorkflowGoalId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  // Student creation modal
  const [newStudentModal, setNewStudentModal] = useState(false);

  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useStudents();

  const { phrases, addPhrase, updatePhrase, deletePhrase } = useCommentBank();

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  function navigate(v) {
    setView(v);
    if (v !== 'student-detail' && v !== 'workflow') {
      setSelectedStudentId(null);
      setWorkflowGoalId(null);
    }
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || null;
  const workflowGoal =
    selectedStudent?.goals?.find((g) => g.id === workflowGoalId) || null;

  function handleSelectStudent(id) {
    setSelectedStudentId(id);
    setView('student-detail');
  }

  function handleStartWorkflowFromList(studentId) {
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.goals?.length) return;
    setSelectedStudentId(studentId);
    if (student.goals.length === 1) {
      setWorkflowGoalId(student.goals[0].id);
      setView('workflow');
    } else {
      setView('student-detail');
    }
  }

  function handleStartWorkflow(studentId, goalId) {
    setSelectedStudentId(studentId);
    setWorkflowGoalId(goalId);
    setView('workflow');
  }

  function handleNewStudent(data) {
    addStudent(data);
    setNewStudentModal(false);
  }

  function handleUpdateStudent(data) {
    if (selectedStudentId) updateStudent(selectedStudentId, data);
  }

  function renderContent() {
    switch (view) {
      case 'students':
        return (
          <>
            <StudentList
              students={students}
              onSelect={handleSelectStudent}
              onNew={() => setNewStudentModal(true)}
              onStartWorkflow={handleStartWorkflowFromList}
            />
            <Modal
              isOpen={newStudentModal}
              onClose={() => setNewStudentModal(false)}
              title="New Student"
            >
              <StudentForm
                onSave={handleNewStudent}
                onCancel={() => setNewStudentModal(false)}
              />
            </Modal>
          </>
        );

      case 'student-detail': {
        if (!selectedStudent) {
          navigate('students');
          return null;
        }
        return (
          <div className="page">
            <div className="page-header">
              <div>
                <button
                  className="btn btn-ghost back-btn"
                  onClick={() => navigate('students')}
                >
                  ← Back
                </button>
                <h1 className="page-title">{selectedStudent.name}</h1>
                <p className="text-muted">{selectedStudent.pronouns}</p>
              </div>
              <button
                className="btn btn-ghost btn-danger"
                onClick={() => {
                  if (window.confirm(`Delete student "${selectedStudent.name}"?`)) {
                    deleteStudent(selectedStudentId);
                    navigate('students');
                  }
                }}
              >
                Delete Student
              </button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>
                Student Info
              </h2>
              <StudentForm
                student={selectedStudent}
                onSave={handleUpdateStudent}
                onCancel={() => {}}
              />
            </div>

            <GoalList
              student={selectedStudent}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
              onStartWorkflow={handleStartWorkflow}
            />
          </div>
        );
      }

      case 'workflow': {
        if (!selectedStudent || !workflowGoal) {
          navigate('students');
          return null;
        }
        return (
          <WorkflowWizard
            student={selectedStudent}
            goal={workflowGoal}
            onBack={() => {
              setView('student-detail');
              setWorkflowGoalId(null);
            }}
            onSavePhrase={addPhrase}
            commentBankPhrases={phrases}
          />
        );
      }

      case 'comment-bank':
        return (
          <CommentBank
            phrases={phrases}
            onAdd={addPhrase}
            onUpdate={updatePhrase}
            onDelete={deletePhrase}
          />
        );

      default:
        return null;
    }
  }

  return (
    <Shell
      view={view}
      onNavigate={navigate}
      darkMode={darkMode}
      onToggleDark={toggleDark}
    >
      {renderContent()}
    </Shell>
  );
}
