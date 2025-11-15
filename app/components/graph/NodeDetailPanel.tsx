'use client';

import { GraphNode } from '@/types/graph';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, User, MessageSquare, FileText, Bot, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodeDetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

// Maps node types to their corresponding icons
const nodeIcons = {
  person: User,
  conversation: MessageSquare,
  artifact: FileText,
  agent: Bot,
  action: Zap,
};

// Maps node types to their background color classes
const nodeColors = {
  person: 'bg-node-person',
  conversation: 'bg-node-conversation',
  artifact: 'bg-node-artifact',
  agent: 'bg-node-agent',
  action: 'bg-node-action',
};

export const NodeDetailPanel = ({ node, onClose }: NodeDetailPanelProps) => {
  if (!node) return null;

  const Icon = nodeIcons[node.type];

  return (
    <Card className="w-80 h-full bg-card border-border overflow-y-auto animate-slide-in">
      <div className="p-6 space-y-6">
        {/* Header with node icon, label, and close button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${nodeColors[node.type]}`}>
              <Icon className="w-6 h-6 text-background" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{node.label}</h3>
              <Badge variant="secondary" className="mt-1">
                {node.type}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Node ID display */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">ID</h4>
            <p className="text-sm text-foreground font-mono">{node.id}</p>
          </div>

          {/* Metadata display if present */}
          {node.metadata && Object.keys(node.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Metadata</h4>
                <div className="space-y-2">
                  {Object.entries(node.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-2">
                      <span className="text-sm text-muted-foreground">{key}:</span>
                      <span className="text-sm text-foreground text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Action buttons for further exploration */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Actions</h4>
          <div className="grid gap-2">
            <Button variant="outline" className="w-full justify-start">
              View Full Context
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Show Connections
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

