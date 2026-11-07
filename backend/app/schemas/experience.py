from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class CompanyProject(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    impact: List[str] = []
    tech_stack: List[str] = []


class ExperienceBase(BaseModel):
    job_title: str
    company_name: str
    company_url: Optional[str] = None
    role_type: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    highlights: List[str] = []
    skills: List[str] = []
    projects: List[CompanyProject] = []
    order_index: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceOut(ExperienceBase):
    id: int

    class Config:
        from_attributes = True
