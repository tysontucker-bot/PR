import socket
from typing import Any


def enforce_local_only() -> None:
    def _blocked(*args: Any, **kwargs: Any) -> None:
        raise RuntimeError(
            "Network access is disabled for this assistant. "
            "Use local inputs only."
        )

    socket.create_connection = _blocked  # type: ignore[assignment]
    socket.socket = _blocked  # type: ignore[assignment]
