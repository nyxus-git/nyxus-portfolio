import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Local SQLite connection
SQLITE_URL = "sqlite:///./portfolio.db"
sqlite_engine = create_engine(SQLITE_URL)
SqliteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SqliteSession()

# Neon Postgres connection (using pg8000 driver)
NEON_URL = "postgresql+pg8000://neondb_owner:npg_USF9YN5xCvcd@ep-wandering-wildflower-ax1dlxop.c-4.us-east-2.aws.neon.tech/neondb"
import ssl
ssl_context = ssl.create_default_context()
neon_engine = create_engine(NEON_URL, connect_args={"ssl_context": ssl_context})
NeonSession = sessionmaker(bind=neon_engine)
neon_session = NeonSession()

# Import models
from app.models.project import Project
from app.models.experience import Experience
from app.models.certification import Certification
from app.models.blog import Blog
from app.models.skill import Skill, About
from app.core.database import Base

def migrate():
    print("Creating tables in Neon PostgreSQL...")
    Base.metadata.create_all(bind=neon_engine)
    
    models_to_migrate = [Project, Experience, Certification, Blog, Skill, About]
    
    for model in models_to_migrate:
        model_name = model.__name__
        print(f"Migrating {model_name}...")
        
        # Read from SQLite
        records = sqlite_session.query(model).all()
        print(f"  Found {len(records)} records in SQLite.")
        
        # Clear existing in Postgres (if any) to prevent duplication during testing
        neon_session.query(model).delete()
        
        # Insert into Postgres
        for record in records:
            # Create a detached copy of the object
            neon_session.merge(record)
            
        neon_session.commit()
        print(f"  Successfully migrated {model_name}.")

    print("Migration complete!")

if __name__ == "__main__":
    migrate()
