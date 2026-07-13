from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...models.blog import Blog
from ...schemas.blog import BlogCreate, BlogUpdate, BlogOut

router = APIRouter()


@router.get("/", response_model=List[BlogOut])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).filter(Blog.published == 1).order_by(Blog.date.desc()).all()


@router.get("/all", response_model=List[BlogOut])
def get_all_blogs(db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    return db.query(Blog).order_by(Blog.date.desc()).all()


@router.get("/{slug}", response_model=BlogOut)
def get_blog(slug: str, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.slug == slug, Blog.published == 1).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@router.post("/", response_model=BlogOut)
def create_blog(
    blog: BlogCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    existing = db.query(Blog).filter(Blog.slug == blog.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    db_blog = Blog(**blog.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog


@router.put("/{blog_id}", response_model=BlogOut)
def update_blog(
    blog_id: int,
    blog: BlogUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    for key, value in blog.model_dump().items():
        setattr(db_blog, key, value)
    db.commit()
    db.refresh(db_blog)
    return db_blog


@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(db_blog)
    db.commit()
    return {"message": "Blog deleted successfully"}
