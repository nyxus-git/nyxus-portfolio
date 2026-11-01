from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...models.project import Project
from ...schemas.project import ProjectCreate, ProjectUpdate, ProjectOut

router = APIRouter()


@router.get("/", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    """Public endpoint — returns only visible projects (is_visible=1)."""
    return (
        db.query(Project)
        .filter(Project.is_visible == 1)
        .order_by(Project.order_index)
        .all()
    )


@router.get("/admin/all", response_model=List[ProjectOut])
def get_all_projects_admin(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    """Admin endpoint — returns ALL projects including hidden ones."""
    return db.query(Project).order_by(Project.order_index).all()


@router.get("/slug/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectOut)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.patch("/{project_id}/visibility", response_model=ProjectOut)
def toggle_project_visibility(
    project_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    """Toggle is_visible between 1 (public) and 0 (hidden). Admin only."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    setattr(db_project, "is_visible", 0 if db_project.is_visible else 1)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}
