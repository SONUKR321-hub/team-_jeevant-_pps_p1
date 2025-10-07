from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Kerala Migrant Health Backend"
    environment: str = "development"
    database_url: str = (
        "postgresql+psycopg2://postgres:postgres@localhost:5432/migrant_health"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
