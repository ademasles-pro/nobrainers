# 🧪 Testing Guide - Enterprise Graph Brain

## Running the Application

### Development Server
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000)
- Changes auto-reload in browser

### Production Build
```bash
npm run build
npm start
```
- Optimized bundle
- Run locally before deploying

## Testing Scenarios

### Dashboard Page (/)
✅ **What to check:**
- 4 statistics cards load correctly
- Recent activity feed displays
- Quick actions buttons are clickable
- AI recommendation section appears
- Graph overview shows node counts
- "Voir le Graphe" button navigates to /graph

**Test Steps:**
1. Go to http://localhost:3000
2. Verify all sections render
3. Click "Voir le Graphe" button
4. Should navigate to /graph

### Graph Visualization (/graph)
✅ **What to check:**
- Force-directed graph renders
- Nodes appear as circles with labels
- Links connect nodes
- Different node types have correct colors:
  - Cyan (Person)
  - Green (Conversation)
  - Orange (Artifact)
  - Purple (Agent)
  - Red (Action)
- Can click nodes to select them
- Detail panel opens on node click

**Test Steps:**
1. Go to http://localhost:3000/graph
2. Verify graph appears with nodes and links
3. Click on different nodes
4. Check node type colors match expected colors
5. Verify detail panel opens/closes correctly

### Search Functionality
✅ **What to check:**
- Search input accepts text
- Graph updates as you type
- Filters dropdown opens
- Can toggle node type filters
- Graph updates when filters change

**Test Steps:**
1. On /graph page, type in search box
2. Graph should filter as you type
3. Click filter icon
4. Uncheck some node types
5. Graph should show only selected types

### Node Detail Panel
✅ **What to check:**
- Shows node icon and label
- Displays node type as badge
- Shows node ID
- Displays metadata (if present)
- Action buttons are present
- Close button works

**Test Steps:**
1. Click any node on graph
2. Verify all information displays
3. Click buttons (they may not function yet)
4. Click X button to close
5. Panel should close

### Responsive Design
✅ **What to check:**
- Layout works on different screen sizes
- Mobile: <640px
- Tablet: 640px-1024px
- Desktop: >1024px

**Test Steps:**
1. Open DevTools (F12)
2. Try different device sizes
3. Verify layout adapts

## Component Testing

### GraphVisualization Component
```tsx
<GraphVisualization
  data={mockGraphData}
  onNodeClick={handleClick}
  selectedNodeId="p1"
/>
```

**Test:**
- Renders without errors
- Nodes are clickable
- Colors match expected
- Zoom/pan work
- D3 simulation runs

### SearchBar Component
```tsx
<SearchBar
  onSearch={setQuery}
  onFilterChange={setFilters}
  selectedFilters={filters}
/>
```

**Test:**
- Input works
- Filters toggle
- Callbacks fire

### StatsCard Component
```tsx
<StatsCard
  title="Personnes"
  value="247"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
/>
```

**Test:**
- Displays title and value
- Icon renders
- Trend shows correctly

## Browser DevTools

### Checking Console
```bash
# Open DevTools: F12 or Cmd+Option+I
# Go to Console tab
# Look for any errors in red
```

### Network Tab
- Check D3 library loads
- Verify CSS loads
- Monitor API calls (when connected)

### React DevTools
- Install React DevTools extension
- Inspect component hierarchy
- Check props values

## Performance Testing

### Lighthouse Audit
```bash
# In Chrome DevTools
- F12 → Lighthouse
- Run audit
- Check scores
```

### Performance Profiler
```bash
# React DevTools
- Profiler tab
- Start recording
- Interact with app
- Stop recording
- Check render times
```

## Common Issues & Debugging

### Issue: Graph doesn't render
**Debug:**
1. Check console for errors
2. Verify D3 library loaded
3. Check browser supports SVG
4. Verify data structure matches interface

### Issue: Styling looks wrong
**Debug:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check CSS variables in globals.css
3. Verify Tailwind classes load
4. Rebuild: `npm run build`

### Issue: Components not updating
**Debug:**
1. Check React DevTools
2. Verify state changes
3. Check for missing dependencies in hooks
4. Look for console warnings

### Issue: Slow performance
**Debug:**
1. Check for unnecessary re-renders
2. Use React DevTools Profiler
3. Check D3 simulation settings
4. Look for large data sets

## Mock Data Testing

### Current Mock Data
- 4 People (Alice, Bob, Carol, David)
- 3 Conversations (Q2 Planning, Feature Review, Design Sync)
- 4 Artifacts (PRD, API Spec, Mockups, Report)
- 3 Agents (Code Reviewer, Doc Assistant, Data Analyzer)
- 3 Actions (Approve Release, Update KPIs, Review Design)

### Generate New Test Data
Edit `app/utils/mockData.ts`:
```typescript
export const generateMockGraphData = (): GraphData => {
  return {
    nodes: [
      // Add more test nodes here
    ],
    links: [
      // Add more test links here
    ],
  };
};
```

## Testing Checklist

### Before Commit
- [ ] App starts without errors: `npm run dev`
- [ ] Dashboard page loads: http://localhost:3000
- [ ] Graph page loads: http://localhost:3000/graph
- [ ] Can search and filter nodes
- [ ] Can click nodes to see details
- [ ] No console errors
- [ ] Responsive on mobile/tablet
- [ ] Styling looks correct

### Before Build
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No unused imports
- [ ] All imports use correct paths (@/...)

## Creating Test Data

### Add a Test Node
```typescript
// In mockData.ts
{
  id: 'p5',
  label: 'Emma Johnson',
  type: 'person',
  metadata: { role: 'CTO', department: 'Engineering' }
}
```

### Add a Test Link
```typescript
// In mockData.ts
{ source: 'p5', target: 'c1', type: 'participated' }
```

## Integration Testing

### Test with Real Backend (Future)
1. Set up Neo4j backend
2. Update `app/utils/api.ts` with real endpoints
3. Replace `generateMockGraphData()` calls
4. Test with real data

### Test API Integration
```typescript
// Create app/utils/api.ts
export async function fetchGraphData() {
  const response = await fetch('/api/graph');
  return response.json();
}
```

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through interactive elements
- [ ] Enter activates buttons
- [ ] Escape closes panels
- [ ] Focus indicators visible

### Screen Reader
- [ ] Labels present for inputs
- [ ] Alt text for images
- [ ] Semantic HTML used
- [ ] ARIA attributes where needed

### Color Contrast
- [ ] Text readable on background
- [ ] Node colors distinguishable
- [ ] Links visible

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Interactive**: < 3.8s
- **Graph Render**: < 500ms
- **Search/Filter**: < 100ms

## Troubleshooting

### Clear Everything
```bash
# Remove all generated files
rm -rf .next node_modules package-lock.json

# Reinstall
npm install
npm run dev
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### TypeScript Issues
```bash
# Rebuild types
rm -rf .next
npm run build
```

---

**Happy Testing! 🚀**

For questions, see [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

