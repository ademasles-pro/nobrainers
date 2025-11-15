'use client';

import { useState, useMemo, useCallback } from 'react';
import { GraphData, GraphNode, NodeType } from '@/types/graph';
import { generateMockGraphData } from '@/utils/mockData';

/**
 * Custom hook for managing graph data, filtering, and searching
 * Provides utilities for working with the knowledge graph
 */
export const useGraphData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<NodeType[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Load and memoize full graph data
  const fullData = useMemo(() => generateMockGraphData(), []);

  // Filter graph based on search query and node type filters
  const filteredData = useMemo(() => {
    let nodes = fullData.nodes;
    let links = fullData.links;

    // Apply search filter
    if (searchQuery) {
      nodes = nodes.filter(node =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const nodeIds = new Set(nodes.map(n => n.id));
      links = links.filter(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      });
    }

    // Apply type filter
    if (selectedFilters.length > 0) {
      nodes = nodes.filter(node => selectedFilters.includes(node.type));
      const nodeIds = new Set(nodes.map(n => n.id));
      links = links.filter(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      });
    }

    return { nodes, links };
  }, [fullData, searchQuery, selectedFilters]);

  // Get node by ID
  const getNodeById = useCallback((id: string) => {
    return fullData.nodes.find(node => node.id === id);
  }, [fullData.nodes]);

  // Get connected nodes for a given node
  const getConnectedNodes = useCallback((nodeId: string) => {
    const connectedIds = new Set<string>();
    
    fullData.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      if (sourceId === nodeId) connectedIds.add(targetId);
      if (targetId === nodeId) connectedIds.add(sourceId);
    });

    return fullData.nodes.filter(node => connectedIds.has(node.id));
  }, [fullData]);

  // Get statistics about the graph
  const stats = useMemo(() => {
    const nodesByType: Record<NodeType, number> = {
      person: 0,
      conversation: 0,
      artifact: 0,
      agent: 0,
      action: 0,
    };

    fullData.nodes.forEach(node => {
      nodesByType[node.type]++;
    });

    return {
      totalNodes: fullData.nodes.length,
      totalLinks: fullData.links.length,
      nodesByType,
    };
  }, [fullData]);

  return {
    // Data
    fullData,
    filteredData,
    selectedNode,
    
    // Search & Filter
    searchQuery,
    selectedFilters,
    
    // Setters
    setSearchQuery,
    setSelectedFilters,
    setSelectedNode,
    
    // Methods
    getNodeById,
    getConnectedNodes,
    
    // Statistics
    stats,
  };
};

