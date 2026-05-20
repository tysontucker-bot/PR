import csv
from datetime import datetime
from pathlib import Path

from assistant.exceptions import UserCancelled
from assistant.models import SessionData

DEFAULT_FILENAME = "report"


def _safe_char(char: str) -> str:
    if char.isalnum() or char in {"-", "_"}:
        return char
    return "_"


def _safe_name(value: str) -> str:
    """Convert user text to a stable filename segment, trimming edge underscores for readability."""
    keep = [_safe_char(char) for char in value.strip().replace(" ", "_")]
    return "".join(keep).strip("_") or DEFAULT_FILENAME


def _output_paths(session: SessionData) -> tuple[Path, Path]:
    output_dir = Path.cwd() / "outputs"
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    student = _safe_name(session.student_name)
    period = _safe_name(session.reporting_period)
    base_name = f"{student}__{period}__{stamp}"
    return output_dir / f"{base_name}.csv", output_dir / f"{base_name}.txt"


def export_session(session: SessionData) -> None:
    csv_path, txt_path = _output_paths(session)
    while True:
        confirm = input(f"\nSave files to:\n- {csv_path}\n- {txt_path}\nProceed? [y/n]: ").strip().lower()
        if confirm == "y":
            break
        if confirm == "n":
            raise UserCancelled("Session ended without saving.")
        print("Please enter y or n.")

    csv_path.parent.mkdir(parents=True, exist_ok=True)

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "student_name",
                "student_id",
                "reporting_period",
                "goal_name",
                "final_comment",
            ],
        )
        writer.writeheader()
        for goal in session.goals:
            writer.writerow(
                {
                    "student_name": session.student_name,
                    "student_id": session.student_id,
                    "reporting_period": session.reporting_period,
                    "goal_name": goal.goal_name,
                    "final_comment": goal.final_comment,
                }
            )

    with txt_path.open("w", encoding="utf-8") as handle:
        handle.write("Special Education Progress Report Comments\n")
        handle.write(f"Student: {session.student_name} ({session.student_id})\n")
        handle.write(f"Reporting period: {session.reporting_period}\n")
        handle.write(f"Created: {session.created_at}\n")
        for idx, goal in enumerate(session.goals, start=1):
            handle.write(f"\nGoal {idx}: {goal.goal_name}\n")
            handle.write(f"{goal.final_comment}\n")

    print(f"\nSaved:\n- {csv_path}\n- {txt_path}")
    print("To delete local data, remove the generated files in the outputs folder.")
