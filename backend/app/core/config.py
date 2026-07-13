from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    admin_username: str = "admin"
    admin_password: str = "nyxus@admin2024"
    secret_key: str = "nyxus-super-secret-key-change-in-production-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
