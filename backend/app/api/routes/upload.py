import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ...core.deps import get_current_admin
from uuid import uuid4

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin)
):
    try:
        # Generate a unique filename to avoid overwriting
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
        unique_filename = f"{uuid4().hex}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the public URL path
        return {"url": f"/uploads/{unique_filename}", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
