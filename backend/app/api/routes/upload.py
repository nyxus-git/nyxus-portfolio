import os
import re
import shutil
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...core.media import UPLOAD_DIR, delete_local_image, is_url_in_use

router = APIRouter()


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


# ── POST /api/upload/  – upload a new file, optionally replacing an unused temp one ──
@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    replace_url: str | None = Form(None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    try:
        # Remove previous file if it was an unsaved/unreferenced upload
        if replace_url and not is_url_in_use(db, replace_url):
            delete_local_image(replace_url)

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
    """Delete an image by its filename or local /images/... path."""
    try:
        if public_id.startswith("images/") or public_id.startswith("/images/"):
            normalized = "/" + public_id.lstrip("/")
            delete_local_image(normalized)
        else:
            filename = os.path.basename(public_id)
            delete_local_image(f"/images/uploads/{filename}")
        return {"deleted": public_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {str(e)}")
