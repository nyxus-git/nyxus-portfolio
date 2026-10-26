from sqlalchemy import Column, Integer, String, Text, JSON
from ..core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=True)
    title = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=True)
    features = Column(JSON, default=[])
    architecture = Column(Text, nullable=True)
    tech_stack = Column(JSON, default=[])
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    screenshots = Column(JSON, default=[])
    featured = Column(Integer, default=0)  # 0=false, 1=true
    order_index = Column(Integer, default=0)
