import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.skill import Skill

NEON_URL = "postgresql+pg8000://neondb_owner:npg_USF9YN5xCvcd@ep-wandering-wildflower-ax1dlxop.c-4.us-east-2.aws.neon.tech/neondb"
import ssl
ssl_context = ssl.create_default_context()
engine = create_engine(NEON_URL, connect_args={"ssl_context": ssl_context})
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    new_skill = Skill(name="Test", level=50, category="CLOUD & MLOPS", order_index=0)
    db.add(new_skill)
    db.commit()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
