import os
from typing import Any, Iterable, Optional
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from ..models.project import Project
from ..models.blog import Blog
from ..models.skill import About

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


def delete_local_image(url: Any) -> bool:
    """Delete a local image file on disk if it lives inside frontend/public/images/{uploads,projects,blogs}."""
    filepath = resolve_local_image_path(url)
    if not filepath:
        return False
    if os.path.exists(filepath) and os.path.isfile(filepath):
        try:
            os.remove(filepath)
            return True
        except Exception:
            return False
    return False


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
            if delete_local_image(url):
                deleted.append(rel)
    return deleted

