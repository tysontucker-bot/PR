import React from 'react';
import EmptyState from '../Common/EmptyState.jsx';

export default function StudentList({ students, onSelect, onNew, onStartWorkflow }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <button className="btn btn-primary" onClick={onNew}>
          + New Student
        </button>
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon="👥"
          message="No students yet. Add your first student to get started."
          actionLabel="+ New Student"
          onAction={onNew}
        />
      ) : (
        <div className="card-grid">
          {students.map((student) => (
            <div key={student.id} className="student-card card">
              <div className="student-card-body" onClick={() => onSelect(student.id)}>
                <h2 className="student-name">{student.name}</h2>
                <p className="student-pronouns text-muted">{student.pronouns}</p>
                <p className="student-goals text-muted">
                  {student.goals?.length ?? 0} goal
                  {(student.goals?.length ?? 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="student-card-footer">
                <button
                  className="btn btn-ghost"
                  onClick={() => onSelect(student.id)}
                >
                  View / Edit
                </button>
                {student.goals?.length > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => onStartWorkflow(student.id)}
                  >
                    Start Report →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
