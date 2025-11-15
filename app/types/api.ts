/**
 * API-related types for backend communication
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// Graph query request
export interface GraphQueryRequest {
  query: string;
  limit?: number;
  filters?: {
    nodeTypes?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    departments?: string[];
  };
}

// Graph statistics response
export interface GraphStatsResponse {
  totalNodes: number;
  totalLinks: number;
  nodesByType: Record<string, number>;
  lastUpdated: string;
}

// Search results
export interface SearchResult {
  nodeId: string;
  label: string;
  type: string;
  relevanceScore: number;
  snippet?: string;
}

// Neo4j query response placeholder
export interface Neo4jQueryResponse {
  records: Record<string, any>[];
  summary: {
    query: string;
    database: string;
    version: string;
    resultConsumedAfter: number;
    resultAvailableAfter: number;
  };
}

