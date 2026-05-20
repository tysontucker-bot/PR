import React, { useState } from 'react';

const AREA_OPTIONS = [
  'Reading', 'Writing', 'Math', 'Communication', 'Behavior',
  'Social Skills', 'Adaptive Skills', 'Motor Skills', 'Other',
];

export default function GoalForm({ goal, onSave, onCancel }) {
  const [name, setName] = useState(goal?.name ?? '');
  const [area, setArea] = useState(goal?.area ?? AREA_OPTIONS[0]);
  const [description, setDescription] = useState(goal?.description ?? '');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Goal name is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({ name: name.trim(), area, description: description.trim() });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="goal-name">
          Goal name <span className="required">*</span>
        </label>
        <input
          id="goal-name"
          className={`form-input${errors.name ? ' form-input--error' : ''}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Increase sight word recognition"
          autoFocus
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="goal-area">
          Area
        </label>
        <select
          id="goal-area"
          className="form-input"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          {AREA_OPTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="goal-description">
          Description
        </label>
        <textarea
          id="goal-description"
          className="form-input form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the goal or IEP objective"
          rows={3}
        />
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
