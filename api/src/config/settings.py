"""
Configuration settings for the Physical AI Chatbot API.
Loads configuration from environment variables.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Gemini API Configuration
    gemini_api_key: str
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai"
    chat_model: str = "gemini-2.0-flash"

    # Qdrant Configuration
    qdrant_url: str
    qdrant_api_key: str
    collection_name: str = "textbook_content"

    # FastEmbed Configuration
    embedding_model: str = "BAAI/bge-small-en-v1.5"  # 384-dimensional embeddings

    # Authentication Configuration
    database_url: str
    jwt_secret_key: str

    # CORS Configuration
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
