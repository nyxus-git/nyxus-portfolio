from sqlalchemy import Column, Integer, String, JSON
from ..core.database import Base


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    issuing_organization = Column(String(255), nullable=False)
    issue_date = Column(String(20), nullable=False)
    credential_id = Column(String(255), nullable=True)
    credential_url = Column(String(500), nullable=True)
    skills = Column(JSON, default=[])
    image_url = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0)
