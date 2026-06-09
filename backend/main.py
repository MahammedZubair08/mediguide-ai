import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings
from app.routes import chat, upload, emergency, core

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MediGuide AI API",
    description="Backend AI Clinical Assistant API for symptoms checking, report parsing, and triage routing.",
    version="1.0.0"
)

# CORS Setup
origins = settings.cors_origins
# Include localhost ports for developer friendliness by default
if "*" not in origins:
    origins.extend([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ])
    origins = list(set(origins))  # Remove duplicates

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(chat.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(core.router)

@app.get("/api/health", tags=["health"])
def health_check():
    """
    Returns API health status.
    """
    from app.services.gemini_service import has_key
    return {
        "status": "healthy",
        "gemini_api_configured": has_key,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting MediGuide AI API on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
