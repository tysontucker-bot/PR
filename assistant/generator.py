from pathlib import Path

from assistant.models import GoalResponse


def _load_template() -> str:
    template_path = Path(__file__).resolve().parent.parent / "templates" / "progress_comment.txt"
    return template_path.read_text(encoding="utf-8")


def generate_comment(goal: GoalResponse) -> str:
    template = _load_template()
    tone_line = {
        "concise": "Progress is summarized briefly with key updates.",
        "detailed": "Progress is summarized with additional instructional detail.",
        "balanced": "Progress is summarized with a clear and professional level of detail.",
    }.get(goal.tone, "Progress is summarized with a clear and professional level of detail.")

    return template.format(
        goal_name=goal.goal_name,
        current_performance=goal.current_performance,
        progress_since_last_period=goal.progress_since_last_period,
        supports_and_accommodations=goal.supports_and_accommodations,
        evidence_and_examples=goal.evidence_and_examples,
        barriers_and_challenges=goal.barriers_and_challenges,
        next_instructional_steps=goal.next_instructional_steps,
        tone_line=tone_line,
    )
