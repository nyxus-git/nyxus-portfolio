import os
import shutil
import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from ...core.deps import get_current_admin
from ...core.config import settings
from uuid import uuid4

router = APIRouter()

# Configure Cloudinary
def _cloudinary_configured() -> bool:
    return bool(
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret
    )

if _cloudinary_configured():
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
    )

# Fallback for local uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


# ── POST /api/upload/  – upload a new file ────────────────────────────────────
@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    _: str = Depends(get_current_admin),
):
    try:
        if _cloudinary_configured():
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
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "filename": file.filename,
                "width": result.get("width"),
                "height": result.get("height"),
                "bytes": result.get("bytes"),
                "created_at": result.get("created_at"),
            }
        else:
            safe_filename = file.filename or "upload"
            file_ext = safe_filename.split(".")[-1] if "." in safe_filename else "bin"
            unique_filename = f"{uuid4().hex}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            stat = os.stat(file_path)
            return {
                "url": f"/uploads/{unique_filename}",
                "public_id": unique_filename,
                "filename": file.filename,
                "bytes": stat.st_size,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")


# ── GET /api/upload/  – list all uploaded images ─────────────────────────────
@router.get("/")
async def list_uploads(
    _: str = Depends(get_current_admin),
    next_cursor: str | None = Query(None),
    max_results: int = Query(30, le=100),
):
    """Return a paginated list of uploaded images from Cloudinary or the local upload dir."""
    try:
        if _cloudinary_configured():
            kwargs: dict = {
                "type": "upload",
                "prefix": "nyxus-portfolio/",
                "max_results": max_results,
                "resource_type": "image",
            }
            if next_cursor:
                kwargs["next_cursor"] = next_cursor

            result = cloudinary.api.resources(**kwargs)
            images = [
                {
                    "url": r.get("secure_url"),
                    "public_id": r.get("public_id"),
                    "filename": r.get("public_id", "").split("/")[-1],
                    "width": r.get("width"),
                    "height": r.get("height"),
                    "bytes": r.get("bytes"),
                    "created_at": r.get("created_at"),
                    "format": r.get("format"),
                }
                for r in result.get("resources", [])
            ]
            return {
                "images": images,
                "next_cursor": result.get("next_cursor"),
                "source": "cloudinary",
            }
        else:
            # Local fallback
            files = []
            for fname in sorted(os.listdir(UPLOAD_DIR), reverse=True):
                fpath = os.path.join(UPLOAD_DIR, fname)
                if os.path.isfile(fpath):
                    stat = os.stat(fpath)
                    files.append(
                        {
                            "url": f"/uploads/{fname}",
                            "public_id": fname,
                            "filename": fname,
                            "bytes": stat.st_size,
                            "created_at": None,
                        }
                    )
            return {"images": files, "next_cursor": None, "source": "local"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not list uploads: {str(e)}")


# ── DELETE /api/upload/{public_id:path}  – delete an image ────────────────────
@router.delete("/{public_id:path}")
async def delete_upload(
    public_id: str,
    _: str = Depends(get_current_admin),
):
    """Delete an image by its Cloudinary public_id (or local filename)."""
    try:
        if _cloudinary_configured():
            result = cloudinary.uploader.destroy(public_id, resource_type="image")
            if result.get("result") not in ("ok", "not found"):
                raise HTTPException(status_code=500, detail=f"Cloudinary delete failed: {result}")
            return {"deleted": public_id}
        else:
            file_path = os.path.join(UPLOAD_DIR, public_id)
            if os.path.exists(file_path):
                os.remove(file_path)
            return {"deleted": public_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {str(e)}")

