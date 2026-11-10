from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, LargeBinary, String
from ..core.database import Base


class UploadedMedia(Base):
    __tablename__ = "uploaded_media"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), unique=True, index=True, nullable=False)
    content_type = Column(String(120), nullable=False, default="application/octet-stream")
    data = Column(LargeBinary, nullable=False)
    bytes = Column(Integer, nullable=False, default=0)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

