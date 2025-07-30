# backend/app/schemas/__init__.py
from .user import User, UserCreate, UserInDB, UserUpdate
from .project import Project, ProjectCreate, ProjectInDB, ProjectUpdate
from .token import Token, TokenData

# Explicitly define what gets imported with "from app.schemas import *"
__all__ = [
    "User", "UserCreate", "UserInDB", "UserUpdate",
    "Project", "ProjectCreate", "ProjectInDB", "ProjectUpdate",
    "Token", "TokenData"
]
