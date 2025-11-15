import { GraphData } from '@/types/graph';

/**
 * Generates mock graph data for development and demonstration
 * Returns a realistic enterprise graph with nodes representing people, conversations, artifacts, etc.
 */
export const generateMockGraphData = (): GraphData => {
  return {
    nodes: [
      // People: Employees with roles and departments
      { id: 'p1', label: 'Alice Chen', type: 'person', metadata: { role: 'Product Manager', department: 'Product' } },
      { id: 'p2', label: 'Bob Smith', type: 'person', metadata: { role: 'Tech Lead', department: 'Engineering' } },
      { id: 'p3', label: 'Carol White', type: 'person', metadata: { role: 'Designer', department: 'Design' } },
      { id: 'p4', label: 'David Lee', type: 'person', metadata: { role: 'Data Analyst', department: 'Analytics' } },
      
      // Conversations: Slack, Teams, or meeting discussions
      { id: 'c1', label: 'Q2 Planning', type: 'conversation', metadata: { channel: 'Slack', date: '2025-01-10' } },
      { id: 'c2', label: 'Feature Review', type: 'conversation', metadata: { channel: 'Teams', date: '2025-01-12' } },
      { id: 'c3', label: 'Design Sync', type: 'conversation', metadata: { channel: 'Slack', date: '2025-01-14' } },
      
      // Artifacts: Documents, specs, reports
      { id: 'a1', label: 'PRD: New Dashboard', type: 'artifact', metadata: { type: 'Document', status: 'Draft' } },
      { id: 'a2', label: 'API Spec v2', type: 'artifact', metadata: { type: 'Technical Doc', status: 'Approved' } },
      { id: 'a3', label: 'Design Mockups', type: 'artifact', metadata: { type: 'Figma', status: 'In Review' } },
      { id: 'a4', label: 'Analytics Report', type: 'artifact', metadata: { type: 'Report', status: 'Published' } },
      
      // Agents: AI assistants performing tasks
      { id: 'ag1', label: 'Code Reviewer', type: 'agent', metadata: { model: 'GPT-4', task: 'Code Review' } },
      { id: 'ag2', label: 'Doc Assistant', type: 'agent', metadata: { model: 'Gemini', task: 'Documentation' } },
      { id: 'ag3', label: 'Data Analyzer', type: 'agent', metadata: { model: 'Claude', task: 'Analytics' } },
      
      // Actions: Tasks and decisions
      { id: 'ac1', label: 'Approve Release', type: 'action', metadata: { status: 'Pending', priority: 'High' } },
      { id: 'ac2', label: 'Update KPIs', type: 'action', metadata: { status: 'In Progress', priority: 'Medium' } },
      { id: 'ac3', label: 'Review Design', type: 'action', metadata: { status: 'Completed', priority: 'High' } },
    ],
    links: [
      // People to Conversations: who participated in what
      { source: 'p1', target: 'c1', type: 'participated' },
      { source: 'p2', target: 'c1', type: 'participated' },
      { source: 'p1', target: 'c2', type: 'participated' },
      { source: 'p3', target: 'c3', type: 'participated' },
      
      // Conversations to Artifacts: what discussions produced
      { source: 'c1', target: 'a1', type: 'generated' },
      { source: 'c2', target: 'a2', type: 'referenced' },
      { source: 'c3', target: 'a3', type: 'created' },
      
      // People to Artifacts: who created what
      { source: 'p1', target: 'a1', type: 'authored' },
      { source: 'p2', target: 'a2', type: 'authored' },
      { source: 'p3', target: 'a3', type: 'authored' },
      { source: 'p4', target: 'a4', type: 'authored' },
      
      // Agents to Artifacts: AI assistance on documents
      { source: 'ag1', target: 'a2', type: 'reviewed' },
      { source: 'ag2', target: 'a1', type: 'assisted' },
      { source: 'ag3', target: 'a4', type: 'analyzed' },
      
      // Actions to Artifacts: what tasks affect what documents
      { source: 'ac1', target: 'a2', type: 'requires' },
      { source: 'ac2', target: 'a4', type: 'updates' },
      { source: 'ac3', target: 'a3', type: 'reviews' },
      
      // People to Actions: who is assigned what
      { source: 'p1', target: 'ac1', type: 'assigned' },
      { source: 'p4', target: 'ac2', type: 'assigned' },
      { source: 'p3', target: 'ac3', type: 'completed' },
      
      // Cross-references: related artifacts and suggestions
      { source: 'a1', target: 'a4', type: 'references' },
      { source: 'c1', target: 'ac1', type: 'initiated' },
      { source: 'ag3', target: 'ac2', type: 'recommends' },
    ],
  };
};

