# N8N Integration Guide - Enterprise Brain

## Overview
Ce guide explique comment intégrer n8n avec le backend FastAPI pour automatiser l'ingestion et l'enrichissement du graph via workflows n8n.

## Architecture du Workflow N8N

```
[Webhook Input] → [GPT Node] → [HTTP Requests] → [Backend Endpoints]
     ↓
  text input
     ↓
  transformed
  to JSON
     ↓
  posts to
  /add_node
  /add_edge
     ↓
  Graph updated
```

---

## Workflow N8N Complet (JSON Export)

### Configuration Webhook

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "webhook-test/enterprise-brain/main",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "YOUR_WEBHOOK_ID"
    }
  ]
}
```

### Step 1 : Webhook Input
- **URL du webhook n8n** : `https://qsesrdthfyjgukh.app.n8n.cloud/webhook-test/enterprise-brain/main`
- **Accepte** : POST avec JSON `{"text": "..."}`
- **Output** : `body.text`

### Step 2 : GPT Node (ChatGPT ou OpenAI)
Transforme le texte en JSON nodes/edges.

**Prompt GPT** :
```
You are an enterprise knowledge extraction AI.
Extract from the following text:
1. List of tasks/actions (create Task nodes)
2. Assigned people (create Person nodes)
3. Dependencies and relationships (create edges)

Input text: {{$node.Webhook.json.body.text}}

Return ONLY valid JSON:
{
  "nodes": [
    {"id": "task-1", "type": "Task", "content": "..."},
    {"id": "person-1", "type": "Person", "content": "..."}
  ],
  "edges": [
    {"source": "person-1", "target": "task-1", "type": "assigned_to"}
  ]
}
```

**Example Input** :
```
Préparer plan Q3. Assigner à Alice. Dépend du rapport Q2.
```

**Example Output** :
```json
{
  "nodes": [
    {
      "id": "task-planning-q3",
      "type": "Task",
      "content": "Préparer plan Q3",
      "agent": "AI"
    },
    {
      "id": "person-alice",
      "type": "Person",
      "content": "Alice",
      "agent": "AI"
    },
    {
      "id": "issue-report-q2",
      "type": "Issue",
      "content": "Rapport Q2",
      "agent": "AI"
    }
  ],
  "edges": [
    {
      "source": "person-alice",
      "target": "task-planning-q3",
      "type": "assigned_to"
    },
    {
      "source": "task-planning-q3",
      "target": "issue-report-q2",
      "type": "depends_on"
    }
  ]
}
```

---

## Step 3 : HTTP Requests to Backend

### 3A. Add Nodes
**Node** : HTTP Request
- **Method** : POST
- **URL** : `http://localhost:8000/api/add_node`
- **Headers** : `Content-Type: application/json`
- **Body** (for each node from GPT output):
```json
{
  "id": "{{$node.GPT.json.nodes[0].id}}",
  "type": "{{$node.GPT.json.nodes[0].type}}",
  "content": "{{$node.GPT.json.nodes[0].content}}",
  "agent": "n8n"
}
```

**Loop Configuration** : Iterate over `$node.GPT.json.nodes`

### 3B. Add Edges
**Node** : HTTP Request
- **Method** : POST
- **URL** : `http://localhost:8000/api/add_edge`
- **Headers** : `Content-Type: application/json`
- **Body** (for each edge from GPT output):
```json
{
  "source": "{{$node.GPT.json.edges[0].source}}",
  "target": "{{$node.GPT.json.edges[0].target}}",
  "type": "{{$node.GPT.json.edges[0].type}}"
}
```

**Loop Configuration** : Iterate over `$node.GPT.json.edges`

---

## Complete N8N Workflow Steps

1. **Webhook** → Receives text input
2. **Execute** → GPT transforms text to nodes/edges JSON
3. **Loop (Nodes)** → For each node, HTTP POST to `/add_node`
4. **Loop (Edges)** → For each edge, HTTP POST to `/add_edge`
5. **Response** → Returns success confirmation

---

## Testing with cURL

### Test 1: Direct Text Ingestion
```bash
curl -X POST http://localhost:8000/api/ingest_text \
  -H "Content-Type: application/json" \
  -d '{"text":"Préparer plan Q3. Assigner à Alice. Dépend du rapport Q2."}'
```

### Test 2: Add Node
```bash
curl -X POST http://localhost:8000/api/add_node \
  -H "Content-Type: application/json" \
  -d '{
    "id":"task-demo",
    "type":"Task",
    "content":"Demo task",
    "agent":"test"
  }'
```

### Test 3: Add Edge
```bash
curl -X POST http://localhost:8000/api/add_node \
  -H "Content-Type: application/json" \
  -d '{"id":"person-1","type":"Person","content":"John","agent":"test"}'

curl -X POST http://localhost:8000/api/add_edge \
  -H "Content-Type: application/json" \
  -d '{
    "source":"person-1",
    "target":"task-demo",
    "type":"assigned_to"
  }'
```

### Test 4: Get Full Graph
```bash
curl http://localhost:8000/api/graph
```

### Test 5: Seed Graph
```bash
curl -X POST http://localhost:8000/api/seed
```

### Test 6: Health Check
```bash
curl http://localhost:8000/api/health
```

---

## N8N Webhook Test Curl

```bash
curl -X POST https://qsesrdthfyjgukh.app.n8n.cloud/webhook-test/enterprise-brain/main \
  -H "Content-Type: application/json" \
  -d '{
    "text":"Préparer plan Q3. Assigner à Alice. Dépend du rapport Q2."
  }'
```

---

## API Response Format

Tous les endpoints retournent une réponse uniforme :

```json
{
  "status": "ok|created|error",
  "data": {
    // Contenu de la réponse
  },
  "message": "Description humanisable"
}
```

### Example: Add Node Response
```json
{
  "status": "created",
  "data": {
    "node": {
      "id": "task-1",
      "type": "Task",
      "content": "Préparer le plan Q2",
      "agent": "AI"
    }
  },
  "message": "Node task-1 créé"
}
```

---

## Lovable UI Integration

### Auto-Refresh Graph (every 2 seconds)
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:8000/api/graph")
      .then(res => res.json())
      .then(data => setGraphData(data));
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

### Visualization Features
- **Nodes** : Colorées par type (Task=blue, Person=green, Issue=red, etc.)
- **Pulsation** : Nodes créées par AI pulsent 3 secondes
- **Hover** : Affiche content + metadata
- **Click** : Affiche le causal path via `/explain_node/{id}`
- **Run Intelligence** : POST à `/ai_enrich` pour ajouter nodes manquants

---

## Production Considerations

1. **Neo4j Security** : Utiliser des credentials sécurisés en production (env vars)
2. **Rate Limiting** : Ajouter rate limiting sur les endpoints publics
3. **CORS** : Restreindre les origins CORS
4. **Validation** : Ajouter validation supplémentaire des inputs
5. **Logging** : Implémenter logging centralisé
6. **Database Backups** : Configurer backups réguliers Neo4j
7. **API Keys** : Implémenter authentification n8n <-> Backend

---

## Troubleshooting

### Neo4j Connection Error
```
[Neo4j Error] bolt://localhost:7687
```
**Solution** : Vérifier que Neo4j est lancé
```bash
docker ps | grep neo4j
# ou
neo4j start
```

### Node Not Found on Add Edge
**Cause** : Essai de créer une edge avec des nodes qui n'existent pas
**Solution** : Créer les nodes AVANT les edges, ou utiliser MERGE

### Webhook Returns 404
**Cause** : URL n8n incorrect ou webhook non activé
**Solution** : Vérifier le webhook URL dans n8n Cloud

---

## Next Steps

1. ✅ Créer workflow n8n complet
2. ✅ Tester avec curl
3. ✅ Intégrer Lovable UI
4. ✅ Deploy à production
