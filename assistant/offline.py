import socket
from typing import Any, NoReturn


def enforce_local_only() -> None:
    def _blocked_connection(*args: Any, **kwargs: Any) -> NoReturn:
        raise RuntimeError(
            "Network access is disabled for this assistant. "
            "Use local inputs only."
        )

    class _BlockedSocket:
        def __new__(cls, *args: Any, **kwargs: Any) -> NoReturn:
            raise RuntimeError(
                "Network access is disabled for this assistant. "
                "Use local inputs only."
            )

    socket.create_connection = _blocked_connection  # type: ignore[assignment]
    socket.socket = _BlockedSocket  # type: ignore[assignment]
