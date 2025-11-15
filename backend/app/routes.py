from fastapi import APIRouter, Body
from .models import Node, Edge
from .neo4j_client import run_query

router = APIRouter()

# ---- CRUD de base ----
@router.post("/add_node")
def add_node(node: Node):
    query = f"""
    MERGE (n:{node.type} {{id: $id}})
    SET n.content = $content, n.agent = $agent
    """
    run_query(query, node.dict())
    return {"status": "ok", "node": node}

@router.post("/add_edge")
def add_edge(edge: Edge):
    query = f"""
    MATCH (a {{id: $source}}), (b {{id: $target}})
    MERGE (a)-[r:{edge.type}]->(b)
    """
    run_query(query, edge.dict())
    return {"status": "ok", "edge": edge}

@router.get("/graph")
def get_graph():
    nodes = run_query("MATCH (n) RETURN n.id AS id, labels(n)[0] AS type, n.content AS content, n.agent AS agent")
    edges = run_query("MATCH (a)-[r]->(b) RETURN a.id AS source, b.id AS target, type(r) AS type")
    return {"nodes": nodes, "edges": edges}

@router.post("/reset")
def reset_graph():
    run_query("MATCH (n) DETACH DELETE n")
    return {"status": "graph cleared"}


@router.post("/seed")
def seed_graph():
    nodes = [
        {"id": "task-1", "type": "Task", "content": "Préparer le plan Q2", "agent": "seed"},
        {"id": "person-1", "type": "Person", "content": "Paul", "agent": "seed"},
        {"id": "issue-1", "type": "Issue", "content": "Rapport Q1 manquant", "agent": "seed"},
        {"id": "topic-1", "type": "Topic", "content": "Q2 Planning", "agent": "seed"},
        {"id": "decision-1", "type": "Decision", "content": "Finaliser plan Q2", "agent": "seed"},
    ]
    edges = [
        {"source": "person-1", "target": "task-1", "type": "assigned_to"},
        {"source": "task-1", "target": "issue-1", "type": "depends_on"},
        {"source": "task-1", "target": "topic-1", "type": "about"},
        {"source": "decision-1", "target": "task-1", "type": "based_on"}
    ]
    for n in nodes:
        run_query(f"MERGE (n:{n['type']} {{id: $id}}) SET n.content=$content, n.agent=$agent", n)
    for e in edges:
        run_query(f"MATCH (a {{id: $source}}), (b {{id: $target}}) MERGE (a)-[r:{e['type']}]->(b)", e)
    return {"status": "seed inserted"}

@router.post("/ingest_text")
def ingest_text(text: str = Body(...)):
    """
    Ingest texte brut et crée des nodes Task + edges "depends_on" automatiquement
    entre phrases successives.
    """
    tasks = text.split(".")
    created_nodes = []

    for i, t in enumerate(tasks):
        t = t.strip()
        if not t:
            continue
        node = {"id": f"task-{i}", "type": "Task", "content": t, "agent": "AI"}
        run_query(
            "MERGE (n:Task {id: $id}) SET n.content=$content, n.agent=$agent",
            node
        )
        created_nodes.append(node)

        # Crée un edge depends_on avec la phrase précédente
        if i > 0:
            edge = {"source": f"task-{i}", "target": f"task-{i-1}", "type": "depends_on"}
            run_query(
                "MATCH (a {id: $source}), (b {id: $target}) MERGE (a)-[r:depends_on]->(b)",
                edge
            )

    return {"status": "ok", "created_nodes": created_nodes}



@router.post("/ai_enrich")
def ai_enrich():
    """
    Analyse le graph existant et ajoute automatiquement des nodes/edges manquants.
    Exemple : création d'Issue ou Person si absent.
    """
    # Exemple : ajouter une Issue pour deadline si elle n'existe pas
    new_node = {"id": "issue-deadline", "type": "Issue", "content": "Deadline manquante", "agent": "AI"}
    run_query(
        "MERGE (n:Issue {id: $id}) SET n.content=$content, n.agent=$agent",
        new_node
    )

    # Connecte cette Issue à la dernière Task
    last_task_query = "MATCH (n:Task) RETURN n.id AS id ORDER BY n.id DESC LIMIT 1"
    last_task = run_query(last_task_query)
    if last_task:
        edge = {"source": last_task[0]['id'], "target": new_node["id"], "type": "depends_on"}
        run_query(
            "MATCH (a {id: $source}), (b {id: $target}) MERGE (a)-[r:depends_on]->(b)",
            edge
        )

    return {"status": "graph enriched", "added_node": new_node, "added_edge": edge}


@router.get("/explain_node")
def explain_node(id: str):
    # Traverse 2 hops pour construire causal path
    query = """
    MATCH path = (n {id: $id})<-[:based_on|depends_on*1..2]-(m)
    RETURN [x IN nodes(path) | {id: x.id, type: labels(x)[0], content: x.content}] AS path_nodes
    """
    result = run_query(query, {"id": id})
    return {"causal_paths": result}



