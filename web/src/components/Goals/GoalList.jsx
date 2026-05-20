import React, { useState } from 'react';
import Modal from '../Common/Modal.jsx';
import GoalForm from './GoalForm.jsx';
import EmptyState from '../Common/EmptyState.jsx';

export default function GoalList({ student, onAddGoal, onUpdateGoal, onDeleteGoal, onStartWorkflow }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  function handleSave(data) {
    if (editingGoal) {
      onUpdateGoal(student.id, editingGoal.id, data);
    } else {
      onAddGoal(student.id, data);
    }
    setModalOpen(false);
    setEditingGoal(null);
  }

  function openEdit(goal) {
    setEditingGoal(goal);
    setModalOpen(true);
  }

  function openNew() {
    setEditingGoal(null);
    setModalOpen(true);
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Goals</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + Add Goal
        </button>
      </div>

      {(!student.goals || student.goals.length === 0) ? (
        <EmptyState
          icon="🎯"
          message="No goals yet. Add a goal to begin writing reports."
          actionLabel="+ Add Goal"
          onAction={openNew}
        />
      ) : (
        <div className="goal-list">
          {student.goals.map((goal) => (
            <div key={goal.id} className="goal-card card">
              <div className="goal-card-body">
                <div className="goal-header">
                  <span className="goal-name">{goal.name}</span>
                  <span className="badge">{goal.area}</span>
                </div>
                {goal.description && (
                  <p className="goal-description text-muted">{goal.description}</p>
                )}
              </div>
              <div className="goal-card-footer">
                <button className="btn btn-ghost" onClick={() => openEdit(goal)}>
                  Edit
                </button>
                <button
                  className="btn btn-ghost btn-danger"
                  onClick={() => {
                    if (window.confirm(`Delete goal "${goal.name}"?`)) {
                      onDeleteGoal(student.id, goal.id);
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onStartWorkflow(student.id, goal.id)}
                >
                  Start Report →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingGoal(null); }}
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
      >
        <GoalForm
          goal={editingGoal}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingGoal(null); }}
        />
      </Modal>
    </div>
  );
}
