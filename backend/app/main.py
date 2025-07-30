# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

# --- Create the FastAPI app instance ---
# Simple setup, no custom OpenAPI extras for security schemes here.
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # Keep default docs for simplicity. We'll fix the projects.py import issue.
    docs_url="/docs",
    redoc_url="/redoc"
)


# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

origins = [
    "http://localhost:3000",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1")
# Include the main API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Basic root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Nyxus Portfolio API"}

# To run the server locally:
# 1. Activate your virtual environment: source venv/bin/activate (Linux/macOS) or venv\Scripts\activate (Windows)
# 2. Navigate to the backend directory
# 3. Run: uvicorn app.main:app --reload
