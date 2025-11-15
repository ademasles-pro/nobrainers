# 📚 Enterprise Graph Brain - Project Organization Guide

## 📍 Navigation Map

### Essential Files to Know

```
app/
├── layout.tsx               ← Root layout (wraps all pages)
├── globals.css              ← Global styles & CSS variables
├── (routes)/
│   ├── page.tsx            ← Dashboard (home page) - MAIN ENTRY POINT
│   └── graph/page.tsx      ← Graph visualization page
├── components/
│   ├── graph/
│   │   ├── GraphVisualization.tsx  ← D3.js visualization logic
│   │   └── NodeDetailPanel.tsx     ← Side panel for node details
│   └── search/
│       └── SearchBar.tsx           ← Search & filter interface
├── types/graph.ts           ← Core data structures
├── utils/mockData.ts        ← Mock data generator
└── config/constants.ts      ← Global configuration
```

## 🚀 Getting Started

### 1. First-Time Setup
```bash
npm install          # Install all dependencies
npm run dev         # Start dev server
```

### 2. Project Entry Points
- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Graph View**: [http://localhost:3000/graph](http://localhost:3000/graph)

### 3. Key Files to Edit First
1. `app/utils/mockData.ts` - Update mock data or add API calls
2. `app/config/constants.ts` - Configure application behavior
3. `app/(routes)/page.tsx` - Customize dashboard content
4. `app/globals.css` - Adjust colors and styling

## 🎯 Common Tasks

### Add a New Page
```bash
# Create new route
mkdir -p app/(routes)/new-feature
touch app/(routes)/new-feature/page.tsx
```

### Add a New Component
```bash
# Add reusable component
touch app/components/new-section/MyComponent.tsx
```

### Add a New Type
```bash
# Extend types
echo "export interface MyType { }" >> app/types/index.ts
```

### Connect Real Data
1. Create API functions in `app/utils/api.ts`
2. Replace `generateMockGraphData()` calls with API calls
3. Update types in `app/types/api.ts` if needed

## 📊 Data Structure

### Node Types & Their Colors
```
person       → Cyan (#00d4ff)        - Employees with roles
conversation → Green (#10b981)       - Discussions & messages
artifact     → Orange (#f97316)      - Documents & resources
agent        → Purple (#8b5cf6)      - AI assistants
action       → Red (#ef4444)         - Tasks & decisions
```

### Adding New Node Type
1. Update `NodeType` in `app/types/graph.ts`
2. Add color in `app/components/graph/GraphVisualization.tsx`
3. Add to `NODE_TYPE_CONFIG` in `app/config/constants.ts`
4. Update label mapping in `app/components/search/SearchBar.tsx`

## 🔧 Development Workflow

### Make Changes
```bash
# Edit files as needed
code app/components/graph/GraphVisualization.tsx
```

### Test Changes
```bash
# Dev server auto-reloads
# Check http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

### Check for Errors
```bash
npm run lint
```

## 📦 Component Hierarchy

```
Layout
├── Dashboard (/)
│   ├── StatsCard (4 cards)
│   ├── Recent Activity (Card)
│   └── Quick Actions (Card)
└── GraphView (/graph)
    ├── SearchBar
    ├── GraphVisualization (D3.js)
    └── NodeDetailPanel (conditional)
```

## 🎨 Styling & Theme

### CSS Variables (app/globals.css)
```css
--primary: #00d4ff          /* Cyan accent */
--accent: #ff6b35           /* Orange accent */
--background: #0f172a       /* Deep background */
--card: #1e293b             /* Card surface */
```

### Tailwind Classes
```
bg-gradient-primary     → Gradient background
shadow-glow-primary     → Glow effect
animate-slide-in        → Slide animation
```

## 🔗 Linking & Navigation

### Next.js Links
```tsx
import Link from 'next/link';

<Link href="/graph">View Graph</Link>
<Link href="/">Dashboard</Link>
```

## 💾 State Management

### Using Hooks
```tsx
import { useGraphData } from '@/hooks';

const { filteredData, selectedNode, setSelectedNode } = useGraphData();
```

## 🧪 Testing Components

### Local Development
```bash
npm run dev
# Modify components and see changes instantly
```

### Mock Data Testing
All components work with mock data by default (`app/utils/mockData.ts`)

## 📖 Documentation Files

- `README.md` - Project overview & features
- `SETUP.md` - Detailed setup & architecture
- `PROJECT_GUIDE.md` - This file (quick reference)

## 🚨 Common Issues & Solutions

### Graph not showing
- Check browser console for D3 errors
- Verify data format matches `GraphData` interface
- Ensure mock data is loaded

### Styling looks wrong
- Clear browser cache
- Check CSS variables in `globals.css`
- Rebuild with `npm run build`

### TypeScript errors
- Run `npm run lint` to check
- Verify imports use correct paths (`@/...`)
- Check type definitions in `app/types/`

## 🎯 Next Steps After Setup

1. ✅ **Run locally** - `npm run dev`
2. ✅ **Explore pages** - Visit `/` and `/graph`
3. ✅ **Read SETUP.md** - Understand architecture
4. 📝 **Connect backend** - Replace mock data
5. 🎨 **Customize theme** - Adjust colors in `globals.css`
6. 🧩 **Add components** - Extend functionality
7. 📦 **Deploy** - Build and deploy to production

## 🤝 Code Quality

### Best Practices
- Use TypeScript for all files
- Add JSDoc comments to functions
- Keep components under 200 lines
- Use meaningful variable names
- Follow existing patterns

### Component Template
```tsx
'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

/**
 * Description of what this component does
 */
interface MyComponentProps {
  children?: ReactNode;
}

export const MyComponent = ({ children }: MyComponentProps) => {
  return (
    <Card className="p-6">
      {children}
    </Card>
  );
};
```

## 📞 Quick Reference

| Task | File | Command |
|------|------|---------|
| Start dev | - | `npm run dev` |
| Build | - | `npm run build` |
| Lint | - | `npm run lint` |
| Update data | `mockData.ts` | Edit mock data |
| Change theme | `globals.css` | Edit CSS variables |
| Add page | `(routes)/` | Create folder + page.tsx |
| Add component | `components/` | Create .tsx file |

---

**Happy coding! 🚀**

For detailed information, see [SETUP.md](./SETUP.md) and [README.md](./README.md)

