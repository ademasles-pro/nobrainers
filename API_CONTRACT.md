# 🔌 API Contract - Enterprise Graph Brain Backend

This document defines the expected API endpoints and data formats for connecting Enterprise Graph Brain to a backend service.

## Base URL
```
http://localhost:3001/api
# or from environment variable
NEXT_PUBLIC_API_URL
```

## Authentication (Future)
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Core Endpoints

### Graph Queries

#### GET /graph
Fetch the complete knowledge graph

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "p1",
        "label": "Alice Chen",
        "type": "person",
        "metadata": {
          "role": "Product Manager",
          "department": "Product"
        }
      }
    ],
    "links": [
      {
        "source": "p1",
        "target": "c1",
        "type": "participated"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### GET /graph/nodes
Get only nodes

**Query Parameters:**
```
?type=person          # Filter by node type
?limit=100           # Limit results
?offset=0            # Pagination
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "label": "Alice Chen",
      "type": "person",
      "metadata": {}
    }
  ],
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### GET /graph/links
Get only links

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "source": "p1",
      "target": "c1",
      "type": "participated"
    }
  ],
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Search & Discovery

#### POST /graph/search
Full-text search across graph

**Request:**
```json
{
  "query": "dashboard",
  "limit": 10,
  "filters": {
    "nodeTypes": ["artifact", "conversation"],
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nodeId": "a1",
      "label": "PRD: New Dashboard",
      "type": "artifact",
      "relevanceScore": 0.95,
      "snippet": "...dashboard redesign project..."
    }
  ],
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### GET /graph/nodes/:id
Get detailed information about a node

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "p1",
    "label": "Alice Chen",
    "type": "person",
    "metadata": {
      "role": "Product Manager",
      "department": "Product",
      "email": "alice@company.com"
    },
    "connections": {
      "conversations": 12,
      "artifacts": 5,
      "actions": 3
    },
    "recentActivity": [
      {
        "timestamp": "2025-01-14T15:30:00Z",
        "action": "participated",
        "target": "c1"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### GET /graph/nodes/:id/connections
Get connected nodes for a specific node

**Query Parameters:**
```
?depth=1              # How many hops to follow
?limit=50            # Max results
```

**Response:**
```json
{
  "success": true,
  "data": {
    "direct": [
      {
        "id": "c1",
        "label": "Q2 Planning",
        "type": "conversation",
        "relationshipType": "participated"
      }
    ],
    "indirect": []
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Statistics

#### GET /graph/stats
Get graph statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalNodes": 500,
    "totalLinks": 1200,
    "nodesByType": {
      "person": 247,
      "conversation": 1842,
      "artifact": 3567,
      "agent": 24,
      "action": 892
    },
    "lastUpdated": "2025-01-15T10:30:00Z",
    "topNodes": {
      "mostConnected": [
        { "id": "p1", "label": "Alice Chen", "connections": 45 }
      ],
      "mostRecent": [
        { "id": "c1", "label": "Q2 Planning", "timestamp": "2025-01-15T10:30:00Z" }
      ]
    }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Context & Reasoning

#### GET /context/user/:id
Get user context and related information

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "p1",
    "profile": {
      "name": "Alice Chen",
      "role": "Product Manager",
      "department": "Product"
    },
    "recentActivity": [],
    "projects": [],
    "expertise": [],
    "recommendations": []
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### GET /explain/decision/:id
Get reasoning chain for a decision

**Response:**
```json
{
  "success": true,
  "data": {
    "decision": {
      "id": "ac1",
      "label": "Approve Release",
      "timestamp": "2025-01-15T10:30:00Z"
    },
    "reasoning": [
      {
        "step": 1,
        "reasoning": "Based on completed testing",
        "sources": ["a2", "ac3"]
      }
    ],
    "relatedNodes": []
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Data Management (Future)

#### POST /graph/nodes
Create a new node

**Request:**
```json
{
  "label": "New Project",
  "type": "artifact",
  "metadata": {
    "status": "In Progress"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a100",
    "label": "New Project",
    "type": "artifact",
    "metadata": {},
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

#### POST /graph/links
Create a new link between nodes

**Request:**
```json
{
  "source": "p1",
  "target": "a100",
  "type": "created"
}
```

#### PUT /graph/nodes/:id
Update a node

#### DELETE /graph/nodes/:id
Delete a node

### Connectors (Future)

#### POST /connectors/slack/sync
Sync data from Slack

#### POST /connectors/jira/sync
Sync data from Jira

#### POST /connectors/notion/sync
Sync data from Notion

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: query"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found: p999"
  }
}
```

### 500 Internal Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## Rate Limiting

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

## Data Formats

### Node Types
```
"person"       - Employee/team member
"conversation" - Discussion/meeting
"artifact"     - Document/asset
"agent"        - AI system
"action"       - Task/decision
```

### Link Types
```
"participated"   - Joined conversation
"authored"       - Created/wrote
"referenced"     - Mentioned/linked to
"depends_on"     - Depends on another
"generated"      - Generated/created by
"assigned"       - Assigned to person
"reviewed"       - AI reviewed
"assisted"       - AI assisted with
"analyzed"       - AI analyzed
```

## Example Client Implementation

### Using Fetch
```typescript
// app/utils/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchGraph() {
  const response = await fetch(`${API_BASE}/graph`);
  if (!response.ok) throw new Error('Failed to fetch graph');
  return response.json();
}

export async function searchGraph(query: string, filters: any = {}) {
  const response = await fetch(`${API_BASE}/graph/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, ...filters }),
  });
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

export async function getNodeDetails(id: string) {
  const response = await fetch(`${API_BASE}/graph/nodes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch node details');
  return response.json();
}
```

### Using in Component
```typescript
// app/(routes)/graph/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { fetchGraph } from '@/utils/api';

export default function GraphView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGraph()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <GraphVisualization data={data} />
  );
}
```

## WebSocket (Future)

For real-time updates:

```typescript
const ws = new WebSocket('ws://localhost:3001/graph/updates');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle update
};
```

## Caching Strategy

- Graph data: Cache for 5 minutes
- Search results: Cache for 1 minute
- Node details: Cache until node updates
- Statistics: Cache for 10 minutes

---

**This contract will be implemented when backend is ready.**

For frontend implementation, see [SETUP.md](./SETUP.md)

