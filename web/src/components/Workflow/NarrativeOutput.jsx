import React, { useState } from 'react';
import { copyToClipboard, exportAsTxt, exportAsDocx } from '../../utils/export.js';

const CATEGORIES = ['behavior', 'communication', 'academics', 'adaptive', 'social'];

export default function NarrativeOutput({
  narrative,
  onNarrativeChange,
  mode,
  onModeChange,
  student,
  goal,
  onBack,
  onSavePhrase,
  commentBankPhrases = [],
}) {
  const [copyFeedback, setCopyFeedback] = useState('');
  const [insertCategory, setInsertCategory] = useState('');
  const [saveCategory, setSaveCategory] = useState('behavior');
  const [saveFeedback, setSaveFeedback] = useState('');

  async function handleCopy() {
    try {
      await copyToClipboard(narrative);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  }

  function handleInsertPhrase(phrase) {
    onNarrativeChange(narrative + ' ' + phrase.text);
    setInsertCategory('');
  }

  function handleSavePhrase() {
    const trimmed = narrative.trim();
    if (!trimmed) return;
    onSavePhrase({ text: trimmed, category: saveCategory });
    setSaveFeedback('Saved to comment bank!');
    setTimeout(() => setSaveFeedback(''), 2000);
  }

  const filteredPhrases = insertCategory
    ? commentBankPhrases.filter((p) => p.category === insertCategory)
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Generated Report</h1>
          <p className="text-muted">
            {student.name} — {goal.name}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Student
        </button>
      </div>

      {/* Mode toggle */}
      <div className="mode-toggle">
        <button
          className={`btn ${mode === 'professional' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onModeChange('professional')}
        >
          Professional
        </button>
        <button
          className={`btn ${mode === 'parent-friendly' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onModeChange('parent-friendly')}
        >
          Parent-Friendly
        </button>
      </div>

      {/* Narrative textarea */}
      <div className="form-group">
        <label className="form-label">Narrative (editable)</label>
        <textarea
          className="form-input form-textarea narrative-textarea"
          value={narrative}
          onChange={(e) => onNarrativeChange(e.target.value)}
          rows={8}
        />
      </div>

      {/* Export buttons */}
      <div className="export-row">
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copyFeedback || '📋 Copy'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => exportAsTxt(student.name, goal.name, narrative)}
        >
          ⬇ Download TXT
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => exportAsDocx(student.name, goal.name, narrative)}
        >
          ⬇ Download DOCX
        </button>
      </div>

      {/* Insert from comment bank */}
      <div className="comment-bank-insert card">
        <h3 className="section-title">Insert from Comment Bank</h3>
        <select
          className="form-input"
          value={insertCategory}
          onChange={(e) => setInsertCategory(e.target.value)}
        >
          <option value="">— Select category —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        {filteredPhrases.length > 0 && (
          <ul className="phrase-insert-list">
            {filteredPhrases.map((p) => (
              <li key={p.id} className="phrase-insert-item">
                <span>{p.text}</span>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleInsertPhrase(p)}
                >
                  Insert
                </button>
              </li>
            ))}
          </ul>
        )}
        {insertCategory && filteredPhrases.length === 0 && (
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            No phrases in this category.
          </p>
        )}
      </div>

      {/* Save to comment bank */}
      <div className="card save-phrase-row">
        <h3 className="section-title">Save Narrative to Comment Bank</h3>
        <div className="save-phrase-controls">
          <select
            className="form-input"
            value={saveCategory}
            onChange={(e) => setSaveCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleSavePhrase}>
            + Save to Comment Bank
          </button>
        </div>
        {saveFeedback && <p className="form-success">{saveFeedback}</p>}
      </div>
    </div>
  );
}
