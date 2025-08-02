# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.core.config import settings
import os
import cloudinary

# Define the path to your static files (e.g., where project images are stored)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True) # Ensure the static directory exists

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# --- TEMPORARY: AGGRESSIVE CORS FOR DEBUGGING ---
# This allows ALL origins. If this works, the issue is with specific origin matching.
# DO NOT USE IN PRODUCTION without understanding the security implications.
allowed_origins_for_cors = ["*"] # <-- TEMPORARY: Allow all origins
# --- END TEMPORARY AGGRESSIVE CORS ---

# ✅ Add CORS middleware only once
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_for_cors,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount static files directory
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- Configure Cloudinary using the settings object ---
settings.configure_cloudinary()
# --- End Cloudinary Configuration ---

# ✅ Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Nyxus Portfolio API"}
