from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...models.experience import Experience
from ...schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceOut

router = APIRouter()


@router.get("/", response_model=List[ExperienceOut])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order_index).all()


@router.post("/", response_model=ExperienceOut)
def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_exp = Experience(**experience.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp


@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(
    exp_id: int,
    experience: ExperienceUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in experience.model_dump().items():
        setattr(db_exp, key, value)
    db.commit()
    db.refresh(db_exp)
    return db_exp


@router.delete("/{exp_id}")
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(db_exp)
    db.commit()
    return {"message": "Experience deleted successfully"}
