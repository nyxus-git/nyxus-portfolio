# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.core.config import settings # <-- Ensure this import is here
import os
import cloudinary # <-- Keep this import

# Define the path to your static files (e.g., where project images are stored)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True) # Ensure the static directory exists

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ✅ Define allowed frontend domains using settings
# This list is dynamically built from your settings.BACKEND_CORS_ORIGINS
# No need to hardcode 'origins' list here, use settings directly.

# ✅ Add CORS middleware only once
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS], # <-- Use settings here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount static files directory
# Requests to /static/... will serve files from the STATIC_DIR
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- Configure Cloudinary using the settings object ---
# This relies on CLOUDINARY_URL being correctly set in your .env
# and the configure_cloudinary method in app.core.config.py
settings.configure_cloudinary() # <-- THIS LINE SHOULD BE PRESENT AND UNCOMMENTED
# --- End Cloudinary Configuration ---

# ✅ Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Nyxus Portfolio API"}
