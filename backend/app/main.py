"""
Main Module - Point d'entrée FastAPI pour Enterprise Brain
Initialise l'app, intègre les routes et lance le serveur Uvicorn.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routes import router as graph_router
from .neo4j_client import close_driver

# ===== Lifecycle Events =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gère le cycle de vie de l'application.
    - Startup: rien à faire, Neo4j driver déjà initialisé
    - Shutdown: ferme le driver Neo4j
    """
    print("[INFO] Enterprise Brain backend démarré")
    yield
    print("[INFO] Fermeture du backend...")
    close_driver()


# ===== Instanciation FastAPI =====
app = FastAPI(
    title="Enterprise Brain API",
    description="Backend FastAPI pour Enterprise Brain - Graph Management",
    version="1.0.0",
    lifespan=lifespan
)

# ===== CORS Middleware =====
# Autorise les requêtes depuis Lovable UI et n8n
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # UI locale
        "http://localhost:8000",      # Backend local
        "https://lovable.dev",        # Lovable cloud (si applicable)
        "*"                            # TODO: À restreindre en production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Routes Integration =====
# Inclut les routes du graph avec préfixe /api
app.include_router(graph_router)


# ===== Root Endpoint =====
@app.get("/")
def root():
    """Endpoint racine pour vérifier que le backend est en ligne."""
    return {
        "name": "Enterprise Brain API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/health"
    }


# ===== Startup pour tests =====
if __name__ == "__main__":
    import uvicorn
    
    # Lance le serveur Uvicorn avec auto-reload pour développement
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

