import React, { useState } from 'react';

const PRONOUN_OPTIONS = ['he/him', 'she/her', 'they/them', 'custom'];

export default function StudentForm({ student, onSave, onCancel }) {
  const [name, setName] = useState(student?.name ?? '');
  const [pronouns, setPronouns] = useState(() => {
    if (!student?.pronouns) return 'they/them';
    if (PRONOUN_OPTIONS.slice(0, 3).includes(student.pronouns)) return student.pronouns;
    return 'custom';
  });
  const [customPronouns, setCustomPronouns] = useState(() => {
    if (!student?.pronouns) return '';
    if (!PRONOUN_OPTIONS.slice(0, 3).includes(student.pronouns)) return student.pronouns;
    return '';
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (pronouns === 'custom' && !customPronouns.trim())
      errs.customPronouns = 'Please enter custom pronouns.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      name: name.trim(),
      pronouns: pronouns === 'custom' ? customPronouns.trim() : pronouns,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="student-name">
          Name <span className="required">*</span>
        </label>
        <input
          id="student-name"
          className={`form-input${errors.name ? ' form-input--error' : ''}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          autoFocus
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="student-pronouns">
          Pronouns
        </label>
        <select
          id="student-pronouns"
          className="form-input"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
        >
          <option value="he/him">he/him</option>
          <option value="she/her">she/her</option>
          <option value="they/them">they/them</option>
          <option value="custom">Custom…</option>
        </select>
      </div>

      {pronouns === 'custom' && (
        <div className="form-group">
          <label className="form-label" htmlFor="custom-pronouns">
            Custom pronouns <span className="required">*</span>
          </label>
          <input
            id="custom-pronouns"
            className={`form-input${errors.customPronouns ? ' form-input--error' : ''}`}
            type="text"
            value={customPronouns}
            onChange={(e) => setCustomPronouns(e.target.value)}
            placeholder="e.g. xe/xem"
          />
          {errors.customPronouns && (
            <p className="form-error">{errors.customPronouns}</p>
          )}
        </div>
      )}

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
