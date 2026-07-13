from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...models.skill import Skill, About
from ...schemas.skill import SkillCreate, SkillUpdate, SkillOut, AboutCreate, AboutUpdate, AboutOut

router = APIRouter()


# --- Skills ---
@router.get("/skills", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.category, Skill.order_index).all()


@router.post("/skills", response_model=SkillOut)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.put("/skills/{skill_id}", response_model=SkillOut)
def update_skill(skill_id: int, skill: SkillUpdate, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill.model_dump().items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted"}


# --- About ---
@router.get("/about", response_model=AboutOut)
def get_about(db: Session = Depends(get_db)):
    about = db.query(About).first()
    if not about:
        raise HTTPException(status_code=404, detail="About info not found")
    return about


@router.put("/about", response_model=AboutOut)
def update_about(about: AboutUpdate, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    db_about = db.query(About).first()
    if not db_about:
        # Create if doesn't exist
        db_about = About(**about.model_dump())
        db.add(db_about)
    else:
        for key, value in about.model_dump().items():
            setattr(db_about, key, value)
    db.commit()
    db.refresh(db_about)
    return db_about
