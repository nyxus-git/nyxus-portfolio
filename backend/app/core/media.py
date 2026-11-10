import mimetypes
import os
from typing import Any, Iterable, Optional
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from ..models.project import Project
from ..models.blog import Blog
from ..models.skill import About
from ..models.media import UploadedMedia

# This file is at: backend/app/core/media.py
# Going up 3 dirs reaches the repo root, then into frontend/public/images.
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_IMAGES_DIR = os.path.normpath(
    os.path.join(_THIS_DIR, "../../../frontend/public/images")
)
UPLOAD_DIR = os.path.join(PUBLIC_IMAGES_DIR, "uploads")
ALLOWED_SUBDIRS = {"uploads", "projects", "blogs"}

os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_local_image_relpath(url: Any) -> Optional[str]:
    """
    Extract a safe relative path under frontend/public/images/ (e.g. 'uploads/a.png')
    for URLs pointing to /images/{uploads,projects,blogs}/... or /uploads/...
    Returns None for external URLs or invalid paths.
    """
    if not isinstance(url, str):
        return None

    raw = url.strip()
    if not raw:
        return None

    if raw.startswith(("http://", "https://")):
        parsed = urlparse(raw)
        path = parsed.path
    else:
        path = raw.split("?", 1)[0].split("#", 1)[0]

    if path.startswith("/uploads/"):
        rel = "uploads/" + path[len("/uploads/"):].lstrip("/")
    elif path.startswith("/images/"):
        rel = path[len("/images/"):].lstrip("/")
    else:
        return None

    parts = [p for p in rel.split("/") if p]
    if len(parts) < 2 or parts[0] not in ALLOWED_SUBDIRS:
        return None
    if any(p in (".", "..") for p in parts):
        return None

    return "/".join(parts)


def resolve_local_image_path(url: Any) -> Optional[str]:
    """Return the verified absolute filesystem path if it resolves inside allowed image dirs."""
    rel = extract_local_image_relpath(url)
    if not rel:
        return None

    base_real = os.path.realpath(PUBLIC_IMAGES_DIR)
    candidate = os.path.realpath(os.path.join(base_real, rel))
    if not candidate.startswith(base_real + os.sep):
        return None
    return candidate


def filename_exists(db: Session, filename: str) -> bool:
    """Return True if filename exists on disk in UPLOAD_DIR or in UploadedMedia DB."""
    if os.path.exists(os.path.join(UPLOAD_DIR, filename)):
        return True
    return db.query(UploadedMedia.id).filter(UploadedMedia.filename == filename).first() is not None


def save_uploaded_media(
    db: Session,
    filename: str,
    content_type: str,
    data: bytes,
) -> None:
    """Persist uploaded bytes to local UPLOAD_DIR and to UploadedMedia in the DB."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        buffer.write(data)

    existing = db.query(UploadedMedia).filter(UploadedMedia.filename == filename).first()
    if existing:
        setattr(existing, "content_type", content_type or "application/octet-stream")
        setattr(existing, "data", data)
        setattr(existing, "bytes", len(data))
    else:
        db.add(
            UploadedMedia(
                filename=filename,
                content_type=content_type or "application/octet-stream",
                data=data,
                bytes=len(data),
            )
        )
    db.commit()


def delete_local_image(url: Any, db: Optional[Session] = None) -> bool:
    """Delete a local image file on disk (and from UploadedMedia DB if applicable)."""
    removed_any = False
    rel = extract_local_image_relpath(url)
    filepath = resolve_local_image_path(url)

    if filepath and os.path.exists(filepath) and os.path.isfile(filepath):
        try:
            os.remove(filepath)
            removed_any = True
        except Exception:
            pass

    if db is not None and rel and rel.startswith("uploads/"):
        fname = os.path.basename(rel)
        deleted_rows = (
            db.query(UploadedMedia)
            .filter(UploadedMedia.filename == fname)
            .delete(synchronize_session=False)
        )
        if deleted_rows:
            db.commit()
            removed_any = True

    return removed_any


def _collect_all_referenced_relpaths(db: Session) -> set[str]:
    """Collect all relative local image paths currently referenced in the database."""
    refs: set[str] = set()

    for proj in db.query(Project).all():
        cover = getattr(proj, "image_url", None)
        rel = extract_local_image_relpath(cover)
        if rel:
            refs.add(rel)
        screenshots = getattr(proj, "screenshots", None) or []
        if isinstance(screenshots, list):
            for s in screenshots:
                s_rel = extract_local_image_relpath(s)
                if s_rel:
                    refs.add(s_rel)

    for blog in db.query(Blog).all():
        feat = getattr(blog, "featured_image", None)
        rel = extract_local_image_relpath(feat)
        if rel:
            refs.add(rel)

    for about in db.query(About).all():
        prof = getattr(about, "profile_image", None)
        rel = extract_local_image_relpath(prof)
        if rel:
            refs.add(rel)
        res = getattr(about, "resume_url", None)
        rel_res = extract_local_image_relpath(res)
        if rel_res:
            refs.add(rel_res)

    return refs


def is_url_in_use(db: Session, url: Any) -> bool:
    """Check whether a local image URL is currently referenced by any DB record."""
    rel = extract_local_image_relpath(url)
    if not rel:
        return False
    return rel in _collect_all_referenced_relpaths(db)


def delete_unused_images(db: Session, candidate_urls: Iterable[Any]) -> list[str]:
    """
    Delete any candidate local image files that are no longer referenced anywhere
    in the database (call AFTER committing DB changes).
    """
    candidates: list[str] = []
    seen_rels: set[str] = set()
    for url in candidate_urls:
        rel = extract_local_image_relpath(url)
        if rel and rel not in seen_rels and isinstance(url, str):
            seen_rels.add(rel)
            candidates.append(url)

    if not candidates:
        return []

    referenced = _collect_all_referenced_relpaths(db)
    deleted: list[str] = []
    for url in candidates:
        rel = extract_local_image_relpath(url)
        if rel and rel not in referenced:
            if delete_local_image(url, db=db):
                deleted.append(rel)
    return deleted


def sync_media_storage(db: Session) -> None:
    """
    Synchronize persistent UploadedMedia rows in the DB with local UPLOAD_DIR:
    1. Restore any DB-stored upload missing from disk (survives git pulls / rebuilds).
    2. Backfill any upload file on disk that is referenced by Projects/Blogs/About into DB.
    """
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        existing_db_names: set[str] = set()

        for row in db.query(UploadedMedia).all():
            fname = str(getattr(row, "filename", ""))
            if not fname:
                continue
            existing_db_names.add(fname)
            fpath = os.path.join(UPLOAD_DIR, os.path.basename(fname))
            if not os.path.exists(fpath):
                raw_bytes = getattr(row, "data", b"")
                if isinstance(raw_bytes, (bytes, bytearray)) and len(raw_bytes) > 0:
                    with open(fpath, "wb") as f:
                        f.write(raw_bytes)

        # Backfill referenced upload files that only exist on disk (e.g. uploaded prior to DB sync)
        referenced = _collect_all_referenced_relpaths(db)
        added = 0
        for rel in referenced:
            if not rel.startswith("uploads/"):
                continue
            fname = os.path.basename(rel)
            if fname in existing_db_names:
                continue
            fpath = os.path.join(UPLOAD_DIR, fname)
            if os.path.exists(fpath) and os.path.isfile(fpath):
                with open(fpath, "rb") as f:
                    raw = f.read()
                ctype, _ = mimetypes.guess_type(fpath)
                db.add(
                    UploadedMedia(
                        filename=fname,
                        content_type=ctype or "application/octet-stream",
                        data=raw,
                        bytes=len(raw),
                    )
                )
                added += 1
        if added:
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Media storage sync warning: {e}")
