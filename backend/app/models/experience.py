from sqlalchemy import Column, Integer, String, Text, JSON
from ..core.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    company_url = Column(String(500), nullable=True)
    role_type = Column(String(100), nullable=True)  # Full-Time, Internship, Contract, etc.
    location = Column(String(255), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    highlights = Column(JSON, default=[])          # List of key achievement strings
    skills = Column(JSON, default=[])              # List of tech stack strings
    projects = Column(JSON, default=[])            # List of rich company project dictionaries
    order_index = Column(Integer, default=0)
