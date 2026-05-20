import React, { useState } from 'react';

const CATEGORY_OPTIONS = ['behavior', 'communication', 'academics', 'adaptive', 'social'];

export default function PhraseForm({ phrase, onSave, onCancel }) {
  const [text, setText] = useState(phrase?.text ?? '');
  const [category, setCategory] = useState(phrase?.category ?? CATEGORY_OPTIONS[0]);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!text.trim()) errs.text = 'Phrase text is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({ text: text.trim(), category });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="phrase-text">
          Phrase <span className="required">*</span>
        </label>
        <textarea
          id="phrase-text"
          className={`form-input form-textarea${errors.text ? ' form-input--error' : ''}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a reusable phrase or comment"
          rows={4}
          autoFocus
        />
        {errors.text && <p className="form-error">{errors.text}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phrase-category">
          Category
        </label>
        <select
          id="phrase-category"
          className="form-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
