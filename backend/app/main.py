from app.api.routes.content import router as content_router
from app.core.database import close_mongo_connection, connect_to_mongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nyxus Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    connect_to_mongo()


@app.on_event("shutdown")
def on_shutdown() -> None:
    close_mongo_connection()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "service": "nyxus-portfolio-backend"}


app.include_router(content_router, prefix="/api", tags=["content"])
