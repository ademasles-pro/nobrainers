# 🛠️ Useful Commands - Enterprise Graph Brain

Quick reference for commonly used commands during development.

## Development

### Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm start
# Open http://localhost:3000
```

### Check for Errors
```bash
npm run lint
```

## Project Structure

### List All Files
```bash
find app -type f \( -name "*.ts" -o -name "*.tsx" \) | sort
```

### Show Project Tree
```bash
tree app -I 'node_modules'
# or
ls -R app/
```

### Check Folder Sizes
```bash
du -sh app/*/
```

## Dependencies

### Install All Dependencies
```bash
npm install
```

### Install Specific Package
```bash
npm install d3@latest
npm install --save-dev @types/d3@latest
```

### Update All Packages
```bash
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Check for Security Issues
```bash
npm audit
npm audit fix
```

### List Installed Packages
```bash
npm list --depth=0
```

### Remove Unused Dependencies
```bash
npm prune
```

## Git Operations

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "feat: your feature description"
```

### View Commit History
```bash
git log --oneline -10
```

### Create New Branch
```bash
git checkout -b feature/your-feature
```

### Push Changes
```bash
git push origin feature/your-feature
```

## File Operations

### Create New Component
```bash
# Interactive
mkdir -p app/components/new-feature
touch app/components/new-feature/Component.tsx

# or use template
cat > app/components/new-feature/Component.tsx << 'EOF'
'use client';

export const Component = () => {
  return <div>Component</div>;
};
EOF
```

### Create New Page
```bash
mkdir -p app/\(routes\)/new-page
touch app/\(routes\)/new-page/page.tsx
```

### Create New Type
```bash
touch app/types/newTypes.ts
```

### Create New Utility
```bash
touch app/utils/newUtils.ts
```

## Cleanup & Maintenance

### Clear Next.js Cache
```bash
rm -rf .next
```

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Format Code (if prettier is installed)
```bash
npx prettier --write "app/**/*.{ts,tsx}"
```

### Clean All Generated Files
```bash
rm -rf .next node_modules dist
```

## Debugging

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Check ESLint Issues
```bash
npx eslint app/
```

### View Bundle Analysis
```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Then analyze
ANALYZE=true npm run build
```

## Development Workflow

### Work on New Feature
```bash
# 1. Create branch
git checkout -b feature/graph-improvements

# 2. Start dev server
npm run dev

# 3. Make changes and test

# 4. Commit changes
git add .
git commit -m "feat: improve graph visualization"

# 5. Push
git push origin feature/graph-improvements
```

### Prepare for Deployment
```bash
# 1. Check for errors
npm run lint

# 2. Build
npm run build

# 3. Test build locally
npm start

# 4. Commit and push
git add .
git commit -m "build: prepare for production"
git push
```

## Environment

### View Environment Variables
```bash
env | grep NEXT_PUBLIC
```

### Create .env.local
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

## Performance

### Check Component Performance
```bash
# Use React DevTools Profiler in browser
# F12 → React DevTools → Profiler tab
```

### Check Bundle Size
```bash
npm run build
# Check .next/static/chunks/
```

### Lighthouse Audit
```bash
# In Chrome DevTools: F12 → Lighthouse
# or use CLI:
npm install -g lighthouse
lighthouse http://localhost:3000
```

## Docker (If Using)

### Build Docker Image
```bash
docker build -t enterprise-graph .
```

### Run Docker Container
```bash
docker run -p 3000:3000 enterprise-graph
```

## Port Management

### Find Process on Port 3000
```bash
lsof -i :3000
# or on Windows:
netstat -ano | findstr :3000
```

### Kill Process on Port 3000
```bash
kill -9 <PID>
# or on Windows:
taskkill /PID <PID> /F
```

### Use Different Port
```bash
npm run dev -- -p 3001
```

## Database (When Implemented)

### Connect to Local Neo4j
```bash
# Start Neo4j (if using Docker)
docker run --name neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest

# Access: http://localhost:7474
```

### Run Migrations
```bash
npm run db:migrate
# (when database setup is added)
```

## Testing (When Implemented)

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Code Quality

### Sort Imports
```bash
npx sort-imports -r app/
```

### Fix Common Issues
```bash
# Fix import statements
npm install -g import-js
```

## Quick Commands Summary

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Start prod | `npm start` |
| Lint | `npm run lint` |
| Install | `npm install` |
| Update | `npm update` |
| Audit | `npm audit` |
| New branch | `git checkout -b feature/name` |
| Add changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| View logs | `git log --oneline` |
| Clear cache | `rm -rf .next` |
| Reinstall | `rm -rf node_modules && npm install` |

## Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias start-dev="npm run dev"
alias build="npm run build"
alias lint="npm run lint"
alias clean="rm -rf .next node_modules && npm install"
alias serve="npm start"
alias audit="npm audit fix"
```

Then use:
```bash
start-dev      # Runs npm run dev
build          # Runs npm run build
lint           # Runs npm run lint
clean          # Full clean reinstall
serve          # Runs npm start
audit          # Runs npm audit fix
```

## Troubleshooting Commands

### Reset Everything
```bash
git clean -fd
git reset --hard HEAD
rm -rf node_modules .next
npm install
```

### Check Node Version
```bash
node --version
npm --version
```

### Verify Setup
```bash
npm run build && npm start
```

---

**Pro Tips:**
- Use `npm run dev` for fastest iteration
- Check `npm run lint` before committing
- Use branches for new features
- Test builds with `npm run build` before deploying

For detailed commands and workflows, see [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

