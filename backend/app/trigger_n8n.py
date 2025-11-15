"""
Test Suite - Enterprise Brain Backend
Tests unitaires et d'intégration pour valider les endpoints.
"""

import pytest
import requests
import json
from fastapi.testclient import TestClient

# Configure le client test FastAPI
from app.main import app

client = TestClient(app)


# ===== FIXTURES =====

@pytest.fixture(autouse=True)
def reset_graph():
    """Réinitialise le graph avant chaque test."""
    response = client.post("/api/reset")
    assert response.status_code == 200
    yield
    # Cleanup après chaque test
    client.post("/api/reset")


# ===== TESTS D'HEALTH =====

def test_root_endpoint():
    """Teste l'endpoint racine."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Enterprise Brain API"
    assert data["status"] == "running"


def test_health_check():
    """Teste l'endpoint health check."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


# ===== TESTS CRUD =====

def test_add_node_success():
    """Teste l'ajout d'un nœud valide."""
    payload = {
        "id": "task-1",
        "type": "Task",
        "content": "Test task",
        "agent": "test"
    }
    response = client.post("/api/add_node", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "created"
    assert data["data"]["node"]["id"] == "task-1"


def test_add_edge_success():
    """Teste l'ajout d'une arête valide."""
    # Créer deux nœuds d'abord
    client.post("/api/add_node", json={
        "id": "node-1",
        "type": "Task",
        "content": "First",
        "agent": "test"
    })
    client.post("/api/add_node", json={
        "id": "node-2",
        "type": "Person",
        "content": "Second",
        "agent": "test"
    })
    
    # Créer l'arête
    payload = {
        "source": "node-1",
        "target": "node-2",
        "type": "depends_on"
    }
    response = client.post("/api/add_edge", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "created"


def test_get_graph():
    """Teste la récupération du graph."""
    response = client.get("/api/graph")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "nodes" in data
    assert "edges" in data


def test_seed_graph():
    """Teste l'insertion des données de seed."""
    response = client.post("/api/seed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["data"]["nodes_created"] > 0


def test_reset_graph():
    """Teste la réinitialisation du graph."""
    response = client.post("/api/reset")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_ingest_text():
    """Teste l'ingestion de texte."""
    payload = {
        "text": "Préparer plan Q3. Assigner à Alice."
    }
    response = client.post("/api/ingest_text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "created"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
