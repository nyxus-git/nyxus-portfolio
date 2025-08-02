# backend/app/api/v1/endpoints/projects.py (Cleaned for Cloudinary)

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Security, UploadFile, File, Request, Form
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.dependencies.auth import get_current_active_admin

import cloudinary # Keep this import
import cloudinary.uploader
import cloudinary.api

# Define the router
router = APIRouter()

# --- Public Routes ---

@router.get("/", response_model=List[schemas.Project])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all projects.
    """
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a project by ID.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# --- Protected Routes (Admin Only) ---

@router.post("/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    db: Session = Depends(get_db),
    project_form: schemas.ProjectCreateForm = Depends(), # Use Depends() for Form class
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Create a new project (admin required).
    Handles file upload for project image to Cloudinary.
    """
    image_url = None
    image_public_id = None

    if project_form.image:
        try:
            file_content = await project_form.image.read()
            upload_result = cloudinary.uploader.upload(file_content)

            image_url = upload_result.get("secure_url")
            image_public_id = upload_result.get("public_id")

        except Exception as e:
            # Keep this HTTPException, but remove the traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Could not upload image to Cloudinary: {e}")
        finally:
            if hasattr(project_form.image.file, 'close'):
                project_form.image.file.close()

    project = crud.create_project(
        db=db,
        title=project_form.title,
        description=project_form.description,
        tech_stack=project_form.tech_stack,
        github_url=project_form.github_url,
        live_url=project_form.live_url,
        image_url=image_url,
        image_public_id=image_public_id,
    )
    return project

@router.put("/{project_id}", response_model=schemas.Project)
async def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: schemas.ProjectUpdate,
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Update an existing project (admin required).
    Note: This endpoint updates text fields and Cloudinary image URLs/public IDs.
    For re-uploading an image file, consider a separate PATCH endpoint specific for image.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    updated_project = crud.update_project(
        db=db,
        db_project=db_project,
        title=project_in.title,
        description=project_in.description,
        tech_stack=project_in.tech_stack,
        github_url=project_in.github_url,
        live_url=project_in.live_url,
        image_url=project_in.image_url,
        image_public_id=project_in.image_public_id,
    )
    return updated_project

@router.delete("/{project_id}", response_model=schemas.Project)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Delete a project (admin required).
    Deletes the project from the database AND its associated image from Cloudinary.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    if db_project.image_public_id:
        try:
            cloudinary.uploader.destroy(db_project.image_public_id)
            print(f"Deleted Cloudinary image with public ID: {db_project.image_public_id}")
        except Exception as e:
            print(f"Error deleting Cloudinary image {db_project.image_public_id}: {e}")

    project = crud.delete_project(db=db, project_id=project_id)
    return project
