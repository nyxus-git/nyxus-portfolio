# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# --- FIX: Import Base from the dedicated base file ---
# Import Base from the dedicated file to prevent circular imports
from app.db.base import Base # <-- Correct import
# --- END FIX ---
from app.core.config import settings

# --- IMPORTANT: Import all models HERE to ensure they are known to SQLAlchemy ---
# This is crucial for Alembic to detect them later.
# Make sure the path is correct relative to this file.
from app import models # Import the models package
# --- END IMPORTANT ---

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
