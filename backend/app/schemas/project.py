# backend/app/schemas/project.py
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import UploadFile, Form, File

# Properties to receive via API on creation
class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None

# Schema for file upload with other form data for POST requests
# This is specifically for endpoints that handle multipart/form-data (file uploads)
class ProjectCreateForm:
    def __init__(
        self,
        title: str = Form(...),
        description: str = Form(...),
        tech_stack: str = Form(...), # tech_stack comes as a string, e.g., "react,nodejs"
        github_url: Optional[str] = Form(None),
        live_url: Optional[str] = Form(None),
        image: Optional[UploadFile] = File(None), # Use File for UploadFile in forms
    ):
        self.title = title
        self.description = description
        self.tech_stack = [s.strip() for s in tech_stack.split(',')] if tech_stack else []
        self.github_url = github_url
        self.live_url = live_url
        self.image = image


# Properties to receive via API on update
class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    # For updating an image, you can send the new Cloudinary URL/public_id directly
    # or implement a separate PATCH endpoint for file re-upload if needed.
    image_url: Optional[str] = None
    image_public_id: Optional[str] = None


# Properties shared by models stored in DB
class ProjectInDBBase(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    # Changed from image_path
    image_url: Optional[str] = None
    image_public_id: Optional[str] = None

    class Config:
        from_attributes = True

# Properties to return to client (includes all fields from DB)
class Project(ProjectInDBBase):
    # No need for a separate `image_url` computation field here,
    # as the `image_url` is directly stored in the DB now.
    pass

# Properties stored in DB (same as ProjectInDBBase for now)
class ProjectInDB(ProjectInDBBase):
    pass