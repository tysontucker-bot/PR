import socket


def enforce_local_only() -> None:
    def _blocked(*args, **kwargs):  # type: ignore[no-untyped-def]
        raise RuntimeError(
            "Network access is disabled for this assistant. "
            "Use local inputs only."
        )

    socket.create_connection = _blocked  # type: ignore[assignment]
    socket.socket = _blocked  # type: ignore[assignment]
