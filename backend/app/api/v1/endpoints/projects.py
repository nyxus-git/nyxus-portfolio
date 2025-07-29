# backend/app/api/v1/endpoints/projects.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Security # Import Security
from sqlalchemy.orm import Session
from app import crud, models, schemas # <-- FIXED: Added 'schemas' to the import
from app.database import get_db
from app.dependencies.auth import get_current_active_admin # For protected routes

# Define the router
router = APIRouter()

# --- Public Routes ---

@router.get("/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all projects.
    """
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a project by ID.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# --- Protected Routes (Admin Only) ---

@router.post("/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: schemas.ProjectCreate,
    # Use Security for auth dependencies
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Create a new project (admin required).
    """
    project = crud.create_project(db=db, project=project_in)
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: schemas.ProjectUpdate,
    # Use Security for auth dependencies
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Update an existing project (admin required).
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    project = crud.update_project(db=db, db_project=db_project, project_update=project_in)
    return project

@router.delete("/{project_id}", response_model=schemas.Project)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    # Use Security for auth dependencies
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Delete a project (admin required).
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    project = crud.delete_project(db=db, project_id=project_id)
    return project
