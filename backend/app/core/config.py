from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_PATH, env_file_encoding="utf-8", extra="ignore"
    )

    mongodb_uri: str
    mongodb_db_name: str = "nyxus_portfolio"
    admin_username: str = "admin"
    admin_password: str = ""
    admin_token: str = ""
    xai_api_key: str = ""
    xai_base_url: str = "https://api.x.ai/v1"
    xai_model: str = "grok-3-mini"


@lru_cache
def get_settings() -> Settings:
    return Settings()
