# backend/app/api/v1/endpoints/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.core import security
from app.core.config import settings
from app.database import get_db
# --- DO NOT IMPORT authenticate_user from dependencies ---
# The function is defined locally in this file.
# from app.dependencies.auth import authenticate_user # <-- REMOVE/COMMENT THIS LINE
# --- END CORRECTION ---

router = APIRouter()

# --- DEFINE authenticate_user FUNCTION HERE ---
def authenticate_user(db: Session, email: str, password: str):
    """
    Verifies user credentials against the database.
    """
    user = crud.get_user_by_email(db, email)
    if not user:
        return False
    if not security.verify_password(password, user.hashed_password):
        return False
    return user
# --- END authenticate_user FUNCTION ---

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    # --- CORRECTED LINE ---
    form_data: schemas.UserCreate, # Reuse UserCreate schema for email/password
    # --- END CORRECTION ---
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Use the locally defined authenticate_user function
    user = authenticate_user(db, form_data.email, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Calculate token expiration
    access_token_expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Create the JWT access token
    access_token = security.create_access_token(
        subject=user.email, expires_delta=access_token_expires_delta
    )
    
    # Return the token
    return {"access_token": access_token, "token_type": "bearer"}
