# backend/app/api/v1/endpoints/projects.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Security, UploadFile, File, Request, Form
from sqlalchemy.orm import Session
from app import crud, models, schemas # Keep 'schemas' here to resolve NameError for schemas.Project
from app.database import get_db
from app.dependencies.auth import get_current_active_admin
import os
import shutil # For saving files
import uuid # For generating unique filenames

# Define the router
router = APIRouter()

# --- Configuration for image uploads ---
# Ensure this directory exists relative to your backend/app folder
# This will result in a path like: backend/app/static/project_images/
UPLOAD_DIRECTORY = os.path.join("static", "project_images")
# Create the directory if it doesn't exist
# We need to ensure the full path from the project root is created
# os.path.dirname(__file__) gets the directory of the current file (endpoints)
# We go up two levels to 'app' and then join with UPLOAD_DIRECTORY
FULL_UPLOAD_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), UPLOAD_DIRECTORY)
os.makedirs(FULL_UPLOAD_PATH, exist_ok=True)


# Helper to build the full image URL
def _get_image_url(request: Request, image_path: Optional[str]) -> Optional[str]:
    if image_path:
        # Construct the URL. 'static' is the name given in app.main.py's app.mount
        # image_path stored in DB is relative to the 'static' directory (e.g., "project_images/filename.jpg")
        return str(request.url_for("static", path=image_path))
    return None

# --- Public Routes ---

@router.get("/", response_model=List[schemas.Project])
def read_projects(
    request: Request, # Inject Request object to build full URLs
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all projects.
    """
    projects = crud.get_projects(db, skip=skip, limit=limit)
    # Add image_url to each project before returning
    for project in projects:
        project.image_url = _get_image_url(request, project.image_path)
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    request: Request, # Inject Request object
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a project by ID.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db_project.image_url = _get_image_url(request, db_project.image_path)
    return db_project

# --- Protected Routes (Admin Only) ---

@router.post("/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    request: Request, # Inject Request object
    db: Session = Depends(get_db),
    # Use the ProjectCreateForm for multipart/form-data
    project_form: schemas.ProjectCreateForm = Depends(), # Use Depends() for Form class
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Create a new project (admin required).
    Handles file upload for project image.
    """
    image_path_in_db = None
    if project_form.image:
        # Generate a unique filename to prevent clashes and improve security
        file_extension = os.path.splitext(project_form.image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_location = os.path.join(FULL_UPLOAD_PATH, unique_filename)

        try:
            # Save the file to the local filesystem
            with open(file_location, "wb+") as file_object:
                # Use project_form.image.file which is the SpooledTemporaryFile
                # shutil.copyfileobj is efficient for large files
                shutil.copyfileobj(project_form.image.file, file_object)

            # Store the path relative to the `static` directory for the database
            image_path_in_db = os.path.join("project_images", unique_filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save image: {e}")
        finally:
            # It's good practice to close the uploaded file explicitly if it's a SpooledTemporaryFile
            # though FastAPI usually handles this after the request.
            project_form.image.file.close()


    project = crud.create_project(
        db=db,
        title=project_form.title,
        description=project_form.description,
        tech_stack=project_form.tech_stack, # tech_stack is already List[str] due to ProjectCreateForm logic
        github_url=project_form.github_url,
        live_url=project_form.live_url,
        image_path=image_path_in_db,
    )
    # Set the image_url for the response
    project.image_url = _get_image_url(request, project.image_path)
    return project

@router.put("/{project_id}", response_model=schemas.Project)
async def update_project(
    request: Request, # Inject Request object
    *,
    db: Session = Depends(get_db),
    project_id: int,
    # For updating text fields and optionally the image_path directly
    project_in: schemas.ProjectUpdate,
    current_admin: models.User = Security(get_current_active_admin),
):
    """
    Update an existing project (admin required).
    Note: This endpoint updates text fields and image_path (string).
    For re-uploading an image file, consider a separate PATCH endpoint specific for image.
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update only fields that are provided in the request
    updated_project = crud.update_project(
        db=db,
        db_project=db_project,
        title=project_in.title,
        description=project_in.description,
        tech_stack=project_in.tech_stack,
        github_url=project_in.github_url,
        live_url=project_in.live_url,
        image_path=project_in.image_path, # Allow updating path string directly
    )
    updated_project.image_url = _get_image_url(request, updated_project.image_path)
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
    """
    db_project = crud.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Optional: Delete the associated image file when a project is deleted
    if db_project.image_path:
        # Construct the full path to the image file on the filesystem
        # It's important to use os.path.join for path construction
        # and to ensure you're pointing to the actual file.
        # db_project.image_path is like "project_images/filename.jpg"
        # FULL_UPLOAD_PATH is like "backend/app/static/project_images"
        # So, the full file path is FULL_UPLOAD_PATH / filename.jpg
        filename_only = os.path.basename(db_project.image_path)
        full_image_file_path = os.path.join(FULL_UPLOAD_PATH, filename_only)

        if os.path.exists(full_image_file_path):
            try:
                os.remove(full_image_file_path)
                print(f"Deleted image file: {full_image_file_path}")
            except OSError as e:
                print(f"Error deleting image file {full_image_file_path}: {e}")
                # You might choose to raise an HTTPException here, or just log
                # For deletion, often logging is sufficient if the DB entry is primary.

    project = crud.delete_project(db=db, project_id=project_id)
    return project