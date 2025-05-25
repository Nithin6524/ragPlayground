from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    jina_api_key: str
    groq_api_key: str
    qdrant_url: str
    qdrant_api_key: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()