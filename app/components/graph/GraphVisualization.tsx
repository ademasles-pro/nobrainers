'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode } from '@/types/graph';
import { Card } from '@/components/ui/card';

interface GraphVisualizationProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  selectedNodeId?: string;
}

// Color mapping for different node types
const nodeColors: Record<string, string> = {
  person: 'hsl(189, 94%, 43%)',      // Cyan
  conversation: 'hsl(142, 76%, 36%)', // Green
  artifact: 'hsl(27, 96%, 61%)',      // Orange
  agent: 'hsl(280, 82%, 60%)',        // Purple
  action: 'hsl(14, 91%, 51%)',        // Red
};

export const GraphVisualization = ({ 
  data, 
  onNodeClick, 
  selectedNodeId 
}: GraphVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Main D3 visualization effect
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = dimensions.width;
    const height = dimensions.height;

    // Create force simulation for graph layout
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links as any)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    const g = svg.append('g');

    // Add zoom and pan capability
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        }) as any
    );

    // Draw links (connections between nodes)
    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'hsl(215, 28%, 17%)')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes and setup interactions
    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any
      );

    // Add circles (node visuals)
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => nodeColors[d.type] || nodeColors.person)
      .attr('stroke', (d) => d.id === selectedNodeId ? 'hsl(27, 96%, 61%)' : 'hsl(215, 28%, 17%)')
      .attr('stroke-width', (d) => d.id === selectedNodeId ? 4 : 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick?.(d);
      });

    // Add labels below nodes
    node.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('fill', 'hsl(210, 40%, 98%)')
      .attr('font-size', '12px')
      .style('pointer-events', 'none');

    // Update positions on each simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [data, dimensions, onNodeClick, selectedNodeId]);

  return (
    <Card className="w-full h-full bg-card border-border overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </Card>
  );
};

