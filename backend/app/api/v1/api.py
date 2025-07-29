# backend/app/api/v1/api.py
from fastapi import APIRouter

# Import endpoint routers
from app.api.v1.endpoints import projects, contact, auth

# Create the main API router
api_router = APIRouter()

# Include individual endpoint routers with prefixes and tags
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# Add admin router later when needed
# api_router.include_router(admin.router, prefix="/admin", tags=["admin"])