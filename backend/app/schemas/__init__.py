# backend/app/schemas/__init__.py
from .user import User, UserCreate, UserInDB, UserUpdate
# IMPORTANT: Add ProjectCreateForm to this import
from .project import Project, ProjectCreate, ProjectInDB, ProjectUpdate, ProjectCreateForm
from .token import Token, TokenData
# Assuming you might also have contact or other schemas
from .contact import ContactFormData # <--- Assuming this exists, if not, remove or adjust


# Explicitly define what gets imported with "from app.schemas import *"
__all__ = [
    "User", "UserCreate", "UserInDB", "UserUpdate",
    "Project", "ProjectCreate", "ProjectInDB", "ProjectUpdate", "ProjectCreateForm", # IMPORTANT: Add ProjectCreateForm here
    "Token", "TokenData",
    "ContactFormData" # <--- Add if you have this schema
]