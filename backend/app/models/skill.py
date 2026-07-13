from sqlalchemy import Column, Integer, String
from ..core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    level = Column(Integer, default=80)  # 0-100
    category = Column(String(100), nullable=False)  # e.g. "Languages", "Frameworks", "Tools"
    order_index = Column(Integer, default=0)


class About(Base):
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    tagline = Column(String(255), nullable=True)
    bio = Column(String(2000), nullable=True)
    bio2 = Column(String(2000), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(30), nullable=True)
    location = Column(String(100), nullable=True)
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    leetcode_url = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    profile_image = Column(String(500), nullable=True)
    roles = Column(String(500), nullable=True)  # comma-separated rotating roles
