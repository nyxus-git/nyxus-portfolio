import os
import shutil
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ...core.deps import get_current_admin
from ...core.config import settings
from uuid import uuid4

router = APIRouter()

# Configure Cloudinary
if settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret:
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret
    )

# Fallback for local uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin)
):
    try:
        # Check if Cloudinary is configured
        if settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret:
            # Upload to Cloudinary with automatic optimisation:
            # - f_auto  → serves WebP/AVIF to modern browsers, JPEG to old ones
            # - q_auto  → Cloudinary picks the ideal quality level per image
            # - w_1920,c_limit → caps max width at 1920px (never upscales)
            # - strip_metadata → removes EXIF/GPS data, sheds ~15-30 KB per image
            result = cloudinary.uploader.upload(
                file.file,
                folder="nyxus-portfolio",
                resource_type="image",
                transformation=[
                    {"quality": "auto", "fetch_format": "auto"},
                    {"width": 1920, "crop": "limit"},
                ],
                strip_metadata=True,
            )
            return {"url": result.get("secure_url"), "filename": file.filename}
        else:
            # Fallback to local upload
            safe_filename = file.filename or "upload"
            file_ext = safe_filename.split(".")[-1] if "." in safe_filename else "bin"
            unique_filename = f"{uuid4().hex}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            return {"url": f"/uploads/{unique_filename}", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
