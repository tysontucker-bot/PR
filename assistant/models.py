from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class GoalResponse:
    goal_name: str
    current_performance: str
    progress_since_last_period: str
    supports_and_accommodations: str
    evidence_and_examples: str
    barriers_and_challenges: str
    next_instructional_steps: str
    tone: str = "balanced"
    draft_comment: str = ""
    final_comment: str = ""


@dataclass
class SessionData:
    student_name: str
    student_id: str
    reporting_period: str
    goals: list[GoalResponse] = field(default_factory=list)
    created_at: str = field(
        default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
