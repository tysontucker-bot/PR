from assistant.exceptions import UserCancelled
from assistant.generator import generate_comment
from assistant.models import SessionData

TONE_ROTATION = {"concise": "balanced", "balanced": "detailed", "detailed": "concise"}


def _prompt_action() -> str:
    while True:
        action = input("\nChoose: [a]ccept, [e]dit, [r]egenerate: ").strip().lower()
        if action in {"a", "e", "r"}:
            return action
        print("Please enter a, e, or r.")


def _prompt_final_action() -> str:
    while True:
        action = input("\nFinal review: [c]ontinue, [e]dit a comment, [q]uit without saving: ").strip().lower()
        if action in {"c", "e", "q"}:
            return action
        print("Please enter c, e, or q.")


def _edit_comment(current: str) -> str:
    print("\nCurrent comment:")
    print(current)
    print("\nEnter replacement comment. Leave blank to keep current.")
    replacement = input("> ").strip()
    if replacement:
        return replacement
    return current


def review_session(session: SessionData) -> None:
    for index, goal in enumerate(session.goals, start=1):
        while True:
            goal.draft_comment = generate_comment(goal)
            print(f"\n=== Draft Comment for Goal {index}: {goal.goal_name} ===")
            print(goal.draft_comment)
            action = _prompt_action()

            if action == "a":
                goal.final_comment = goal.draft_comment
                break
            if action == "e":
                goal.final_comment = _edit_comment(goal.draft_comment)
                break

            goal.tone = TONE_ROTATION[goal.tone]
            print(f"Regenerated using {goal.tone} style.")

    while True:
        print("\n=== Final Session Review ===")
        for idx, goal in enumerate(session.goals, start=1):
            print(f"\n[{idx}] {goal.goal_name}")
            print(goal.final_comment)

        action = _prompt_final_action()
        if action == "c":
            return
        if action == "q":
            raise UserCancelled("Session ended without saving.")

        selection = input("Enter goal number to edit: ").strip()
        if selection.isdigit():
            goal_index = int(selection) - 1
            if 0 <= goal_index < len(session.goals):
                session.goals[goal_index].final_comment = _edit_comment(
                    session.goals[goal_index].final_comment
                )
                continue
        print("Invalid goal number.")
