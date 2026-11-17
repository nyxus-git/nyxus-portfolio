from pydantic import BaseModel, field_validator
from typing import Optional, List, Any


class ProjectLink(BaseModel):
    label: str
    url: str
    display_order: Optional[int] = 0


class CompanyProject(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    category: Optional[str] = None
    is_published: Optional[bool] = True
    # Legacy single-URL fields (kept for backward compat)
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    # Multi-link support
    links: Optional[List[ProjectLink]] = []
    # Responsibilities (replaces impact for SAMPRO projects)
    impact: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []
    tech_stack: Optional[List[str]] = []

    @field_validator("impact", "tech_stack", "responsibilities", "links", mode="before")
    @classmethod
    def default_empty_list(cls, v):
        return v if v is not None else []


class ExperienceBase(BaseModel):
    job_title: str
    company_name: str
    company_url: Optional[str] = None
    role_type: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    projects: Optional[List[CompanyProject]] = []
    order_index: int = 0

    @field_validator("highlights", "skills", "projects", mode="before")
    @classmethod
    def default_empty_list(cls, v):
        return v if v is not None else []


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceOut(ExperienceBase):
    id: int

    class Config:
        from_attributes = True
