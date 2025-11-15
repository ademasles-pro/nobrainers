# Quick Start - Enterprise Brain Backend

## Prerequisites

- Python 3.11+
- Neo4j 5.x (local ou Docker)
- FastAPI, Uvicorn, Pydantic

---

## 1. Installation

### 1.1 Python Dependencies

```bash
cd /home/anton_wr9e6gw/nobrainers/backend
pip install -r requirements.txt
```

### 1.2 Requirements (si absent)

```bash
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
neo4j==5.15.0
requests==2.31.0
pytest==7.4.3
pytest-asyncio==0.21.1
python-dotenv==1.0.0
EOF
```

---

## 2. Configure Neo4j

### 2.1 Local Neo4j (Docker)

```bash
docker run --name neo4j-enterprise \
  -p 7687:7687 \
  -p 7474:7474 \
  -e NEO4J_AUTH=neo4j/testpassword \
  neo4j:5-enterprise
```

### 2.2 Docker Compose (recommandé)

```yaml
# docker-compose.yml
version: '3.8'
services:
  neo4j:
    image: neo4j:5-enterprise
    ports:
      - "7687:7687"
      - "7474:7474"
    environment:
      NEO4J_AUTH: neo4j/testpassword
      NEO4J_apoc_import_file_enabled: "true"
    volumes:
      - neo4j_data:/var/lib/neo4j/data

volumes:
  neo4j_data:
```

Lancer :
```bash
docker-compose up -d
```

### 2.3 Vérifier la connexion

```bash
# Depuis le terminal backend
python3 << 'EOF'
from neo4j import GraphDatabase
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "testpassword"))
with driver.session() as session:
    result = session.run("RETURN 1")
    print("✓ Neo4j connected:", result.data())
driver.close()
EOF
```

---

## 3. Lancer le Backend

### 3.1 Mode développement (avec auto-reload)

```bash
cd /home/anton_wr9e6gw/nobrainers/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3.2 Mode production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 3.3 Vérifier que le backend est UP

```bash
curl http://localhost:8000/

# Expected output:
# {
#   "name": "Enterprise Brain API",
#   "version": "1.0.0",
#   "status": "running",
#   "docs": "/docs",
#   "health": "/api/health"
# }
```

---

## 4. Documentation Interactive

Une fois le backend lancé, ouvrir :

```
http://localhost:8000/docs
```

Cela ouvre **Swagger UI** avec tous les endpoints documentés et testables.

---

## 5. Tests Rapides

### 5.1 Health Check

```bash
curl http://localhost:8000/api/health
```

### 5.2 Seed Graph (données de démo)

```bash
curl -X POST http://localhost:8000/api/seed
```

### 5.3 Get Graph

```bash
curl http://localhost:8000/api/graph | python3 -m json.tool
```

### 5.4 Add Node

```bash
curl -X POST http://localhost:8000/api/add_node \
  -H "Content-Type: application/json" \
  -d '{
    "id": "task-demo",
    "type": "Task",
    "content": "Demo task from CLI",
    "agent": "test"
  }'
```

### 5.5 Ingest Text

```bash
curl -X POST http://localhost:8000/api/ingest_text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Préparer plan Q3. Assigner à Alice. Dépend du rapport Q2."
  }'
```

### 5.6 Reset Graph

```bash
curl -X POST http://localhost:8000/api/reset
```

---

## 6. Suite de Tests Complète

### 6.1 Utiliser le script de test

```bash
cd /home/anton_wr9e6gw/nobrainers/backend
chmod +x test_endpoints.sh
./test_endpoints.sh
```

### 6.2 Tests Unitaires avec pytest

```bash
cd /home/anton_wr9e6gw/nobrainers/backend
pytest app/trigger_n8n.py -v
```

---

## 7. Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/add_node` | Crée un nœud |
| POST | `/api/add_edge` | Crée une relation |
| GET | `/api/graph` | Récupère le graph complet |
| GET | `/api/node/{id}` | Récupère un nœud spécifique |
| POST | `/api/ingest_text` | Ingère texte brut |
| POST | `/api/ai_enrich` | Enrichit le graph avec IA |
| GET | `/api/explain_node/{id}` | Chemins causaux d'un nœud |
| POST | `/api/seed` | Charge des données de démo |
| POST | `/api/reset` | Vide le graph |
| GET | `/api/health` | Vérification de santé |
| GET | `/` | Endpoint racine |

---

## 8. Variables d'Environnement

Créer `.env` :

```bash
cat > .env << 'EOF'
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=testpassword
API_PORT=8000
LOG_LEVEL=info
EOF
```

Charger dans `neo4j_client.py` (déjà fait avec `os.getenv()`).

---

## 9. Troubleshooting

### Neo4j Connection Error

**Erreur** :
```
[Neo4j Error] bolt://localhost:7687 Connection refused
```

**Solution** :
```bash
# Vérifier que Neo4j est lancé
docker ps | grep neo4j

# Sinon, redémarrer
docker-compose restart neo4j

# Vérifier les logs
docker-compose logs neo4j
```

### CORS Error dans Frontend

**Erreur** : `Access-Control-Allow-Origin`

**Solution** : Les CORS sont déjà configurés dans `main.py`. Assurez-vous que l'origin du frontend est dans la liste autorisée.

### Import Errors

**Erreur** : `ModuleNotFoundError: No module named 'fastapi'`

**Solution** :
```bash
pip install -r requirements.txt
# ou
pip install fastapi uvicorn pydantic neo4j
```

### Port Already in Use

**Erreur** : `Address already in use`

**Solution** :
```bash
# Trouver le process
lsof -i :8000

# Tuer le process
kill -9 <PID>

# Ou utiliser un port différent
uvicorn app.main:app --port 8001
```

---

## 10. Architecture du Projet

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Point d'entrée FastAPI
│   ├── routes.py            # Endpoints (8 endpoints)
│   ├── models.py            # Pydantic models
│   ├── neo4j_client.py      # Client Neo4j sécurisé
│   └── trigger_n8n.py       # Tests unitaires
├── N8N_INTEGRATION.md       # Guide intégration n8n
├── LOVABLE_INTEGRATION.md   # Guide intégration Lovable
├── QUICKSTART.md            # Ce fichier
├── requirements.txt         # Dépendances Python
├── test_endpoints.sh        # Suite de tests bash
└── docker-compose.yml       # Docker config
```

---

## 11. Prochaines Étapes

1. **Lancer le backend** : `uvicorn app.main:app --reload`
2. **Tester les endpoints** : `./test_endpoints.sh` ou Swagger UI
3. **Intégrer avec n8n** : Voir `N8N_INTEGRATION.md`
4. **Intégrer avec Lovable** : Voir `LOVABLE_INTEGRATION.md`
5. **Déployer en production** : Configurer CORS, auth, backup Neo4j

---

## 12. Performance & Scaling

- **Auto-refresh UI** : Toutes les 2 secondes (configurable)
- **Graph Size** : Testé avec 1000+ nœuds
- **Batch Operations** : N8N loop sur nodes/edges
- **Caching** : À ajouter en production avec Redis

---

## 13. Support

Erreurs ou questions ? Vérifier :
1. `app/main.py` pour la structure FastAPI
2. `/docs` pour Swagger UI interactif
3. `app/routes.py` pour la logique des endpoints
4. `test_endpoints.sh` pour des examples complets
