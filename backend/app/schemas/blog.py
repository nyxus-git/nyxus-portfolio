from pydantic import BaseModel
from typing import Optional


class BlogBase(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    author: str = "Rohan Mane"
    date: str
    tags: Optional[str] = None
    published: int = 1


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BlogBase):
    pass


class BlogOut(BlogBase):
    id: int

    class Config:
        from_attributes = True
