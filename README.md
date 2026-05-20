# Special Education Progress Report Assistant (Planning)

This repository currently contains the planning blueprint for a **local-only, interactive assistant** to help teachers draft special education progress report comments.

## Goals

The assistant should:
- Ask structured questions for each student goal
- Generate professional comments based **only** on teacher-provided answers
- Avoid websites, cloud APIs, and external student information systems
- Run locally on a teacher computer
- Let teachers review and edit text before saving
- Export final comments to a simple document or spreadsheet format

## Recommended First Implementation

Build a small **Python command-line app** with a guided, form-like flow.

Why this approach:
- Very low setup burden
- Easy to run offline (`python app.py`)
- Friendly step-by-step prompts
- Can add a simple desktop UI later without changing core logic

## Proposed User Flow (Teacher-Friendly)

1. **Start session**
   - Prompt for student name/ID and reporting period
2. **Enter goals**
   - One goal at a time, repeating until complete
3. **Answer structured prompts per goal**
   - Baseline/current performance
   - Progress summary
   - Supports/accommodations used
   - Evidence/examples observed
   - Barriers/challenges
   - Next instructional steps
4. **Generate draft comment**
   - Use a local template engine/rule-based formatter (no external data)
5. **Review & edit**
   - Show generated comment
   - Offer edit/retry/accept options
6. **Export**
   - Save all accepted comments to:
     - `.csv` (spreadsheet-friendly)
     - `.txt` or `.docx` (document-friendly)

## Interface Design Notes

Keep prompts short and plain-language:
- One question per screen/line
- Clear progress indicator: “Goal 2 of 5”
- Default options where possible (Yes/No, rating scales)
- Confirmations before overwrite/save

## Data & Privacy Guardrails

- All data stays local in files on the teacher device
- No network calls in generation logic
- Include an “offline mode” check that fails fast if any network-backed feature is accidentally added later

## Suggested Project Structure (when coding begins)

```text
app.py
assistant/
  prompts.py          # Question sets and validation
  models.py           # Student/goal data objects
  generator.py        # Comment generation from answers only
  review.py           # Edit/accept flow
  export.py           # CSV/TXT/DOCX export helpers
templates/
  progress_comment.txt
```

## Acceptance Criteria for Future Code Work

- Teacher can complete at least one student with multiple goals in one run
- Each goal yields a generated draft tied to entered answers
- Teacher can edit before final save
- Export produces valid CSV and TXT/DOCX outputs
- App works with internet disabled
