from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Email Settings
    MAIL_USERNAME: str = "your-email@gmail.com"
    MAIL_PASSWORD: str = "your-app-password"
    MAIL_FROM: str = "noreply@naverblogauto.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_TLS: bool = True
    MAIL_SSL: bool

    # Admin Settings
    ADMIN_EMAIL: str = "admin@naverblog.com"
    ADMIN_PASSWORD: str = "admin123"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int

    # Base URL for download links
    BASE_URL: str = "http://localhost:8000"

    # File paths
    DOWNLOAD_DIR: str = "static/downloads"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
