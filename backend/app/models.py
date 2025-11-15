"""
Models Module - Définition des structures de données avec Pydantic
Assure la validation des types et sérialisation JSON.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Node(BaseModel):
    """
    Représente un nœud dans le graph Neo4j.
    Supporte Task, Person, Issue, Topic, Decision, etc.
    """
    id: str = Field(..., description="Identifiant unique du nœud")
    type: str = Field(..., description="Type du nœud (Task, Person, Issue, Topic, Decision)")
    content: str = Field(..., description="Contenu/description du nœud")
    agent: Optional[str] = Field(default="user", description="Source du nœud (user, AI, seed)")
    metadata: Optional[dict] = Field(default_factory=dict, description="Métadonnées additionnelles")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "task-1",
                "type": "Task",
                "content": "Préparer le plan Q2",
                "agent": "AI",
                "metadata": {"priority": "high"}
            }
        }


class Edge(BaseModel):
    """
    Représente une arête (relation) entre deux nœuds.
    """
    source: str = Field(..., description="ID du nœud source")
    target: str = Field(..., description="ID du nœud cible")
    type: str = Field(..., description="Type de relation (depends_on, assigned_to, about, based_on)")
    metadata: Optional[dict] = Field(default_factory=dict, description="Métadonnées additionnelles")
    
    class Config:
        json_schema_extra = {
            "example": {
                "source": "person-1",
                "target": "task-1",
                "type": "assigned_to",
                "metadata": {}
            }
        }


class GraphResponse(BaseModel):
    """
    Réponse uniforme pour retourner un graph complet.
    """
    nodes: List[dict] = Field(default_factory=list, description="Liste des nœuds")
    edges: List[dict] = Field(default_factory=list, description="Liste des arêtes")
    status: str = Field(default="ok", description="Statut de la requête")
    message: Optional[str] = Field(default=None, description="Message optionnel")


class UniformResponse(BaseModel):
    """
    Réponse uniforme pour toutes les requêtes.
    Format : {"status": "ok", "data": {...}, "message": "..."}
    """
    status: str = Field(..., description="ok, error, created, updated")
    data: Optional[dict] = Field(default=None, description="Données retournées")
    message: Optional[str] = Field(default=None, description="Message optionnel")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "data": {"node": {"id": "task-1", "type": "Task"}},
                "message": "Node créé avec succès"
            }
        }


class TextIngestionRequest(BaseModel):
    """
    Requête pour ingestion de texte brut.
    """
    text: str = Field(..., description="Texte à ingérer")
    agent: Optional[str] = Field(default="AI", description="Source de l'ingestion")


class NodeExplanationResponse(BaseModel):
    """
    Réponse pour l'explication causale d'un nœud.
    """
    node_id: str = Field(..., description="ID du nœud expliqué")
    causal_paths: List[List[dict]] = Field(default_factory=list, description="Chemins causaux")
    status: str = Field(default="ok", description="Statut")

