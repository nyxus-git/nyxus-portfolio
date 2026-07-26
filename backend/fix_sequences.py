import os
from sqlalchemy import create_engine, text

NEON_URL = "postgresql+pg8000://neondb_owner:npg_USF9YN5xCvcd@ep-wandering-wildflower-ax1dlxop.c-4.us-east-2.aws.neon.tech/neondb"
import ssl
ssl_context = ssl.create_default_context()
engine = create_engine(NEON_URL, connect_args={"ssl_context": ssl_context}, isolation_level="AUTOCOMMIT")

tables = ["skills", "projects", "experiences", "certifications", "blogs", "about"]

with engine.connect() as conn:
    for table in tables:
        try:
            query = text(f"SELECT setval('{table}_id_seq', COALESCE((SELECT MAX(id)+1 FROM {table}), 1), false);")
            conn.execute(query)
            print(f"Successfully reset sequence for {table}")
        except Exception as e:
            print(f"Error resetting {table}: {e}")
