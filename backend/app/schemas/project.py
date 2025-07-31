# backend/app/schemas/project.py
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import UploadFile, Form, File # Add File here!

# Properties to receive via API on creation
class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None # New
    live_url: Optional[str] = None    # New

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
    github_url: Optional[str] = None # New
    live_url: Optional[str] = None    # New
    # For updating an image, you might need a separate endpoint or handle it carefully
    # We'll simplify for now and allow image_path update directly if needed,
    # or a separate endpoint for image replacement.
    image_path: Optional[str] = None


# Properties shared by models stored in DB
class ProjectInDBBase(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None # New
    live_url: Optional[str] = None    # New
    image_path: Optional[str] = None  # New

    class Config:
        from_attributes = True # Was already correct

# Properties to return to client (includes computed image_url)
class Project(ProjectInDBBase):
    # This field is not stored in DB, but computed for the client
    # Its value will be set in the endpoint or by a custom serializer if needed
    # For simplicity, we'll build the full URL in the endpoint or via a method
    image_url: Optional[str] = None

# Properties stored in DB (same as ProjectInDBBase for now)
class ProjectInDB(ProjectInDBBase):
    pass