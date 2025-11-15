"""
Neo4j Client Module - Gestion sécurisée des requêtes à Neo4j
Fournit une interface simple pour exécuter des requêtes avec paramètres et gestion erreurs.
"""

from neo4j import GraphDatabase, Session
from typing import Any, Dict, List, Optional
import os

# Configuration de la connexion Neo4j
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "testpassword")

# Instanciation du driver
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


def run_query(
    query: str, 
    parameters: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Exécute une requête Cypher de manière sécurisée avec paramètres liés.
    
    Args:
        query: Requête Cypher avec placeholders ($param_name)
        parameters: Dictionnaire des paramètres
    
    Returns:
        Liste des résultats sous forme de dictionnaires
    
    Raises:
        Exception: Levée en cas d'erreur Neo4j
    """
    try:
        with driver.session() as session:
            # Utilise une transaction pour cohérence
            result = session.run(query, parameters or {})
            return result.data()
    except Exception as e:
        # Log l'erreur et propage
        print(f"[Neo4j Error] {str(e)}")
        raise


def run_transaction(callback) -> Any:
    """
    Exécute un callback dans une transaction.
    
    Args:
        callback: Fonction prenant une Session en paramètre
    
    Returns:
        Résultat retourné par le callback
    """
    try:
        with driver.session() as session:
            return session.execute_write(callback)
    except Exception as e:
        print(f"[Neo4j Transaction Error] {str(e)}")
        raise


def close_driver():
    """Ferme la connexion au driver Neo4j."""
    if driver:
        driver.close()
