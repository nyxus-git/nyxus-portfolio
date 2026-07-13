from fastapi import APIRouter, Depends, HTTPException, status
from ...core.config import settings
from ...core.security import create_access_token
from ...schemas.skill import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    if data.username != settings.admin_username or data.password != settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    token = create_access_token(data={"sub": data.username})
    return TokenResponse(access_token=token)
