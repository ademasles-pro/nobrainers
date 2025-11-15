"""
Enterprise Brain Backend Package
FastAPI application for graph management with Neo4j

Main modules:
- main: FastAPI app initialization
- routes: API endpoints
- models: Pydantic data models
- neo4j_client: Neo4j database client
"""

from app.main import app

__version__ = "1.0.0"
__title__ = "Enterprise Brain API"
__description__ = "Graph management system for Enterprise Brain"

__all__ = ["app"]
