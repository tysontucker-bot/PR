import React, { useState } from 'react';
import Modal from '../Common/Modal.jsx';
import PhraseForm from './PhraseForm.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { copyToClipboard } from '../../utils/export.js';

const CATEGORY_TABS = ['all', 'behavior', 'communication', 'academics', 'adaptive', 'social'];

export default function CommentBank({ phrases, onAdd, onUpdate, onDelete }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState({});

  const filtered =
    activeCategory === 'all'
      ? phrases
      : phrases.filter((p) => p.category === activeCategory);

  async function handleCopy(phrase) {
    try {
      await copyToClipboard(phrase.text);
      setCopyFeedback((prev) => ({ ...prev, [phrase.id]: 'Copied!' }));
      setTimeout(
        () => setCopyFeedback((prev) => ({ ...prev, [phrase.id]: '' })),
        2000
      );
    } catch {
      setCopyFeedback((prev) => ({ ...prev, [phrase.id]: 'Failed' }));
      setTimeout(
        () => setCopyFeedback((prev) => ({ ...prev, [phrase.id]: '' })),
        2000
      );
    }
  }

  function handleSave(data) {
    if (editingPhrase) {
      onUpdate(editingPhrase.id, data);
    } else {
      onAdd(data);
    }
    setModalOpen(false);
    setEditingPhrase(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Comment Bank</h1>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingPhrase(null); setModalOpen(true); }}
        >
          + Add Phrase
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="category-tabs">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            className={`tab-btn${activeCategory === cat ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📝"
          message={
            activeCategory === 'all'
              ? 'No phrases yet. Add reusable phrases to your comment bank.'
              : `No phrases in "${activeCategory}".`
          }
          actionLabel={activeCategory === 'all' ? '+ Add Phrase' : undefined}
          onAction={
            activeCategory === 'all'
              ? () => { setEditingPhrase(null); setModalOpen(true); }
              : undefined
          }
        />
      ) : (
        <ul className="phrase-list">
          {filtered.map((phrase) => (
            <li key={phrase.id} className="phrase-item card">
              <div className="phrase-item-body">
                <p className="phrase-text">{phrase.text}</p>
                <span className={`badge badge--${phrase.category}`}>
                  {phrase.category}
                </span>
              </div>
              <div className="phrase-item-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => handleCopy(phrase)}
                >
                  {copyFeedback[phrase.id] || '📋 Copy'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setEditingPhrase(phrase); setModalOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-ghost btn-danger"
                  onClick={() => {
                    if (window.confirm('Delete this phrase?')) onDelete(phrase.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPhrase(null); }}
        title={editingPhrase ? 'Edit Phrase' : 'Add Phrase'}
      >
        <PhraseForm
          phrase={editingPhrase}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingPhrase(null); }}
        />
      </Modal>
    </div>
  );
}
