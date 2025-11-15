# Lovable UI Integration Guide - Enterprise Brain

## Overview

Ce guide décrit comment intégrer le frontend Lovable (React) avec le backend FastAPI pour afficher et interagir avec le graph en temps réel.

---

## 1. Setup Initial

### 1.1 Hook personnalisé pour récupérer le graph

Créer `hooks/useGraphData.ts` :

```typescript
import { useEffect, useState } from 'react';

interface Node {
  id: string;
  type: string;
  content: string;
  agent?: string;
}

interface Edge {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export function useGraphData(refreshInterval: number = 2000) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/graph`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        setGraphData({
          nodes: data.nodes || [],
          edges: data.edges || []
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Récupère immédiatement
    fetchGraph();

    // Setup auto-refresh (toutes les 2 secondes par défaut)
    const interval = setInterval(fetchGraph, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { graphData, loading, error };
}
```

---

## 2. Composant GraphVisualization

### 2.1 Avec React Flow (recommandé)

```typescript
// components/graph/GraphVisualization.tsx

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node as FlowNode,
  Edge as FlowEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useGraphData } from '@/hooks/useGraphData';
import { NodeDetailPanel } from './NodeDetailPanel';

interface VisualNode extends FlowNode {
  data: {
    label: string;
    type: string;
    content: string;
    agent?: string;
  };
}

export function GraphVisualization() {
  const { graphData, loading, error } = useGraphData(2000);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  // Convertit les données du backend en format React Flow
  useMemo(() => {
    // Nodes
    const flowNodes: VisualNode[] = graphData.nodes.map((node, idx) => ({
      id: node.id,
      data: {
        label: node.type,
        type: node.type,
        content: node.content,
        agent: node.agent,
      },
      position: {
        x: (idx % 5) * 250,
        y: Math.floor(idx / 5) * 200,
      },
      style: {
        background: getNodeColor(node.type),
        border: `2px solid ${getNodeBorderColor(node.agent)}`,
        borderRadius: '8px',
        padding: '10px',
        fontSize: '12px',
        color: 'white',
        animation: node.agent === 'AI' ? 'pulse 2s infinite' : 'none',
      },
    }));

    // Edges
    const flowEdges: FlowEdge[] = graphData.edges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      label: edge.type,
      animated: true,
      style: { stroke: '#999' },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [graphData, setNodes, setEdges]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      {error && (
        <div style={{ color: 'red', padding: '10px' }}>
          Erreur: {error}
        </div>
      )}
      
      {loading && graphData.nodes.length === 0 && (
        <div style={{ padding: '10px' }}>Chargement...</div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => handleNodeClick(node.id)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedNodeId && (
        <NodeDetailPanel
          nodeId={selectedNodeId}
          nodes={graphData.nodes}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Fonctions utilitaires pour les couleurs

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    Task: '#3b82f6',      // blue
    Person: '#10b981',    // green
    Issue: '#ef4444',     // red
    Topic: '#f59e0b',     // amber
    Decision: '#8b5cf6',  // purple
  };
  return colors[type] || '#6b7280'; // gray par défaut
}

function getNodeBorderColor(agent?: string): string {
  if (agent === 'AI') return '#fbbf24';      // gold pour AI
  if (agent === 'seed') return '#94a3b8';    // slate pour seed
  return '#d1d5db';                          // gray pour user
}
```

### 2.2 Alternative simple sans librairie externe

```typescript
// components/graph/SimpleGraphVisualization.tsx

import React from 'react';
import { useGraphData } from '@/hooks/useGraphData';

interface Position {
  x: number;
  y: number;
}

export function SimpleGraphVisualization() {
  const { graphData, loading, error } = useGraphData(2000);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Calcule les positions des nœuds en cercle
  const nodePositions = React.useMemo((): Record<string, Position> => {
    const positions: Record<string, Position> = {};
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    graphData.nodes.forEach((node, idx) => {
      const angle = (idx / graphData.nodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return positions;
  }, [graphData.nodes]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Graph Visualization</h3>

      {error && <div style={{ color: 'red' }}>Erreur: {error}</div>}
      {loading && graphData.nodes.length === 0 && <p>Chargement...</p>}

      <svg
        ref={svgRef}
        width="100%"
        height="400"
        style={{ border: '1px solid #eee', borderRadius: '4px' }}
      >
        {/* Edges */}
        <g>
          {graphData.edges.map((edge) => {
            const sourcePos = nodePositions[edge.source];
            const targetPos = nodePositions[edge.target];
            if (!sourcePos || !targetPos) return null;

            return (
              <g key={`${edge.source}-${edge.target}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="#999"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2}
                  fontSize="10"
                  fill="#666"
                >
                  {edge.type}
                </text>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {graphData.nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isSelected = selectedNodeId === node.id;
            const isAI = node.agent === 'AI';

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {isAI && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    opacity="0.5"
                    style={{
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill={getNodeColor(node.type)}
                  stroke={isSelected ? '#000' : '#333'}
                  strokeWidth={isSelected ? '3' : '1'}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                >
                  {node.type.substring(0, 3)}
                </text>
              </g>
            );
          })}
        </g>

        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#999" />
          </marker>
        </defs>
      </svg>

      <style>{`
        @keyframes pulse {
          0%, 100% { r: 25; opacity: 0.5; }
          50% { r: 30; opacity: 0.3; }
        }
      `}</style>

      <p style={{ fontSize: '12px', color: '#666' }}>
        Nodes: {graphData.nodes.length} | Edges: {graphData.edges.length}
      </p>
    </div>
  );
}

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    Task: '#3b82f6',
    Person: '#10b981',
    Issue: '#ef4444',
    Topic: '#f59e0b',
    Decision: '#8b5cf6',
  };
  return colors[type] || '#6b7280';
}
```

---

## 3. Panel Détails du Nœud

```typescript
// components/graph/NodeDetailPanel.tsx

import React from 'react';
import { useEffect, useState } from 'react';

interface Node {
  id: string;
  type: string;
  content: string;
  agent?: string;
}

interface NodeDetailPanelProps {
  nodeId: string;
  nodes: Node[];
  onClose: () => void;
}

export function NodeDetailPanel({ nodeId, nodes, onClose }: NodeDetailPanelProps) {
  const node = nodes.find(n => n.id === nodeId);
  const [causalPath, setCausalPath] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupère les chemins causaux
    const fetchCausalPath = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/explain_node/${nodeId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCausalPath(data.causal_paths);
        }
      } catch (err) {
        console.error('Erreur récupération causal path:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCausalPath();
  }, [nodeId]);

  if (!node) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: '10px',
        top: '10px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>{node.type}</h4>
        <button
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>ID:</strong> {node.id}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Content:</strong> {node.content}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Agent:</strong> {node.agent || 'user'}
      </div>

      {causalPath && causalPath.length > 0 && (
        <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <strong>Causal Paths:</strong>
          {causalPath.map((path: any[], idx: number) => (
            <div
              key={idx}
              style={{
                fontSize: '12px',
                marginTop: '5px',
                padding: '5px',
                background: '#f3f4f6',
                borderRadius: '4px',
              }}
            >
              {path.map((n: any, i: number) => (
                <div key={i}>
                  {i > 0 && <span style={{ color: '#999' }}>← </span>}
                  <span style={{ fontWeight: 'bold' }}>{n.type}</span>: {n.content.substring(0, 30)}...
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {loading && <p style={{ fontSize: '12px', color: '#999' }}>Chargement chemins...</p>}
    </div>
  );
}
```

---

## 4. Composant d'Interaction

```typescript
// components/graph/GraphControls.tsx

import React from 'react';

interface GraphControlsProps {
  onRefresh: () => void;
  onSeed: () => void;
  onReset: () => void;
  onAIEnrich: () => void;
  loading?: boolean;
}

export function GraphControls({
  onRefresh,
  onSeed,
  onReset,
  onAIEnrich,
  loading = false,
}: GraphControlsProps) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🔄 Refresh Graph
      </button>

      <button
        onClick={onSeed}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🌱 Seed Demo Data
      </button>

      <button
        onClick={onAIEnrich}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ✨ Run Intelligence
      </button>

      <button
        onClick={onReset}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🗑️ Clear Graph
      </button>
    </div>
  );
}
```

---

## 5. Page Dashboard Complète

```typescript
// app/(routes)/graph/page.tsx

'use client';

import { useCallback, useState } from 'react';
import { GraphVisualization } from '@/components/graph/GraphVisualization';
import { GraphControls } from '@/components/graph/GraphControls';
import { SearchBar } from '@/components/search/SearchBar';

export default function GraphPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const handleAction = useCallback(async (endpoint: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
      });
      if (response.ok) {
        handleRefresh();
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setLoading(false);
    }
  }, [handleRefresh]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Enterprise Brain - Graph Dashboard</h1>

      <GraphControls
        onRefresh={handleRefresh}
        onSeed={() => handleAction('/seed')}
        onReset={() => handleAction('/reset')}
        onAIEnrich={() => handleAction('/ai_enrich')}
        loading={loading}
      />

      <SearchBar onTextSubmit={(text) => {
        // POST au backend pour ingestion texte
        handleAction('/ingest_text');
      }} />

      <GraphVisualization key={refreshKey} />
    </div>
  );
}
```

---

## 6. Styling et CSS

### 6.1 Global Styles avec Tailwind

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Graph-specific animations */
@layer components {
  .node-pulse {
    @apply animate-pulse;
  }

  .graph-container {
    @apply w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg;
  }

  .node-badge {
    @apply px-3 py-1 rounded-full text-sm font-semibold text-white;
  }
}
```

---

## 7. Architecture Complète de l'Intégration

```
Frontend (Lovable/React)
├── pages/graph.tsx (Dashboard)
├── components/graph/
│   ├── GraphVisualization.tsx (Affichage)
│   ├── NodeDetailPanel.tsx (Détails)
│   └── GraphControls.tsx (Interactions)
├── components/search/
│   └── SearchBar.tsx (Ingestion texte)
└── hooks/useGraphData.ts (Fetch & Auto-refresh)
        ↓
        ↓ HTTP (JSON)
        ↓
Backend (FastAPI)
├── /api/graph → Récupère tous les nœuds/arêtes
├── /api/add_node → Ajoute nœud
├── /api/add_edge → Ajoute relation
├── /api/ingest_text → Ingère texte
├── /api/ai_enrich → Enrichit le graph
├── /api/explain_node/{id} → Chemins causaux
├── /api/seed → Données de démo
└── /api/reset → Réinitialise
```

---

## 8. Checklist Intégration

- [ ] Récupération graph toutes les 2 secondes
- [ ] Colorisation des nœuds par type
- [ ] Pulsation des nœuds créés par AI
- [ ] Hover affiche content
- [ ] Click affiche détails + causal path
- [ ] Bouton "Run Intelligence" pour `/ai_enrich`
- [ ] Bouton "Seed" pour données démo
- [ ] Bouton "Refresh" manuel
- [ ] SearchBar pour ingestion texte
- [ ] CORS configuré sur backend
- [ ] Erreurs affichées correctement
- [ ] Loading states

---

## 9. Variables d'Environnement

```env
# .env.local (Lovable)
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Déploiement Production

1. **Backend** : Restreindre CORS à domaines spécifiques
2. **Frontend** : Utiliser API_URL dynamique selon l'environnement
3. **Neo4j** : Credentials en variables d'environnement
4. **Auth** : Ajouter authentification si nécessaire
