import React, { useState, useEffect } from 'react';
import { generateNarrative } from '../../utils/generator.js';
import { saveDraft, loadDraft } from '../../utils/storage.js';
import NarrativeOutput from './NarrativeOutput.jsx';

const QUESTIONS = [
  {
    key: 'currentPerformance',
    label: 'Current performance',
    prompt: "Describe the student's current performance level for this goal.",
    type: 'textarea',
    required: true,
  },
  {
    key: 'progressSinceLast',
    label: 'Progress since last period',
    prompt: 'What progress has been made since the last reporting period?',
    type: 'textarea',
    required: true,
  },
  {
    key: 'supportsAccommodations',
    label: 'Supports & accommodations',
    prompt: 'What supports or accommodations were used?',
    type: 'textarea',
    required: true,
  },
  {
    key: 'promptingLevel',
    label: 'Level of prompting',
    prompt: 'What level of prompting was required?',
    type: 'select',
    required: true,
    options: [
      'Independent (0% prompting)',
      'Minimal prompting (1–25%)',
      'Moderate prompting (26–50%)',
      'Substantial prompting (51–75%)',
      'Maximum prompting (76–100%)',
    ],
  },
  {
    key: 'accuracyPercentage',
    label: 'Accuracy / percentage',
    prompt: 'Accuracy or percentage (e.g., 80% across 3 of 4 trials)',
    type: 'text',
    required: false,
  },
  {
    key: 'behavioralConcerns',
    label: 'Behavioral concerns',
    prompt: 'Any behavioral concerns affecting progress? (leave blank if none)',
    type: 'textarea',
    required: false,
  },
  {
    key: 'nextSteps',
    label: 'Next instructional steps',
    prompt: 'What are the next instructional steps?',
    type: 'textarea',
    required: true,
  },
];

export default function WorkflowWizard({
  student,
  goal,
  onBack,
  onSavePhrase,
  commentBankPhrases,
}) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState(() => {
    const draft = loadDraft();
    if (draft && draft.studentId === student.id && draft.goalId === goal.id) {
      return draft.responses || {};
    }
    return {};
  });
  const [error, setError] = useState('');
  const [narrative, setNarrative] = useState('');
  const [mode, setMode] = useState('professional');
  const [done, setDone] = useState(false);

  // Auto-save draft on each step/response change
  useEffect(() => {
    saveDraft({ studentId: student.id, goalId: goal.id, step, responses });
  }, [step, responses, student.id, goal.id]);

  const question = QUESTIONS[step];

  function handleChange(value) {
    setResponses((prev) => ({ ...prev, [question.key]: value }));
    setError('');
  }

  function handleNext() {
    if (question.required && !responses[question.key]?.trim()) {
      setError('This field is required.');
      return;
    }
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Final step — generate narrative
      const text = generateNarrative(student, goal, responses, mode);
      setNarrative(text);
      setDone(true);
      saveDraft(null); // clear draft
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    if (done) {
      setNarrative(generateNarrative(student, goal, responses, newMode));
    }
  }

  if (done) {
    return (
      <NarrativeOutput
        narrative={narrative}
        onNarrativeChange={setNarrative}
        mode={mode}
        onModeChange={handleModeChange}
        student={student}
        goal={goal}
        onBack={onBack}
        onSavePhrase={onSavePhrase}
        commentBankPhrases={commentBankPhrases}
      />
    );
  }

  function getDefaultValue(q) {
    return q.type === 'select' ? q.options[0] : '';
  }
  const currentValue = responses[question.key] ?? getDefaultValue(question);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{student.name}</h1>
          <p className="text-muted">Goal: {goal.name}</p>
        </div>
      </div>

      <div className="wizard-progress">
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="wizard-step-label">
          Step {step + 1} of {QUESTIONS.length}: {question.label}
        </p>
      </div>

      <div className="card wizard-card">
        <p className="wizard-prompt">{question.prompt}</p>
        {question.required && (
          <span className="required-note">* Required</span>
        )}

        {question.type === 'textarea' && (
          <textarea
            className="form-input form-textarea wizard-textarea"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            autoFocus
          />
        )}
        {question.type === 'text' && (
          <input
            className="form-input"
            type="text"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.prompt}
            autoFocus
          />
        )}
        {question.type === 'select' && (
          <select
            className="form-input"
            value={currentValue || question.options[0]}
            onChange={(e) => handleChange(e.target.value)}
          >
            {question.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {error && <p className="form-error">{error}</p>}
      </div>

      <div className="wizard-actions">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          {step === QUESTIONS.length - 1 ? 'Generate Report ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
