from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    content = Column(Text, nullable=True)
    excerpt = Column(Text, nullable=True)
    featured_image = Column(String(500), nullable=True)
    author = Column(String(100), default="Rohan Mane")
    date = Column(String(20), nullable=False)
    tags = Column(String(500), nullable=True)  # comma-separated
    published = Column(Integer, default=1)  # 0=draft, 1=published
