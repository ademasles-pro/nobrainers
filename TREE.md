# 📁 Enterprise Graph Brain - Complete File Structure

```
enterprise-graph/
│
├── 📄 README.md                          # Main project documentation
├── 📄 SETUP.md                           # Detailed setup & architecture guide
├── 📄 PROJECT_GUIDE.md                   # Quick reference & common tasks
├── 📄 TREE.md                            # This file - project structure
│
├── 📦 package.json                       # Dependencies & scripts
├── 📦 package-lock.json                  # Locked dependency versions
│
├── ⚙️  tsconfig.json                     # TypeScript configuration
├── ⚙️  next.config.ts                    # Next.js configuration
├── ⚙️  tailwind.config.ts                # Tailwind CSS configuration
├── ⚙️  postcss.config.mjs                # PostCSS configuration
├── ⚙️  eslint.config.mjs                 # ESLint configuration
│
├── 📁 public/                            # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   ├── globe.svg
│   ├── window.svg
│   └── file.svg
│
└── 📁 app/                               # Application source code (App Router)
    ├── 🔗 layout.tsx                     # Root layout - wraps all pages
    ├── 🎨 globals.css                    # Global styles & CSS variables
    ├── 🖼️  favicon.ico                   # Browser favicon
    │
    ├── 📁 (routes)/                      # Route group - main application pages
    │   ├── 🏠 page.tsx                   # Dashboard (entry point: /)
    │   └── 📁 graph/
    │       └── 📊 page.tsx               # Graph visualization page (/graph)
    │
    ├── 📁 components/                    # Reusable React components
    │   ├── 📄 index.ts                   # Component exports barrel file
    │   │
    │   ├── 📁 ui/                        # Base UI components (unstyled library)
    │   │   ├── card.tsx                  # Card container component
    │   │   ├── button.tsx                # Button with variants
    │   │   ├── badge.tsx                 # Badge/tag component
    │   │   ├── input.tsx                 # Text input component
    │   │   ├── separator.tsx             # Horizontal/vertical divider
    │   │   └── dropdown-menu.tsx         # Dropdown menu (Radix UI)
    │   │
    │   ├── 📁 dashboard/                 # Dashboard-specific components
    │   │   └── StatsCard.tsx             # Statistics display card
    │   │
    │   ├── 📁 graph/                     # Graph visualization components
    │   │   ├── GraphVisualization.tsx    # D3.js force-directed graph
    │   │   └── NodeDetailPanel.tsx       # Node inspection side panel
    │   │
    │   └── 📁 search/                    # Search & filtering components
    │       └── SearchBar.tsx             # Search input + filter dropdown
    │
    ├── 📁 types/                         # TypeScript type definitions
    │   ├── 📄 index.ts                   # Type exports barrel file
    │   ├── graph.ts                      # Graph data structures (NodeType, GraphNode, etc.)
    │   └── api.ts                        # API request/response types
    │
    ├── 📁 utils/                         # Utility functions
    │   ├── 📄 index.ts                   # Utility exports barrel file
    │   └── mockData.ts                   # Mock graph data generator
    │
    ├── 📁 hooks/                         # Custom React hooks
    │   ├── 📄 index.ts                   # Hook exports barrel file
    │   └── useGraphData.ts               # Graph data management hook
    │
    ├── 📁 lib/                           # Library utilities
    │   └── utils.ts                      # Tailwind merge utility (cn function)
    │
    ├── 📁 config/                        # Application configuration
    │   ├── 📄 index.ts                   # Config exports barrel file
    │   └── constants.ts                  # Global constants & configuration
    │
    └── 📁 node_modules/                  # Installed dependencies (auto-generated)
```

## 📊 Component Architecture

### Pages (Routes)
```
/ (Dashboard)
  ├── Stats Cards (4)
  ├── Recent Activity Card
  ├── Quick Actions Card
  └── Knowledge Graph Overview

/graph (Graph Visualization)
  ├── Header with Search & Filters
  ├── Graph Visualization (D3.js)
  └── Node Detail Panel (conditional)
```

### Component Tree
```
Layout
├── Dashboard Page
│   ├── StatsCard
│   ├── Card
│   │   ├── Button
│   │   └── ActivityItem
│   └── Card
│       ├── Button
│       └── Badge
└── Graph Page
    ├── SearchBar
    │   ├── Input
    │   └── DropdownMenu
    ├── GraphVisualization
    │   └── SVG (D3.js)
    └── NodeDetailPanel
        ├── Card
        ├── Badge
        ├── Separator
        └── Button
```

## 🔄 Data Flow

```
Mock Data (mockData.ts)
    ↓
useGraphData Hook
    ↓
Graph Page Component
    ├── Search/Filter Logic
    ├── GraphVisualization (D3.js rendering)
    └── NodeDetailPanel (display selected node)
```

## 📝 File Categories

### Pages (Entrypoints)
- `app/(routes)/page.tsx` - Dashboard
- `app/(routes)/graph/page.tsx` - Graph View

### UI Components (Reusable)
- `app/components/ui/*.tsx` - Base UI building blocks

### Feature Components
- `app/components/dashboard/` - Dashboard features
- `app/components/graph/` - Graph visualization features
- `app/components/search/` - Search & filter features

### Types
- `app/types/graph.ts` - Graph data structures
- `app/types/api.ts` - API communication types

### Logic
- `app/utils/mockData.ts` - Data generation
- `app/hooks/useGraphData.ts` - Graph state management
- `app/lib/utils.ts` - Helper utilities
- `app/config/constants.ts` - Configuration

### Styling
- `app/globals.css` - Global styles & CSS variables
- `tailwind.config.ts` - Tailwind configuration

## 🎯 Where to Add New Code

| What | Where | Example |
|------|-------|---------|
| New Page | `app/(routes)/feature/page.tsx` | Analytics dashboard |
| New Component | `app/components/feature/Component.tsx` | CustomChart |
| New Type | `app/types/feature.ts` | chartTypes.ts |
| New Hook | `app/hooks/useFeature.ts` | useChartData |
| New Utility | `app/utils/feature.ts` | chartUtils.ts |
| Styling | `app/globals.css` | New CSS classes |
| Constants | `app/config/constants.ts` | Feature config |

## 🔑 Key Files

| File | Purpose | Edit For |
|------|---------|----------|
| `package.json` | Dependencies | Adding new libraries |
| `globals.css` | Theme & styles | Colors, fonts, animations |
| `tailwind.config.ts` | Tailwind config | Custom theme values |
| `layout.tsx` | Root layout | Global layout changes |
| `mockData.ts` | Test data | Adding test scenarios |
| `constants.ts` | App config | Feature flags, API URLs |

## 📦 Dependencies Structure

```
next/              - Next.js framework
react/             - React library
d3/                - Data visualization (graph)
lucide-react/      - Icons
tailwindcss/       - Styling
@radix-ui/         - UI primitives
class-variance-authority/ - Component variants
clsx/              - Class name utilities
tailwind-merge/    - Tailwind class merging
```

---

**Generated on Project Setup**

For detailed information:
- 📖 [README.md](./README.md) - Overview & features
- 🔧 [SETUP.md](./SETUP.md) - Architecture & setup
- 📚 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - Quick reference

