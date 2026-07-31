from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run database migrations on startup
    try:
        import os
        from alembic.config import Config
        from alembic import command
        
        # Ensure we look in the correct directory for alembic.ini
        base_dir = os.path.dirname(os.path.abspath(__file__))
        ini_path = os.path.join(base_dir, "alembic.ini")
        if not os.path.exists(ini_path):
            # Fallback if working directory is already backend
            ini_path = "alembic.ini"
            
        alembic_cfg = Config(ini_path)
        # Dynamically set the migration script location directory relative to base_dir
        script_dir = os.path.join(base_dir, "alembic")
        alembic_cfg.set_main_option("script_location", script_dir)
        
        command.upgrade(alembic_cfg, "head")
        print("Database migrated successfully on startup.")
    except Exception as e:
        print(f"Error running migrations on startup: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost(:\d+)?|http://127\.0\.0\.1(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "api_docs": f"{settings.API_V1_STR}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
