from assistant.exceptions import UserCancelled
from assistant.offline import enforce_local_only
from assistant.prompts import collect_session_data
from assistant.review import review_session
from assistant.export import export_session


def main() -> None:
    try:
        enforce_local_only()
        session = collect_session_data()
        review_session(session)
        export_session(session)
        print("\nDone. Your files were saved locally.")
    except UserCancelled as exc:
        print(str(exc))


if __name__ == "__main__":
    main()
