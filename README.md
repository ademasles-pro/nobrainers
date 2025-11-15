# 🧠 Enterprise Graph Brain

> An intelligent knowledge visualization platform that serves as the **nervous system** of your enterprise. Connect people, conversations, artifacts, AI agents, and operational actions into a unified, searchable knowledge graph.

![Enterprise Graph Brain](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![D3.js](https://img.shields.io/badge/D3.js-7.8-orange?logo=d3.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## 🚀 Features

### Core Visualization
- **Interactive Force-Directed Graph** - D3.js powered visualization with zoom, pan, and drag support
- **Real-time Search & Filtering** - Find nodes across your enterprise knowledge instantly
- **Node Type Differentiation** - Visual distinction between people, conversations, artifacts, agents, and actions
- **Smart Detail Panel** - Explore node metadata, relationships, and contextual information

### Dashboard
- **Key Metrics** - Track people, conversations, artifacts, and AI agents
- **Recent Activity Feed** - Stay updated on conversations, approvals, and system actions
- **Quick Actions** - Rapid access to common operations
- **AI Recommendations** - Intelligent suggestions based on your graph data

### Design
- **Professional Dark Theme** - Eye-friendly, modern interface optimized for long work sessions
- **Responsive Layout** - Adapts seamlessly from desktop to tablet displays
- **Smooth Animations** - Polished interactions and transitions
- **Accessibility First** - Built with keyboard navigation and screen readers in mind

## 🏗️ Architecture

### Node Types

```typescript
type NodeType = 'person' | 'conversation' | 'artifact' | 'agent' | 'action'

// Examples:
- person        → Employees with roles, departments, expertise
- conversation  → Slack/Teams messages, meeting transcripts, discussions
- artifact      → Documents, specs, PRDs, reports, code
- agent         → AI assistants (Code Reviewer, Doc Assistant, Data Analyzer)
- action        → Tasks, decisions, workflows, approvals
```

### Data Flow

```
Enterprise Sources
    ↓
Data Connectors (Slack, Jira, Notion, GitHub, etc.)
    ↓
Neo4j/Neptune Graph Database
    ↓
API Endpoints
    ↓
Enterprise Graph Brain (This Application)
    ↓
Dashboard + Graph Visualization + AI-Powered Insights
```

## 📦 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - React metaframework with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org) - Type-safe JavaScript
- **Visualization**: [D3.js 7](https://d3js.org) - Data-driven document manipulation
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Components**: [Radix UI](https://radix-ui.com) - Unstyled, accessible primitives
- **Utilities**: CVA, clsx, tailwind-merge - Type-safe component variants and class merging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd enterprise-graph

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
enterprise-graph/
├── app/
│   ├── (routes)/              # Next.js route groups
│   │   ├── page.tsx          # Dashboard home page
│   │   └── graph/page.tsx    # Graph visualization page
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Base UI components (Card, Button, etc.)
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── graph/           # Graph visualization components
│   │   └── search/          # Search and filtering components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── lib/                 # Library utilities
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── next.config.ts           # Next.js config
└── SETUP.md                 # Detailed setup guide
```

## 🎨 Design System

### Color Palette (Dark Mode - Default)
```
Primary (Cyan):      #00d4ff
Accent (Orange):     #ff6b35
Background:          #0f172a
Surface:             #1e293b
```

### Node Colors
```
Person       → Cyan      #00d4ff
Conversation → Green     #10b981
Artifact     → Orange    #f97316
Agent        → Purple    #8b5cf6
Action       → Red       #ef4444
```

## 🔗 API Endpoints (To Be Implemented)

```
GET  /api/graph/nodes          - Get all graph nodes
GET  /api/graph/links          - Get all connections
POST /api/graph/search         - Full-text search
GET  /api/context/user/{id}    - User context
GET  /api/explain/decision/{id} - Decision reasoning
GET  /api/recommend/docs       - Document recommendations
```

## 📚 Component Guide

### GraphVisualization
Main visualization component using D3.js
```tsx
<GraphVisualization
  data={graphData}
  onNodeClick={handleNodeSelect}
  selectedNodeId={selectedId}
/>
```

### SearchBar
Search and filter interface
```tsx
<SearchBar
  onSearch={setQuery}
  onFilterChange={setFilters}
  selectedFilters={filters}
/>
```

### StatsCard
Statistics display component
```tsx
<StatsCard
  title="Personnes"
  value="247"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
  description="Employés actifs"
/>
```

## 🔄 Roadmap

- [ ] Neo4j/Neptune integration
- [ ] Real data connectors (Slack, Jira, Notion)
- [ ] Timeline view of activities
- [ ] 3D graph visualization (Three.js)
- [ ] Advanced filtering and analytics
- [ ] Export functionality (PNG, SVG, JSON)
- [ ] User authentication and multi-tenancy
- [ ] Graph traversal explanations
- [ ] AI-powered insights and recommendations
- [ ] Full-text search with embeddings

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Keep components modular and reusable
2. Add TypeScript types for all props
3. Include JSDoc comments
4. Follow existing naming conventions
5. Test changes locally before committing

## 📝 License

This project is part of an enterprise hackathon initiative. Check with your organization for licensing details.

## 🙋 Support & Questions

For setup and integration questions, refer to [SETUP.md](./SETUP.md) for detailed documentation.

---

**Built with ❤️ for enterprise knowledge management**
