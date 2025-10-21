from fastapi import Header, HTTPException, status


def get_current_user_id(x_user_id: str = Header(..., alias="X-User-Id")) -> int:
    """Simplified identity extraction for MVP interoperability."""
    try:
        return int(x_user_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Header X-User-Id must be a valid integer.",
        ) from exc

