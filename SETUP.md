# Enterprise Graph Brain - Setup & Structure

## 📋 Project Overview

Enterprise Graph Brain is an intelligent knowledge visualization platform designed to serve as the "nervous system" of your enterprise. It connects people, conversations, artifacts, AI agents, and operational actions into a unified, searchable knowledge graph.

### Key Features

✅ **Interactive Graph Visualization** - D3.js powered force-directed graph  
✅ **Real-time Search & Filtering** - Find nodes by type or query  
✅ **Node Detail Inspection** - Explore metadata and relationships  
✅ **Dashboard Overview** - Statistics, recent activity, quick actions  
✅ **Professional Dark Theme** - Built-in modern, eye-friendly design  

## 🗂️ Project Structure

```
app/
├── (routes)/              # Next.js route groups
│   ├── page.tsx          # Dashboard (main entry point)
│   └── graph/
│       └── page.tsx      # Graph visualization page
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── separator.tsx
│   │   └── dropdown-menu.tsx
│   ├── dashboard/        # Dashboard-specific components
│   │   └── StatsCard.tsx
│   ├── graph/           # Graph visualization components
│   │   ├── GraphVisualization.tsx    # D3.js visualization
│   │   └── NodeDetailPanel.tsx       # Detail panel for nodes
│   └── search/          # Search components
│       └── SearchBar.tsx
├── types/               # TypeScript type definitions
│   └── graph.ts         # Graph data structures
├── utils/               # Utility functions
│   └── mockData.ts      # Mock data generator
├── lib/                 # Library utilities
│   └── utils.ts         # Tailwind merge utilities
├── layout.tsx           # Root layout
├── globals.css          # Global styles & CSS variables
└── favicon.ico
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- **Next.js 16.0.3** - React framework for production
- **React 19.2.0** - UI library
- **D3 7.8.5** - Data visualization (force-directed graphs)
- **Lucide React 0.408.0** - Beautiful icon library

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **CVA (Class Variance Authority)** - Type-safe component variants
- **Radix UI** - Unstyled, accessible component primitives
- **clsx & tailwind-merge** - Utility for managing Tailwind classes

## 🎨 Design System

### Color Palette

**Dark Mode (Default):**
- Background: `#0f172a` (Deep blue-black)
- Foreground: `#f1f5f9` (Light slate)
- Primary: `#00d4ff` (Cyan)
- Accent: `#ff6b35` (Orange)

**Node Types:**
- **Person**: Cyan `#00d4ff`
- **Conversation**: Green `#10b981`
- **Artifact**: Orange `#f97316`
- **Agent**: Purple `#8b5cf6`
- **Action**: Red `#ef4444`

### Typography
- Font: Geist Sans (Google Font)
- Monospace: Geist Mono

## 🔧 Key Components

### GraphVisualization
D3.js force-directed graph with:
- Zoom & pan capabilities
- Draggable nodes
- Color-coded node types
- Interactive node selection

### SearchBar
- Full-text search across graph
- Filter by node type
- Real-time filtering

### NodeDetailPanel
- Display node metadata
- Show node ID and type
- Action buttons for exploration

### Dashboard
- 4 key statistics cards
- Recent activity feed
- Quick action buttons
- AI recommendations

## 💾 Data Structure

### GraphNode
```typescript
interface GraphNode {
  id: string;              // Unique identifier
  label: string;           // Display name
  type: NodeType;          // 'person' | 'conversation' | 'artifact' | 'agent' | 'action'
  metadata?: Record<string, any>;  // Additional data
  x?: number;              // D3 position
  y?: number;
  fx?: number | null;      // Fixed position
  fy?: number | null;
}
```

### GraphLink
```typescript
interface GraphLink {
  source: string | GraphNode;  // Source node ID or object
  target: string | GraphNode;  // Target node ID or object
  type?: string;               // Relationship type
  strength?: number;           // Link strength
}
```

## 🔄 Next Steps

### To Connect Real Data:

1. **Replace Mock Data** - Update `app/utils/mockData.ts` with API calls
2. **Add API Integration** - Create data fetching hooks in `app/utils/`
3. **Neo4j Connection** - Set up backend API endpoints for graph queries
4. **Authentication** - Add user session management

### To Enhance UI:

1. **Add Animations** - More D3 transitions and hover effects
2. **Timeline View** - Add chronological view of activities
3. **Export Features** - PNG/SVG graph export
4. **Full-screen Mode** - Maximize graph visualization
5. **Custom Filters** - Advanced filtering by date, department, etc.

## 📝 Contributing

When adding new features:
1. Place UI components in `app/components/`
2. Add types to `app/types/`
3. Add utilities to `app/utils/`
4. Follow existing naming conventions
5. Keep components modular and reusable
6. Add JSDoc comments for clarity

## 🤝 Integration Points

The application is ready to connect with:
- **Neo4j/Neptune** - Graph database backend
- **Slack/Teams** - Activity feeds
- **Notion/Confluence** - Artifact storage
- **Jira/GitHub** - Task tracking
- **Email/Calendar** - Communication logs

## 📚 Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Visualization**: D3.js v7
- **Icons**: Lucide React
- **Components**: Radix UI Primitives
- **State**: React Hooks (useState, useMemo)

## 🐛 Troubleshooting

### Graph not rendering?
- Check browser console for errors
- Ensure data format matches GraphData interface
- Verify D3 version compatibility

### Styling issues?
- Clear `.next` directory: `rm -rf .next`
- Rebuild: `npm run build`
- Check CSS variable definitions in `globals.css`

### Import errors?
- Verify path aliases in `tsconfig.json`
- Ensure component file names match imports

## 📞 Support

For detailed information about each component, check JSDoc comments in the source files.

