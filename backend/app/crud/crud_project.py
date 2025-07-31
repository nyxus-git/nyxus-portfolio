# backend/app/crud/crud_project.py
from sqlalchemy.orm import Session
from app import models, schemas
from typing import List, Optional # Import Optional

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

# Modified to accept new fields and image_path
def create_project(
    db: Session,
    title: str,
    description: str,
    tech_stack: List[str],
    github_url: Optional[str] = None,
    live_url: Optional[str] = None,
    image_path: Optional[str] = None, # New
):
    db_project = models.Project(
        title=title,
        description=description,
        tech_stack=tech_stack,
        github_url=github_url,
        live_url=live_url,
        image_path=image_path, # New
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Modified to accept new fields and image_path
def update_project(
    db: Session,
    db_project: models.Project,
    title: Optional[str] = None,
    description: Optional[str] = None,
    tech_stack: Optional[List[str]] = None,
    github_url: Optional[str] = None,
    live_url: Optional[str] = None,
    image_path: Optional[str] = None, # New
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
    if image_path is not None:
        db_project.image_path = image_path # New

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