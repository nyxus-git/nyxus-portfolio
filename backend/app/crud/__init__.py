# backend/app/crud/__init__.py
from .crud_user import (
    get_user,
    get_user_by_email,
    get_users,
    create_user,
    update_user,
    delete_user,
)
from .crud_project import (
    get_project,
    get_projects,
    create_project,
    update_project,
    delete_project,
)

# Explicitly define what gets imported with "from app.crud import *"
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
