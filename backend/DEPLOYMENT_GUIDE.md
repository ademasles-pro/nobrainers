# 🚀 Enterprise Brain - Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] Tous les endpoints testés avec `/test_endpoints.sh`
- [ ] Pas d'erreurs dans Swagger UI (`/docs`)
- [ ] Type hints complètes sur toutes les fonctions
- [ ] Docstrings French sur tous les endpoints
- [ ] Pas de `print()` ou `TODO` en production

### Security
- [ ] Vérifier que tous les paramètres sont liés (pas de f-strings)
- [ ] CORS configured correctement (hosts whitelist)
- [ ] Pas de hardcoded credentials (utiliser env vars)
- [ ] Neo4j auth via `NEO4J_USER` / `NEO4J_PASSWORD`
- [ ] Validation des IDs (alphanumériques + tirets/underscores)

### Dependencies
- [ ] `pip freeze > requirements.txt` à jour
- [ ] Toutes les versions freezées
- [ ] Pas de conflits entre packages
- [ ] Testé avec `pip install -r requirements.txt` sur clean venv

### Neo4j
- [ ] Instance Neo4j lancée et accessible
- [ ] Authentification configurée
- [ ] Backups configurés
- [ ] Version compatible (5.x)

---

## Development Deployment

### Local Setup

```bash
# 1. Create venv
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start Neo4j
docker-compose up -d neo4j

# 4. Verify connection
python3 -c "from neo4j import GraphDatabase; driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j','testpassword')); print('✓ Connected')"

# 5. Run backend
uvicorn app.main:app --reload
```

### Dev Verification

```bash
# Health check
curl http://localhost:8000/api/health

# Seed and test
curl -X POST http://localhost:8000/api/seed
./test_endpoints.sh

# Check Swagger
open http://localhost:8000/docs
```

---

## Staging Deployment

### Environment Setup

Create `.env.staging`:
```bash
NEO4J_URI=bolt://neo4j-staging:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=${NEO4J_PASSWORD_STAGING}
LOG_LEVEL=info
API_PORT=8000
```

### Staging Docker

Create `docker-compose.staging.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NEO4J_URI=bolt://neo4j:7687
      - NEO4J_USER=neo4j
      - NEO4J_PASSWORD=${NEO4J_PASSWORD}
    depends_on:
      - neo4j
    volumes:
      - ./logs:/app/logs

  neo4j:
    image: neo4j:5-enterprise
    ports:
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/${NEO4J_PASSWORD}
    volumes:
      - neo4j_data_staging:/var/lib/neo4j/data
      - neo4j_logs_staging:/var/lib/neo4j/logs

volumes:
  neo4j_data_staging:
  neo4j_logs_staging:
```

### Deploy Staging

```bash
# Build image
docker-compose -f docker-compose.staging.yml build

# Deploy
docker-compose -f docker-compose.staging.yml up -d

# Test
curl http://staging-backend:8000/api/health
```

---

## Production Deployment

### Pre-Production Checklist

- [ ] SSL/TLS certificates configured
- [ ] Domain name & reverse proxy setup
- [ ] Rate limiting configured
- [ ] Logging centralisé (ELK, Splunk, etc.)
- [ ] Monitoring & alerting setup
- [ ] Backup strategy for Neo4j
- [ ] Database encryption at rest
- [ ] Network security groups configured

### Environment (Production)

Create `.env.prod`:

```bash
# Backend
API_PORT=8000
LOG_LEVEL=warning
ENVIRONMENT=production

# Neo4j
NEO4J_URI=bolt://neo4j-prod.example.com:7687
NEO4J_USER=neo4j_prod
NEO4J_PASSWORD=${NEO4J_PASSWORD_PROD}

# Security
CORS_ORIGINS=https://app.example.com,https://www.example.com
API_KEY=${API_KEY_PROD}

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
```

### Production Dockerfile

```dockerfile
# Dockerfile.prod
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app ./app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build:
```bash
docker build -f Dockerfile.prod -t enterprise-brain:latest .
```

### Kubernetes Deployment (Optional)

`k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-brain
spec:
  replicas: 3
  selector:
    matchLabels:
      app: enterprise-brain
  template:
    metadata:
      labels:
        app: enterprise-brain
    spec:
      containers:
      - name: backend
        image: enterprise-brain:latest
        ports:
        - containerPort: 8000
        env:
        - name: NEO4J_URI
          valueFrom:
            configMapKeyRef:
              name: enterprise-brain-config
              key: neo4j_uri
        - name: NEO4J_PASSWORD
          valueFrom:
            secretKeyRef:
              name: enterprise-brain-secrets
              key: neo4j_password
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
```

### Nginx Reverse Proxy

`nginx.conf`:

```nginx
upstream enterprise_brain {
    server localhost:8000;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=10 nodelay;

    # Proxy
    location / {
        proxy_pass http://enterprise_brain;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # Swagger docs
    location /docs {
        proxy_pass http://enterprise_brain/docs;
    }
}
```

Reload:
```bash
sudo systemctl reload nginx
```

---

## Monitoring & Logging

### Logging Setup

Add to `routes.py`:

```python
import logging

logger = logging.getLogger(__name__)

@router.get("/api/health")
def health_check():
    logger.info("Health check called")
    try:
        result = run_query("RETURN 1")
        logger.info("Health check passed")
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise
```

### Monitoring with Prometheus

`prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'enterprise-brain'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

Add to FastAPI:

```python
from prometheus_client import Counter, Histogram

request_count = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
request_duration = Histogram('request_duration_seconds', 'Request duration')
```

---

## Backup & Recovery

### Neo4j Backup

```bash
# Manual backup
docker exec neo4j neo4j-admin database dump neo4j /backups/backup.dump

# Scheduled backup (cron)
0 2 * * * docker exec neo4j neo4j-admin database dump neo4j /backups/backup-$(date +\%Y\%m\%d).dump
```

### Database Restore

```bash
docker exec neo4j neo4j-admin database restore --from-path=/backups backup.dump neo4j
```

---

## Performance Tuning

### Neo4j Configuration

`neo4j.conf`:

```
# Memory
dbms.memory.heap.initial_size=512m
dbms.memory.heap.max_size=2g

# Connection pool
server.bolt.connection_keep_alive_enabled=true
server.bolt.connection_keep_alive_probes=20000ms

# Query timeout
dbms.transaction.timeout=30s
```

### FastAPI Optimization

```python
# app/main.py

app = FastAPI(
    title="Enterprise Brain API",
    # Optimizations
    docs_url="/docs",
    openapi_url="/openapi.json",
    redoc_url=None,  # Disable if not needed
)

# Add compression
from fastapi.middleware.gzip import GZIPMiddleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)
```

---

## Rollback Strategy

### Blue-Green Deployment

```bash
# Deploy to green
docker-compose -f docker-compose.green.yml up -d

# Test green
curl http://green-backend:8000/api/health

# Switch traffic
# (via nginx/load balancer)

# Keep blue as rollback
docker-compose -f docker-compose.blue.yml ps
```

### Quick Rollback

```bash
# If issues detected
docker-compose down
git checkout previous-tag
docker-compose up -d
```

---

## Post-Deployment

### Verification

```bash
# 1. Health checks
curl https://api.example.com/api/health

# 2. Smoke tests
curl -X POST https://api.example.com/api/seed
curl https://api.example.com/api/graph

# 3. Load test
# Use Apache Bench or k6
ab -n 1000 -c 10 https://api.example.com/api/graph
```

### Documentation

- [ ] Update API docs link to `/docs`
- [ ] Share deployment logs with team
- [ ] Document any manual steps taken
- [ ] Update runbook for future deployments

### Monitoring Setup

- [ ] Grafana dashboards created
- [ ] Alerts configured in Sentry/PagerDuty
- [ ] Log aggregation verified
- [ ] Database backup tested

---

## Troubleshooting

### Common Issues

#### 1. Neo4j Connection Timeout

```bash
# Check neo4j status
docker logs neo4j

# Restart
docker restart neo4j

# Verify connection
curl -u neo4j:password http://localhost:7474/
```

#### 2. High Memory Usage

```bash
# Check container memory
docker stats

# Optimize Neo4j heap
# Edit docker-compose.yml and set:
# NEO4J_dbms_memory_heap_max__size=1g

docker-compose down && docker-compose up -d
```

#### 3. Slow API Responses

```bash
# Check database query performance
# Enable Neo4j query logging
# Monitor with: /api/health

# Add caching layer
# Consider Redis for frequently accessed data
```

---

## Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Daily | Monitor logs & alerts |
| Weekly | Review performance metrics |
| Monthly | Neo4j backup integrity check |
| Quarterly | Security audit & updates |
| Annually | Capacity planning review |

---

## Success Criteria

✅ Backend responds < 200ms for `/graph`
✅ 99.9% uptime
✅ All endpoints accessible
✅ Neo4j data persisted
✅ Logs centralized & monitored
✅ CORS properly restricted
✅ SSL/TLS enabled
✅ Backups automated & tested

---

## Support & Runbook

### Emergency Contacts

- Backend Team: @team-backend
- DevOps: @team-devops
- DBA: @team-dba

### Quick Links

- Dashboard: https://grafana.example.com
- Logs: https://logs.example.com
- Status: https://status.example.com
- API Docs: https://api.example.com/docs
