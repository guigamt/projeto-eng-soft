from fastapi import Header, HTTPException, status


def get_current_user_id(x_user_id: str = Header(..., alias="X-User-Id")) -> int:
    """
    Simple stand-in authentication dependency.

    In production this should validate a JWT provided by the auth-svc.
    For the MVP we accept an integer user id via the `X-User-Id` header.
    """
    try:
        return int(x_user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Header X-User-Id must be an integer.",
        ) from exc

