# backend/app/models/__init__.py
from .user import User
from .project import Project

# Make them available when importing from app.models
__all__ = ["User", "Project"]
