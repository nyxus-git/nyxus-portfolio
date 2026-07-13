from pydantic import BaseModel
from typing import List, Optional


class CertificationBase(BaseModel):
    name: str
    issuing_organization: str
    issue_date: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    skills: List[str] = []
    image_url: Optional[str] = None
    order_index: int = 0


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(CertificationBase):
    pass


class CertificationOut(CertificationBase):
    id: int

    class Config:
        from_attributes = True
