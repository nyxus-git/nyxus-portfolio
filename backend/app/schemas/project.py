# backend/app/schemas/project.py
from pydantic import BaseModel
from typing import List

# Properties to receive via API on creation
class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str]

# Properties to receive via API on update
class ProjectUpdate(ProjectCreate):
    title: str | None = None
    description: str | None = None
    tech_stack: List[str] | None = None

# Properties shared by models stored in DB
class ProjectInDBBase(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]

    class Config:
        from_attributes = True

# Properties to return to client
class Project(ProjectInDBBase):
    pass

# Properties stored in DB (same as ProjectInDBBase for now)
class ProjectInDB(ProjectInDBBase):
    pass