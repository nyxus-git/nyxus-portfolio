import base64

from app.core.config import get_settings
from fastapi import Header, HTTPException, status


def validate_admin_credentials(username: str, password: str) -> bool:
    settings = get_settings()
    return username == settings.admin_username and password == settings.admin_password


def _is_basic_auth_valid(authorization: str | None) -> bool:
    if not authorization or not authorization.startswith("Basic "):
        return False

    encoded = authorization.split(" ", 1)[1].strip()
    try:
        decoded = base64.b64decode(encoded).decode("utf-8")
    except Exception:
        return False

    if ":" not in decoded:
        return False

    username, password = decoded.split(":", 1)
    return validate_admin_credentials(username, password)


def require_admin(
    authorization: str | None = Header(default=None),
    x_admin_token: str | None = Header(default=None),
) -> None:
    settings = get_settings()
    token_ok = bool(settings.admin_token) and x_admin_token == settings.admin_token
    basic_ok = _is_basic_auth_valid(authorization)

    if token_ok or basic_ok:
        return

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid admin credentials",
    )
