# Special Education Progress Report Assistant

Local-only, teacher-friendly assistant for drafting special education progress report comments.

## MVP Features

- One reporting session at a time, with multiple goals per student
- Guided command-line prompts with progress labels (Goal X of Y)
- Fixed structured prompts per goal:
  - current performance
  - progress since last period
  - supports/accommodations used
  - evidence/examples
  - barriers/challenges
  - next instructional steps
- Local template-based comment generation from teacher answers only
- Per-goal review step with:
  - accept
  - edit
  - regenerate (different detail style)
- Final review before save
- Export to:
  - `.csv` (spreadsheet-ready)
  - `.txt` (simple document)

## Run Locally

Requirements:
- Python 3.10+ (standard library only; no external dependencies)

From repository root:

```bash
python app.py
```

## Output Files

Saved in a local `outputs/` folder:
- `<student>__<reporting-period>__<YYYYMMDD_HHMMSS>.csv`
- `<student>__<reporting-period>__<YYYYMMDD_HHMMSS>.txt`

The app asks for confirmation before writing files.

## Privacy & Offline Safeguards

- No websites, cloud APIs, or external systems are used.
- The app disables socket-based network access at startup.
- All data is entered and stored locally on the teacher device.
- To delete local data, remove files in `outputs/`.

## Project Structure

```text
app.py
assistant/
  models.py      # Session and goal data
  prompts.py     # Guided teacher prompts + light validation
  generator.py   # Template-driven comment generation
  review.py      # Per-goal and final review/edit flow
  export.py      # CSV and TXT export
  offline.py     # Network-block safeguard
templates/
  progress_comment.txt
outputs/         # Created when files are exported
```

## Phased Rollout

- Phase 1 (implemented): CLI + local generation + review/edit + CSV/TXT export
- Phase 2 (future): lightweight desktop UI using same core modules
- Phase 3 (future): customizable district wording and reusable prompt sets
