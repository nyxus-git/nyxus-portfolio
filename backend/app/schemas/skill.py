from pydantic import BaseModel
from typing import Optional


class SkillBase(BaseModel):
    name: str
    level: int = 80
    category: str
    order_index: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    pass


class SkillOut(SkillBase):
    id: int

    class Config:
        from_attributes = True


class AboutBase(BaseModel):
    name: str
    tagline: Optional[str] = None
    bio: Optional[str] = None
    bio2: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    youtube_url: Optional[str] = None
    leetcode_url: Optional[str] = None
    resume_url: Optional[str] = None
    profile_image: Optional[str] = None
    roles: Optional[str] = None


class AboutCreate(AboutBase):
    pass


class AboutUpdate(AboutBase):
    pass


class AboutOut(AboutBase):
    id: int

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
