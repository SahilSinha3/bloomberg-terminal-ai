import os

class Settings:
    APP_NAME: str = "Bloomberg Terminal AI Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/bloomberg_terminal")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    FMP_API_KEY: str = os.getenv("FMP_API_KEY", "")
    POLYGON_API_KEY: str = os.getenv("POLYGON_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SEC_USER_AGENT: str = os.getenv("SEC_USER_AGENT", "BloombergTerminalAI admin@bloomberg-ai.dev")

settings = Settings()
