# backend/app/models/project.py
from sqlalchemy import Column, Integer, String, Text, ARRAY
from app.db.base import Base # Import Base from the dedicated file

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(String), nullable=False)
    github_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)
    # Changed from image_path to image_url and image_public_id for Cloudinary
    image_url = Column(String, nullable=True)      # Stores the full Cloudinary image URL
    image_public_id = Column(String, nullable=True) # Stores Cloudinary's public ID for deletion