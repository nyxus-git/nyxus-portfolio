from app.core.config import get_settings
from pymongo import MongoClient
from pymongo.database import Database

client: MongoClient | None = None
_db: Database | None = None


def connect_to_mongo() -> None:
    global client, _db
    settings = get_settings()
    client = MongoClient(settings.mongodb_uri)
    _db = client[settings.mongodb_db_name]

    _db.projects.create_index("slug", unique=True)
    _db.blogs.create_index("slug", unique=True)


def get_db() -> Database:
    if _db is None:
        raise RuntimeError("Database connection is not initialized")
    return _db


def close_mongo_connection() -> None:
    global client, _db
    if client is not None:
        client.close()
    client = None
    _db = None
