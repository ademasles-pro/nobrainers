// Defines the core types for the Enterprise Graph Brain visualization
export type NodeType = 'person' | 'conversation' | 'artifact' | 'agent' | 'action';

/**
 * Represents a single node in the knowledge graph
 */
export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

/**
 * Represents a connection between two nodes
 */
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  strength?: number;
}

/**
 * Complete graph data structure
 */
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Statistics about nodes in the graph
 */
export interface NodeStats {
  total: number;
  byType: Record<NodeType, number>;
}

