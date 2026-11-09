import os
import re
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from ...core.deps import get_current_admin
from uuid import uuid4

router = APIRouter()

# Resolve the frontend public uploads directory relative to this file's location.
# This file is at: backend/app/api/routes/upload.py
# Going up 4 dirs reaches the project root, then into frontend/public/images/uploads.
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.normpath(os.path.join(_THIS_DIR, "../../../../frontend/public/images/uploads"))

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def _safe_filename(original: str) -> str:
    """Return a sanitized version of the original filename."""
    name, _, ext = original.rpartition(".")
    name = re.sub(r"[^\w\-]", "_", name)
    ext = re.sub(r"[^\w]", "", ext).lower()
    if not name:
        name = uuid4().hex
    if not ext:
        ext = "bin"
    return f"{name}.{ext}"


# ── POST /api/upload/  – upload a new file, optionally replacing an old one ──
@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    replace_url: str | None = Form(None),
    _: str = Depends(get_current_admin),
):
    try:
        # If replace_url was provided, remove the previous file from uploads if present
        if replace_url:
            old_filename = os.path.basename(replace_url.strip())
            if old_filename:
                old_file_path = os.path.join(UPLOAD_DIR, old_filename)
                if os.path.exists(old_file_path) and os.path.isfile(old_file_path):
                    try:
                        os.remove(old_file_path)
                    except Exception:
                        pass

        original_name = file.filename or "upload"
        filename = _safe_filename(original_name)

        # Ensure unique name to prevent accidental overwrites
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            prefix = uuid4().hex[:8]
            filename = f"{prefix}_{filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        stat = os.stat(file_path)
        return {
            "url": f"/images/uploads/{filename}",
            "public_id": filename,
            "filename": filename,
            "bytes": stat.st_size,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")


# ── GET /api/upload/  – list all uploaded images ─────────────────────────────
@router.get("/")
async def list_uploads(
    _: str = Depends(get_current_admin),
    max_results: int = Query(40, le=200),
):
    """Return a list of uploaded images from the frontend public uploads directory."""
    try:
        files = []
        if os.path.isdir(UPLOAD_DIR):
            for fname in sorted(os.listdir(UPLOAD_DIR), reverse=True)[:max_results]:
                fpath = os.path.join(UPLOAD_DIR, fname)
                if os.path.isfile(fpath):
                    stat = os.stat(fpath)
                    files.append(
                        {
                            "url": f"/images/uploads/{fname}",
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
    """Delete an image by its filename from the frontend public uploads directory."""
    try:
        filename = os.path.basename(public_id)
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            os.remove(file_path)
        return {"deleted": public_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {str(e)}")
