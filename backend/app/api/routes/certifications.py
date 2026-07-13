from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...core.deps import get_current_admin
from ...models.certification import Certification
from ...schemas.certification import CertificationCreate, CertificationUpdate, CertificationOut

router = APIRouter()


@router.get("/", response_model=List[CertificationOut])
def get_certifications(db: Session = Depends(get_db)):
    return db.query(Certification).order_by(Certification.order_index).all()


@router.post("/", response_model=CertificationOut)
def create_certification(
    cert: CertificationCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_cert = Certification(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert


@router.put("/{cert_id}", response_model=CertificationOut)
def update_certification(
    cert_id: int,
    cert: CertificationUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    for key, value in cert.model_dump().items():
        setattr(db_cert, key, value)
    db.commit()
    db.refresh(db_cert)
    return db_cert


@router.delete("/{cert_id}")
def delete_certification(
    cert_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin)
):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(db_cert)
    db.commit()
    return {"message": "Certification deleted successfully"}
