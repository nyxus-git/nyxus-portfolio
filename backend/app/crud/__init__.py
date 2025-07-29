# backend/app/crud/__init__.py
# --- CORRECTED IMPORTS ---
# Import all functions from crud_user.py (note: file is crud_user.py, module is .crud_user)
from .crud_user import (
    get_user,
    get_user_by_email,
    get_users,
    create_user,
    update_user,
    delete_user,
)

# Import all functions from crud_project.py (note: file is crud_project.py, module is .crud_project)
from .crud_project import (
    get_project,
    get_projects,
    create_project,
    update_project,
    delete_project,
)
# --- END CORRECTED IMPORTS ---

# Optionally, explicitly define what gets imported with "from app.crud import *"
__all__ = [
    "get_user",
    "get_user_by_email",
    "get_users",
    "create_user",
    "update_user",
    "delete_user",
    "get_project",
    "get_projects",
    "create_project",
    "update_project",
    "delete_project",
]
