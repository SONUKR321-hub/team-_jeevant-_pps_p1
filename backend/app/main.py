from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .api.routes.migrants import router as migrants_router
from .api.routes.encounters import router as encounters_router
from .api.routes.immunizations import router as immunizations_router
from .api.routes.surveillance import router as surveillance_router

app = FastAPI(title=settings.app_name)

# CORS (dev defaults). Tighten in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/", tags=["meta"])
def root() -> dict:
    return {"service": settings.app_name, "status": "ok"}


@app.get("/healthz", tags=["meta"])
def healthz() -> dict:
    return {"status": "healthy"}


# API Routers
app.include_router(migrants_router, prefix="/api/v1")
app.include_router(encounters_router, prefix="/api/v1")
app.include_router(immunizations_router, prefix="/api/v1")
app.include_router(surveillance_router, prefix="/api/v1")
