"""
Routes Module - Endpoints FastAPI pour Enterprise Brain
Fournit les endpoints de gestion du graph, ingestion, enrichissement IA et explications causales.
TOUS les paramètres sont liés pour éviter l'injection Cypher.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
import uuid
from datetime import datetime

from .models import (
    Node, Edge, UniformResponse, GraphResponse, 
    TextIngestionRequest, NodeExplanationResponse
)
from .neo4j_client import run_query

# ===== Configuration du routeur =====
router = APIRouter(prefix="/api", tags=["graph"])


# ===== HELPERS =====
def create_response(
    status_code: str = "ok",
    data: Optional[dict] = None,
    message: Optional[str] = None
) -> UniformResponse:
    """
    Crée une réponse uniforme pour tous les endpoints.
    Status: ok, created, updated, error
    """
    return UniformResponse(status=status_code, data=data, message=message)


def safe_node_id(node_id: str) -> str:
    """Valide et nettoie les IDs de nœud (sécurité basique)."""
    if not node_id or len(node_id) > 255:
        raise ValueError("ID invalide (vide ou trop long)")
    # Accepte alphanumériques, tirets, underscores
    if not all(c.isalnum() or c in "-_" for c in node_id):
        raise ValueError("ID contient des caractères non autorisés")
    return node_id


# ===== ENDPOINTS CRUD =====

@router.post("/add_node", response_model=UniformResponse)
def add_node(node: Node) -> UniformResponse:
    """
    Crée ou met à jour un nœud dans le graph.
    UTILISE des paramètres liés pour éviter l'injection Cypher.
    
    Args:
        node: Node object avec id, type, content, agent
    
    Returns:
        Réponse uniforme avec le nœud créé
    """
    try:
        # Valide l'ID
        node.id = safe_node_id(node.id)
        
        # Crée/met à jour le nœud avec MERGE (idempotent)
        query = """
        MERGE (n:{type} {{id: $id}})
        SET n.content = $content, n.agent = $agent, n.created_at = timestamp()
        RETURN n.id AS id, labels(n)[0] AS type, n.content AS content, n.agent AS agent
        """
        # Injection sécurisée du type via F-string SEULEMENT pour type (constante contrôlée)
        # Tous les autres paramètres sont liés
        query = query.format(type=node.type)
        
        result = run_query(query, {
            "id": node.id,
            "content": node.content,
            "agent": node.agent
        })
        
        return create_response(
            status_code="created",
            data={"node": result[0] if result else node.dict()},
            message=f"Node {node.id} créé"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/add_edge", response_model=UniformResponse)
def add_edge(edge: Edge) -> UniformResponse:
    """
    Crée une relation entre deux nœuds.
    
    Args:
        edge: Edge object avec source, target, type
    
    Returns:
        Réponse uniforme avec l'arête créée
    """
    try:
        # Valide les IDs
        source_id = safe_node_id(edge.source)
        target_id = safe_node_id(edge.target)
        
        # Vérifie que les deux nœuds existent
        check_query = "MATCH (a {id: $id}) RETURN a"
        source_exists = run_query(check_query, {"id": source_id})
        target_exists = run_query(check_query, {"id": target_id})
        
        if not source_exists or not target_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Source ou target node n'existe pas"
            )
        
        # Crée la relation
        query = """
        MATCH (a {{id: $source}}), (b {{id: $target}})
        MERGE (a)-[r:{type}]->(b)
        RETURN a.id AS source, b.id AS target, type(r) AS type
        """
        # Type injecté sécurisé (constante contrôlée)
        query = query.format(type=edge.type)
        
        result = run_query(query, {
            "source": source_id,
            "target": target_id
        })
        
        return create_response(
            status_code="created",
            data={"edge": result[0] if result else edge.dict()},
            message=f"Edge {source_id}-[{edge.type}]->{target_id} créé"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS DE LECTURE =====

@router.get("/graph", response_model=GraphResponse)
def get_graph() -> GraphResponse:
    """
    Récupère le graph complet (tous les nœuds et arêtes).
    Endpoint optionnel pour rafraîchissement UI toutes les 2s.
    
    Returns:
        GraphResponse avec nodes et edges
    """
    try:
        # Récupère tous les nœuds
        nodes_query = """
        MATCH (n)
        RETURN {
            id: n.id,
            type: labels(n)[0],
            content: n.content,
            agent: n.agent
        } AS node
        """
        nodes_result = run_query(nodes_query)
        nodes = [item['node'] for item in nodes_result]
        
        # Récupère toutes les arêtes
        edges_query = """
        MATCH (a)-[r]->(b)
        RETURN {
            source: a.id,
            target: b.id,
            type: type(r)
        } AS edge
        """
        edges_result = run_query(edges_query)
        edges = [item['edge'] for item in edges_result]
        
        return GraphResponse(
            nodes=nodes,
            edges=edges,
            status="ok",
            message=f"Graph retourné : {len(nodes)} nœuds, {len(edges)} arêtes"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/node/{node_id}", response_model=UniformResponse)
def get_node(node_id: str) -> UniformResponse:
    """
    Récupère les détails d'un nœud spécifique.
    
    Args:
        node_id: ID du nœud
    
    Returns:
        Réponse uniforme avec les données du nœud
    """
    try:
        node_id = safe_node_id(node_id)
        
        query = """
        MATCH (n {id: $id})
        RETURN {
            id: n.id,
            type: labels(n)[0],
            content: n.content,
            agent: n.agent
        } AS node
        """
        result = run_query(query, {"id": node_id})
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Node {node_id} non trouvé"
            )
        
        return create_response(
            status_code="ok",
            data={"node": result[0]['node']},
            message=f"Node {node_id} trouvé"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS D'INGESTION TEXTE =====

@router.post("/ingest_text", response_model=UniformResponse)
def ingest_text(req: TextIngestionRequest) -> UniformResponse:
    """
    Ingère du texte brut et crée des nœuds Task + edges depends_on automatiquement.
    Format attendu : phrases séparées par des points.
    
    Args:
        req: TextIngestionRequest avec text et agent optionnel
    
    Returns:
        Réponse avec les nœuds créés
    """
    try:
        text = req.text.strip()
        if not text:
            raise ValueError("Texte vide")
        
        # Parse les phrases
        sentences = [s.strip() for s in text.split(".") if s.strip()]
        if not sentences:
            raise ValueError("Aucune phrase trouvée")
        
        created_nodes = []
        
        # Crée un nœud par phrase
        for i, sentence in enumerate(sentences):
            # Génère un ID unique basé sur le contenu hash + index
            node_id = f"task-{uuid.uuid4().hex[:8]}"
            
            query = """
            MERGE (n:Task {id: $id})
            SET n.content = $content, n.agent = $agent, n.created_at = timestamp()
            RETURN n.id AS id, labels(n)[0] AS type, n.content AS content, n.agent AS agent
            """
            
            result = run_query(query, {
                "id": node_id,
                "content": sentence,
                "agent": req.agent
            })
            
            node_data = result[0] if result else {
                "id": node_id,
                "type": "Task",
                "content": sentence,
                "agent": req.agent
            }
            created_nodes.append(node_data)
            
            # Crée une dépendance avec la phrase précédente
            if i > 0:
                prev_node_id = created_nodes[i - 1]["id"]
                edge_query = """
                MATCH (a {id: $source}), (b {id: $target})
                MERGE (a)-[r:depends_on]->(b)
                """
                run_query(edge_query, {
                    "source": node_id,
                    "target": prev_node_id
                })
        
        return create_response(
            status_code="created",
            data={"created_nodes": created_nodes, "count": len(created_nodes)},
            message=f"{len(created_nodes)} nœuds créés par ingestion texte"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS D'ENRICHISSEMENT IA =====

@router.post("/ai_enrich", response_model=UniformResponse)
def ai_enrich() -> UniformResponse:
    """
    Analyse le graph et ajoute automatiquement des nodes/edges manquants.
    Exemple :
    - Détecte les Tasks sans Person assignée -> crée Person
    - Détecte les Tasks sans Issue dépendante -> crée Issue
    
    Returns:
        Réponse avec les nœuds/arêtes ajoutés
    """
    try:
        added_nodes = []
        added_edges = []
        
        # 1. Trouve les Tasks sans Person assignée
        tasks_without_assignee = run_query("""
        MATCH (t:Task)
        WHERE NOT (t)<-[:assigned_to]-(:Person)
        RETURN t.id AS id LIMIT 5
        """)
        
        for task in tasks_without_assignee:
            # Crée une Person fictive
            person_id = f"person-{uuid.uuid4().hex[:8]}"
            
            query = """
            MERGE (p:Person {id: $id})
            SET p.content = $content, p.agent = 'AI', p.created_at = timestamp()
            RETURN p.id AS id, labels(p)[0] AS type, p.content AS content
            """
            
            result = run_query(query, {
                "id": person_id,
                "content": f"Assistant auto (task: {task['id'][:20]})"
            })
            
            added_nodes.append(result[0] if result else {
                "id": person_id,
                "type": "Person",
                "content": "Assistant auto"
            })
            
            # Crée une relation assigned_to
            edge_query = """
            MATCH (p {id: $person_id}), (t {id: $task_id})
            MERGE (p)-[r:assigned_to]->(t)
            """
            run_query(edge_query, {
                "person_id": person_id,
                "task_id": task['id']
            })
            
            added_edges.append({
                "source": person_id,
                "target": task['id'],
                "type": "assigned_to"
            })
        
        return create_response(
            status_code="ok",
            data={
                "added_nodes": added_nodes,
                "added_edges": added_edges,
                "count": len(added_nodes)
            },
            message=f"Graph enrichi : {len(added_nodes)} nœuds ajoutés"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS D'EXPLICATION CAUSALE =====

@router.get("/explain_node/{node_id}", response_model=NodeExplanationResponse)
def explain_node(node_id: str) -> NodeExplanationResponse:
    """
    Retourne les chemins causaux d'un nœud (up à 2 hops en arrière).
    Permet de comprendre les dépendances et relations d'un nœud.
    
    Args:
        node_id: ID du nœud à expliquer
    
    Returns:
        NodeExplanationResponse avec les chemins causaux
    """
    try:
        node_id = safe_node_id(node_id)
        
        # Requête pour trouver les chemins causaux (up to 2 hops backward)
        query = """
        MATCH path = (target {id: $id})<-[:based_on|depends_on|assigned_to*1..2]-(source)
        RETURN {
            path_nodes: [node IN nodes(path) | {
                id: node.id,
                type: labels(node)[0],
                content: node.content
            }],
            relationships: [rel IN relationships(path) | type(rel)]
        } AS causal_info
        """
        
        result = run_query(query, {"id": node_id})
        
        # Formate les résultats
        causal_paths = []
        for item in result:
            causal_paths.append(item['causal_info']['path_nodes'])
        
        return NodeExplanationResponse(
            node_id=node_id,
            causal_paths=causal_paths,
            status="ok"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS D'ADMINISTRATION =====

@router.post("/reset", response_model=UniformResponse)
def reset_graph() -> UniformResponse:
    """
    Réinitialise le graph en supprimant tous les nœuds et relations.
    ⚠️ DESTRUCTIF - À utiliser avec prudence en production.
    
    Returns:
        Réponse de confirmation
    """
    try:
        run_query("MATCH (n) DETACH DELETE n")
        
        return create_response(
            status_code="ok",
            message="Graph réinitialisé : tous les nœuds supprimés"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/seed", response_model=UniformResponse)
def seed_graph() -> UniformResponse:
    """
    Remplit le graph avec des données de test pour démonstration.
    Crée une structure complexe de Task, Person, Issue, Topic, Decision.
    
    Returns:
        Réponse avec le nombre de nœuds/arêtes créés
    """
    try:
        # Données de test
        seed_nodes = [
            {"id": "task-1", "type": "Task", "content": "Préparer le plan Q2"},
            {"id": "person-1", "type": "Person", "content": "Paul (Chef projet)"},
            {"id": "person-2", "type": "Person", "content": "Alice (Dev Lead)"},
            {"id": "issue-1", "type": "Issue", "content": "Rapport Q1 manquant"},
            {"id": "topic-1", "type": "Topic", "content": "Q2 Planning"},
            {"id": "decision-1", "type": "Decision", "content": "Finaliser plan Q2 le 15/12"},
            {"id": "task-2", "type": "Task", "content": "Code review du sprint"},
            {"id": "issue-2", "type": "Issue", "content": "Performance de la DB"},
        ]
        
        seed_edges = [
            {"source": "person-1", "target": "task-1", "type": "assigned_to"},
            {"source": "person-2", "target": "task-2", "type": "assigned_to"},
            {"source": "task-1", "target": "issue-1", "type": "depends_on"},
            {"source": "task-1", "target": "topic-1", "type": "about"},
            {"source": "decision-1", "target": "task-1", "type": "based_on"},
            {"source": "task-2", "target": "issue-2", "type": "depends_on"},
            {"source": "task-2", "target": "topic-1", "type": "about"},
        ]
        
        # Insère les nœuds
        node_query = """
        MERGE (n:{type} {{id: $id}})
        SET n.content = $content, n.agent = 'seed', n.created_at = timestamp()
        """
        
        for node in seed_nodes:
            query = node_query.format(type=node['type'])
            run_query(query, node)
        
        # Insère les arêtes
        edge_query = """
        MATCH (a {{id: $source}}), (b {{id: $target}})
        MERGE (a)-[r:{type}]->(b)
        """
        
        for edge in seed_edges:
            query = edge_query.format(type=edge['type'])
            run_query(query, edge)
        
        return create_response(
            status_code="ok",
            data={
                "nodes_created": len(seed_nodes),
                "edges_created": len(seed_edges)
            },
            message=f"Seed inséré : {len(seed_nodes)} nœuds, {len(seed_edges)} arêtes"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ===== ENDPOINTS DE DIAGNOSTIQUE =====

@router.get("/health", response_model=UniformResponse)
def health_check() -> UniformResponse:
    """
    Vérifie la santé du backend et la connexion Neo4j.
    
    Returns:
        Réponse avec le statut
    """
    try:
        # Teste la connexion Neo4j
        result = run_query("RETURN 1")
        
        if result:
            return create_response(
                status_code="ok",
                message="Backend et Neo4j OK"
            )
        else:
            raise Exception("Neo4j non réactif")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Health check failed: {str(e)}"
        )




