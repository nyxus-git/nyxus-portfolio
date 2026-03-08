import re
import time
from pathlib import Path
from typing import Any

import httpx
from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import require_admin, validate_admin_credentials
from app.schemas.content import (
    AdminLoginRequest,
    AssistantRequest,
    BlogIn,
    BootstrapPayload,
    CertificationIn,
    ExperienceIn,
    ProjectIn,
)
from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

router = APIRouter()

REPO_ROOT = Path(__file__).resolve().parents[4]
FRONTEND_PUBLIC_DIR = REPO_ROOT / "frontend" / "public"
UPLOAD_IMAGES_DIR = FRONTEND_PUBLIC_DIR / "uploads" / "images"
UPLOAD_RESUME_DIR = FRONTEND_PUBLIC_DIR / "uploads" / "resume"

UPLOAD_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_RESUME_DIR.mkdir(parents=True, exist_ok=True)

SITE_CONFIG_ID = "site_config"


def _serialize(document: dict[str, Any]) -> dict[str, Any]:
    document["id"] = str(document.pop("_id"))
    return document


def _list(collection_name: str, sort_key: str | None = None) -> list[dict[str, Any]]:
    db = get_db()
    cursor = db[collection_name].find({})
    if sort_key:
        cursor = cursor.sort(sort_key, -1)
    return [_serialize(doc) for doc in cursor]


def _safe_stem(name: str) -> str:
    stem = Path(name).stem.lower()
    return re.sub(r"[^a-z0-9]+", "-", stem).strip("-") or "file"


def _resume_url() -> str:
    config = get_db().settings.find_one({"_id": SITE_CONFIG_ID}) or {}
    return str(config.get("resumeUrl", "/Rohan_Resume.pdf"))


@router.get("/site-config")
def get_site_config() -> dict[str, str]:
    return {"resumeUrl": _resume_url()}


@router.get("/projects")
def get_projects() -> list[dict[str, Any]]:
    return _list("projects")


@router.get("/experiences")
def get_experiences() -> list[dict[str, Any]]:
    return _list("experiences", sort_key="startDate")


@router.get("/certifications")
def get_certifications() -> list[dict[str, Any]]:
    return _list("certifications", sort_key="issueDate")


@router.get("/blogs")
def get_blogs() -> list[dict[str, Any]]:
    return _list("blogs", sort_key="date")


@router.get("/blogs/{slug}")
def get_blog_by_slug(slug: str) -> dict[str, Any]:
    blog = get_db().blogs.find_one({"slug": slug})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return _serialize(blog)


@router.post("/admin/login")
def admin_login(payload: AdminLoginRequest) -> dict[str, str]:
    if not validate_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}


@router.post("/admin/upload/image", dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...)) -> dict[str, str]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing")

    ext = Path(file.filename).suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    filename = f"{int(time.time() * 1000)}-{_safe_stem(file.filename)}{ext}"
    target = UPLOAD_IMAGES_DIR / filename
    content = await file.read()
    target.write_bytes(content)

    return {"url": f"/uploads/images/{filename}"}


@router.post("/admin/upload/resume", dependencies=[Depends(require_admin)])
async def upload_resume(file: UploadFile = File(...)) -> dict[str, str]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing")
    if Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

    for old_resume in UPLOAD_RESUME_DIR.glob("*.pdf"):
        old_resume.unlink(missing_ok=True)

    filename = f"resume-{int(time.time() * 1000)}.pdf"
    target = UPLOAD_RESUME_DIR / filename
    content = await file.read()
    target.write_bytes(content)

    url = f"/uploads/resume/{filename}"
    get_db().settings.update_one(
        {"_id": SITE_CONFIG_ID},
        {"$set": {"resumeUrl": url}},
        upsert=True,
    )

    return {"url": url}


@router.delete("/admin/upload/resume", dependencies=[Depends(require_admin)])
def delete_resume() -> dict[str, str]:
    resume_url = _resume_url()
    if resume_url.startswith("/uploads/resume/"):
        resume_name = resume_url.split("/uploads/resume/", 1)[1]
        (UPLOAD_RESUME_DIR / resume_name).unlink(missing_ok=True)

    get_db().settings.update_one(
        {"_id": SITE_CONFIG_ID},
        {"$set": {"resumeUrl": "/Rohan_Resume.pdf"}},
        upsert=True,
    )
    return {"message": "Resume deleted, fallback restored"}


@router.post("/admin/projects", dependencies=[Depends(require_admin)])
def create_project(payload: ProjectIn) -> dict[str, str]:
    get_db().projects.insert_one(payload.model_dump())
    return {"message": "Project created"}


@router.put("/admin/projects/{item_id}", dependencies=[Depends(require_admin)])
def update_project(item_id: str, payload: ProjectIn) -> dict[str, str]:
    result = get_db().projects.update_one(
        {"_id": ObjectId(item_id)}, {"$set": payload.model_dump()}
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated"}


@router.delete("/admin/projects/{item_id}", dependencies=[Depends(require_admin)])
def delete_project(item_id: str) -> dict[str, str]:
    result = get_db().projects.delete_one({"_id": ObjectId(item_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}


@router.post("/admin/experiences", dependencies=[Depends(require_admin)])
def create_experience(payload: ExperienceIn) -> dict[str, str]:
    get_db().experiences.insert_one(payload.model_dump())
    return {"message": "Experience created"}


@router.put("/admin/experiences/{item_id}", dependencies=[Depends(require_admin)])
def update_experience(item_id: str, payload: ExperienceIn) -> dict[str, str]:
    result = get_db().experiences.update_one(
        {"_id": ObjectId(item_id)}, {"$set": payload.model_dump()}
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience updated"}


@router.delete("/admin/experiences/{item_id}", dependencies=[Depends(require_admin)])
def delete_experience(item_id: str) -> dict[str, str]:
    result = get_db().experiences.delete_one({"_id": ObjectId(item_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted"}


@router.post("/admin/certifications", dependencies=[Depends(require_admin)])
def create_certification(payload: CertificationIn) -> dict[str, str]:
    get_db().certifications.insert_one(payload.model_dump())
    return {"message": "Certification created"}


@router.put("/admin/certifications/{item_id}", dependencies=[Depends(require_admin)])
def update_certification(item_id: str, payload: CertificationIn) -> dict[str, str]:
    result = get_db().certifications.update_one(
        {"_id": ObjectId(item_id)}, {"$set": payload.model_dump()}
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Certification updated"}


@router.delete("/admin/certifications/{item_id}", dependencies=[Depends(require_admin)])
def delete_certification(item_id: str) -> dict[str, str]:
    result = get_db().certifications.delete_one({"_id": ObjectId(item_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Certification deleted"}


@router.post("/admin/blogs", dependencies=[Depends(require_admin)])
def create_blog(payload: BlogIn) -> dict[str, str]:
    get_db().blogs.insert_one(payload.model_dump())
    return {"message": "Blog created"}


@router.put("/admin/blogs/{item_id}", dependencies=[Depends(require_admin)])
def update_blog(item_id: str, payload: BlogIn) -> dict[str, str]:
    result = get_db().blogs.update_one(
        {"_id": ObjectId(item_id)}, {"$set": payload.model_dump()}
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog updated"}


@router.delete("/admin/blogs/{item_id}", dependencies=[Depends(require_admin)])
def delete_blog(item_id: str) -> dict[str, str]:
    result = get_db().blogs.delete_one({"_id": ObjectId(item_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted"}


@router.post("/admin/bootstrap", dependencies=[Depends(require_admin)])
def bootstrap_content(payload: BootstrapPayload) -> dict[str, int]:
    db = get_db()
    imported_projects = 0
    imported_blogs = 0
    imported_experiences = 0
    imported_certifications = 0

    for project in payload.projects:
        result = db.projects.update_one(
            {"slug": project.slug},
            {"$set": project.model_dump()},
            upsert=True,
        )
        if result.upserted_id is not None or result.modified_count:
            imported_projects += 1

    for blog in payload.blogs:
        result = db.blogs.update_one(
            {"slug": blog.slug},
            {"$set": blog.model_dump()},
            upsert=True,
        )
        if result.upserted_id is not None or result.modified_count:
            imported_blogs += 1

    for experience in payload.experiences:
        db.experiences.insert_one(experience.model_dump())
        imported_experiences += 1

    for certification in payload.certifications:
        db.certifications.insert_one(certification.model_dump())
        imported_certifications += 1

    return {
        "projects": imported_projects,
        "blogs": imported_blogs,
        "experiences": imported_experiences,
        "certifications": imported_certifications,
    }


@router.post("/assistant/analyze")
async def assistant_analyze(payload: AssistantRequest) -> dict[str, str]:
    settings = get_settings()
    if not settings.xai_api_key:
        raise HTTPException(status_code=400, detail="XAI API key not configured")

    context = {
        "projects": _list("projects"),
        "experiences": _list("experiences", sort_key="startDate"),
        "certifications": _list("certifications", sort_key="issueDate"),
        "blogs": _list("blogs", sort_key="date"),
    }

    system_prompt = (
        "You are an assistant for a portfolio website. Answer using only the given portfolio data. "
        "If data is missing, say so clearly."
    )
    user_prompt = (
        f"Portfolio data:\n{context}\n\n"
        f"User question: {payload.prompt}\n\n"
        "Provide a concise, recruiter-friendly response."
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{settings.xai_base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.xai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.xai_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.3,
            },
        )

    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"xAI error: {response.text}")

    data = response.json()
    return {"response": data["choices"][0]["message"]["content"]}
