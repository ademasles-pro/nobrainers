/**
 * Application-wide constants and configuration
 */

// Node type display labels and colors
export const NODE_TYPE_CONFIG = {
  person: {
    label: 'People',
    color: '#00d4ff',
    icon: 'User',
    description: 'Employees and team members',
  },
  conversation: {
    label: 'Conversations',
    color: '#10b981',
    icon: 'MessageSquare',
    description: 'Slack, Teams, meetings, discussions',
  },
  artifact: {
    label: 'Artifacts',
    color: '#f97316',
    icon: 'FileText',
    description: 'Documents, specs, reports, code',
  },
  agent: {
    label: 'Agents',
    color: '#8b5cf6',
    icon: 'Bot',
    description: 'AI assistants and automated systems',
  },
  action: {
    label: 'Actions',
    color: '#ef4444',
    icon: 'Zap',
    description: 'Tasks, decisions, workflows, approvals',
  },
} as const;

// Graph visualization configuration
export const GRAPH_CONFIG = {
  nodeRadius: 20,
  linkDistance: 100,
  chargeStrength: -300,
  collisionRadius: 40,
  zoomScaleExtent: [0.3, 3] as const,
  nodeStrokeWidth: 2,
  selectedNodeStrokeWidth: 4,
  linkStrokeWidth: 2,
  linkOpacity: 0.6,
};

// Animation timings (in milliseconds)
export const ANIMATION_TIMINGS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const;

// API configuration (to be used when backend is ready)
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retries: 3,
} as const;

