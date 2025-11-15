'use client';

import { useState, useMemo } from 'react';
import { GraphVisualization } from '@/components/graph/GraphVisualization';
import { NodeDetailPanel } from '@/components/graph/NodeDetailPanel';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { GraphNode, NodeType } from '@/types/graph';
import { generateMockGraphData } from '@/utils/mockData';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Graph View page - Interactive visualization of the knowledge graph
 * Allows searching, filtering, and exploring graph nodes
 */
export default function GraphView() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<NodeType[]>([]);
  const fullData = useMemo(() => generateMockGraphData(), []);

  // Filter data based on search query and selected node types
  const filteredData = useMemo(() => {
    let nodes = fullData.nodes;
    let links = fullData.links;

    // Filter by search query - match label or id
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

    // Filter by selected node types
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

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header with navigation and search */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Graphe de Connaissances</h1>
              <p className="text-sm text-muted-foreground">
                {filteredData.nodes.length} nodes • {filteredData.links.length} connexions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar
              onSearch={setSearchQuery}
              onFilterChange={setSelectedFilters}
              selectedFilters={selectedFilters}
            />
            <Button variant="outline" size="icon">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - Graph visualization and detail panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph visualization area */}
        <div className="flex-1 p-4">
          <GraphVisualization
            data={filteredData}
            onNodeClick={setSelectedNode}
            selectedNodeId={selectedNode?.id}
          />
        </div>

        {/* Detail panel for selected node (slides in from right) */}
        {selectedNode && (
          <div className="border-l border-border">
            <NodeDetailPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

