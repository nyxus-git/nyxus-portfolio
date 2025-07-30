# backend/app/core/config.py
from pydantic_settings import BaseSettings # <-- Correct import for BaseSettings in Pydantic v2
from typing import List, Union, Optional, Any
from pydantic import AnyHttpUrl, validator, PostgresDsn, model_validator # <-- Import model_validator
from pydantic.networks import HttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nyxus Portfolio API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "08a5fa8fa17aa3142e454d3fafb03e4601f91ae2428eb72a10f4213c381e11df"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [] 

    # Database
    DATABASE_URL: Optional[PostgresDsn] = None
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # --- CORRECTED VALIDATOR FOR PYDANTIC V2 ---
    # Use model_validator with mode="before" and make it a classmethod
    @model_validator(mode="before")
    @classmethod
    def assemble_db_connection(cls, values: dict[str, Any]) -> dict[str, Any]:
        # Check if SQLALCHEMY_DATABASE_URI is already provided (e.g., via DATABASE_URL)
        if values.get("SQLALCHEMY_DATABASE_URI"):
            return values
        
        # If not, try to construct it from DATABASE_URL first
        # --- FIX 1: Get DATABASE_URL from values, not a hardcoded string ---
        database_url = values.get("DATABASE_URL") # <-- This line was incorrect
        if database_url:
            values["SQLALCHEMY_DATABASE_URI"] = str(database_url)
        else:
            # If DATABASE_URL is also not provided, try individual parts
            server = values.get("POSTGRES_SERVER")
            user = values.get("POSTGRES_USER")
            password = values.get("POSTGRES_PASSWORD")
            db = values.get("POSTGRES_DB")
            
            if all([server, user, password, db]):
                values["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{user}:{password}@{server}/{db}"
        
        return values
    # --- END CORRECTED VALIDATOR ---

    class Config:
        case_sensitive = True
        env_file = ".env" # Load variables from .env file

settings = Settings()
