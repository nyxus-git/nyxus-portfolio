# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # New import for static files
from app.api.v1.api import api_router
from app.core.config import settings
import os # New import

# Define the path to your static files (e.g., where project images are stored)
# This assumes your static folder is in the same directory as main.py
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True) # Ensure the static directory exists

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ✅ Define allowed frontend domains
origins = [
    "http://localhost:3000",  # for local dev
    "https://nyxus-portfolio.vercel.app",  # ✅ your live frontend
]

# ✅ Add CORS middleware only once
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount static files directory
# Requests to /static/... will serve files from the STATIC_DIR
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ✅ Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Nyxus Portfolio API"}