# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Optional, Any
from pydantic import AnyHttpUrl, validator, PostgresDsn, model_validator
from pydantic.networks import HttpUrl
import cloudinary # <-- This import is crucial for cloudinary.config()

class Settings(BaseSettings):
    # Pydantic V2 way to configure BaseSettings
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore' # This will ignore any environment variables not explicitly defined here
                       # but still allow them to be present in .env without causing errors.
    )

    PROJECT_NAME: str = "Nyxus Portfolio API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "7b4f7a5d4b4352f2ad984321da464f9eae2abc6276ecb34d1bffefdbc1fc2ee9"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # Database
    DATABASE_URL: Optional[PostgresDsn] = None
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # Cloudinary Configuration
    CLOUDINARY_URL: str # This tells Pydantic to expect a CLOUDINARY_URL from the environment

    # --- CORRECTED VALIDATOR FOR PYDANTIC V2 ---
    @model_validator(mode="before")
    @classmethod
    def assemble_db_connection(cls, values: dict[str, Any]) -> dict[str, Any]:
        if values.get("SQLALCHEMY_DATABASE_URI"):
            return values

        database_url = values.get("DATABASE_URL")
        if database_url:
            values["SQLALCHEMY_DATABASE_URI"] = str(database_url)
        else:
            server = values.get("POSTGRES_SERVER")
            user = values.get("POSTGRES_USER")
            password = values.get("POSTGRES_PASSWORD")
            db = values.get("POSTGRES_DB")

            if all([server, user, password, db]):
                values["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{user}:{password}@{server}/{db}"

        return values
    # --- END CORRECTED VALIDATOR ---

    # --- THIS METHOD TO CONFIGURE CLOUDINARY ---
    def configure_cloudinary(self):
        """
        Configures the Cloudinary SDK using the CLOUDINARY_URL loaded from settings.
        """
        if self.CLOUDINARY_URL:
            # Parse the CLOUDINARY_URL string into its components
            try:
                # Example URL: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
                parts = self.CLOUDINARY_URL.split('@')
                cloud_name = parts[1]
                api_key_secret = parts[0].split('//')[1]
                api_key = api_key_secret.split(':')[0]
                api_secret = api_key_secret.split(':')[1]

                cloudinary.config(
                    cloud_name=cloud_name,
                    api_key=api_key,
                    api_secret=api_secret
                )
                print("Cloudinary configured successfully from CLOUDINARY_URL.")
            except IndexError as e:
                print(f"Error parsing CLOUDINARY_URL: {self.CLOUDINARY_URL}. Please check its format. Error: {e}")
            except Exception as e:
                print(f"An unexpected error occurred during Cloudinary configuration: {e}")

settings = Settings()
