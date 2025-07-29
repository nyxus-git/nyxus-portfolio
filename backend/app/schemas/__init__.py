# backend/app/schemas/__init__.py
# Import all classes from user.py
from .user import User, UserCreate, UserInDB, UserUpdate

# Import all classes from project.py
from .project import Project, ProjectCreate, ProjectInDB, ProjectUpdate

# Import all classes from token.py
from .token import Token, TokenData

# Explicitly define what gets imported with "from app.schemas import *"
__all__ = [
    "User", "UserCreate", "UserInDB", "UserUpdate",
    "Project", "ProjectCreate", "ProjectInDB", "ProjectUpdate",
    "Token", "TokenData"
]