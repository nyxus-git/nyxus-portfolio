# backend/app/models/__init__.py
# Import all classes from user.py
from .user import User

# Import all classes from project.py
from .project import Project

# Explicitly define what gets imported with "from app.models import *"
# This improves clarity and ensures all necessary models are available.
__all__ = [
    "User",
    "Project",
]
