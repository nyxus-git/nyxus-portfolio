from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load .env file so DATABASE_URL and other secrets are available locally
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
except ImportError:
    pass

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Build connect_args depending on driver
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
elif "pg8000" in DATABASE_URL:
    # pg8000 needs an ssl_context object, not ssl=True
    import ssl as _ssl
    _ssl_ctx = _ssl.create_default_context()
    connect_args = {"ssl_context": _ssl_ctx}
else:
    # psycopg2 / asyncpg — sslmode is passed as query param in URL
    connect_args = {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,     # auto-reconnect on stale connections
    pool_recycle=300,       # recycle connections every 5 min (Neon idle timeout)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
