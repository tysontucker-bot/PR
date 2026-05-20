from assistant.models import GoalResponse, SessionData

DEFAULT_BARRIERS_TEXT = "No major barriers were reported."


def _prompt_required(label: str) -> str:
    while True:
        value = input(f"{label}: ").strip()
        if value:
            return value
        print("This field is required. Please enter a response.")


def _prompt_optional(label: str) -> str:
    return input(f"{label} (optional): ").strip()


def _prompt_choice(label: str, options: list[str]) -> str:
    option_text = "/".join(options)
    while True:
        value = input(f"{label} [{option_text}]: ").strip().lower()
        if value in options:
            return value
        print(f"Please choose one of: {option_text}")


def collect_session_data() -> SessionData:
    print("\nSpecial Education Progress Report Assistant (Local Only)\n")
    student_name = _prompt_required("Student name")
    student_id = _prompt_required("Student ID")
    reporting_period = _prompt_required("Reporting period")
    session = SessionData(
        student_name=student_name,
        student_id=student_id,
        reporting_period=reporting_period,
    )

    goal_count = _prompt_required("How many goals are you reporting on?")
    while not goal_count.isdigit() or int(goal_count) < 1:
        print("Please enter a whole number of 1 or more.")
        goal_count = _prompt_required("How many goals are you reporting on?")
    total_goals = int(goal_count)

    for index in range(1, total_goals + 1):
        print(f"\n--- Goal {index} of {total_goals} ---")
        goal_name = _prompt_required("Goal name")
        current_performance = _prompt_required("Current performance")
        progress_since_last_period = _prompt_required("Progress since last period")
        supports_and_accommodations = _prompt_required("Supports/accommodations used")
        evidence_and_examples = _prompt_required("Evidence/examples observed")
        barriers_and_challenges = _prompt_optional("Barriers/challenges")
        next_instructional_steps = _prompt_required("Next instructional steps")
        tone = _prompt_choice("Draft style", ["concise", "balanced", "detailed"])

        session.goals.append(
            GoalResponse(
                goal_name=goal_name,
                current_performance=current_performance,
                progress_since_last_period=progress_since_last_period,
                supports_and_accommodations=supports_and_accommodations,
                evidence_and_examples=evidence_and_examples,
                barriers_and_challenges=barriers_and_challenges or DEFAULT_BARRIERS_TEXT,
                next_instructional_steps=next_instructional_steps,
                tone=tone,
            )
        )

    return session
