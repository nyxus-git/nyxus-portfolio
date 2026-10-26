from pydantic import BaseModel
from typing import List, Optional


class ProjectBase(BaseModel):
    title: str
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: str
    long_description: Optional[str] = None
    features: List[str] = []
    architecture: Optional[str] = None
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    screenshots: List[str] = []
    featured: int = 0
    order_index: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int

    class Config:
        from_attributes = True
