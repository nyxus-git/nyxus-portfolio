# backend/app/models/project.py
from sqlalchemy import Column, Integer, String, Text, ARRAY
from app.db.base import Base # Import Base from the dedicated file

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(String), nullable=False)
    # New fields
    github_url = Column(String, nullable=True) # Allow null if not all projects have it
    live_url = Column(String, nullable=True)   # Allow null
    image_path = Column(String, nullable=True) # Stores the path to the uploaded image file