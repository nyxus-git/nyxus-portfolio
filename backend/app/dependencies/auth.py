# backend/app/dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app import crud, models, schemas # Import necessary modules
from app.core import security # Import security functions (verify_password, ALGORITHM)
from app.core.config import settings # Import settings for SECRET_KEY
from app.database import get_db # Import database session dependency

# This defines the URL where clients can get the token (relative to your API prefix)
# FastAPI will automatically handle the full path resolution.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    """
    Dependency to get the current user based on the provided JWT token.
    This function verifies the token and retrieves the corresponding user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        # Extract the user's email (subject) from the payload
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        # Create a TokenData schema instance for validation/handling
        token_data = schemas.TokenData(email=email)
    except JWTError:
        # If token decoding fails (invalid signature, expired, etc.), raise an error
        raise credentials_exception
    
    # Retrieve the user from the database using the email from the token
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        # If no user is found for the email in the token, raise an error
        raise credentials_exception
    # Return the authenticated user object
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """
    Dependency to ensure the retrieved user is active.
    Depends on get_current_user to first authenticate and retrieve the user.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    # Return the active user object
    return current_user

def get_current_active_admin(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """
    Dependency to ensure the retrieved user is an active admin (superuser).
    Depends on get_current_user to first authenticate and retrieve the user.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, # 403 Forbidden is more appropriate than 400 for lack of privileges
            detail="The user doesn't have enough privileges"
        )
    # Return the admin user object
    return current_user
