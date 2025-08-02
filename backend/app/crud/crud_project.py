from sqlalchemy.orm import Session
from app import models, schemas
from typing import List, Optional

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

# Modified to accept Cloudinary image_url and image_public_id
def create_project(
    db: Session,
    title: str,
    description: str,
    tech_stack: List[str],
    github_url: Optional[str] = None,
    live_url: Optional[str] = None,
    image_url: Optional[str] = None,      # Changed from image_path
    image_public_id: Optional[str] = None, # New field for Cloudinary public ID
):
    db_project = models.Project(
        title=title,
        description=description,
        tech_stack=tech_stack,
        github_url=github_url,
        live_url=live_url,
        image_url=image_url,              # Changed from image_path
        image_public_id=image_public_id,  # New field
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Modified to accept Cloudinary image_url and image_public_id
def update_project(
    db: Session,
    db_project: models.Project,
    title: Optional[str] = None,
    description: Optional[str] = None,
    tech_stack: Optional[List[str]] = None,
    github_url: Optional[str] = None,
    live_url: Optional[str] = None,
    image_url: Optional[str] = None,      # Changed from image_path
    image_public_id: Optional[str] = None, # New field
):
    if title is not None:
        db_project.title = title
    if description is not None:
        db_project.description = description
    if tech_stack is not None:
        db_project.tech_stack = tech_stack
    if github_url is not None:
        db_project.github_url = github_url
    if live_url is not None:
        db_project.live_url = live_url
    if image_url is not None:
        db_project.image_url = image_url      # Changed from image_path
    if image_public_id is not None:
        db_project.image_public_id = image_public_id # New field

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project
