#!/bin/bash

# Enterprise Brain - API Examples
# Collection de commandes curl pour tester tous les endpoints

BASE_URL="http://localhost:8000/api"

echo "=========================================="
echo "Enterprise Brain API - Examples"
echo "=========================================="
echo ""
echo "BASE_URL: $BASE_URL"
echo "Make sure backend is running on port 8000"
echo ""

# ===== HELPER FUNCTIONS =====

print_section() {
  echo ""
  echo "─────────────────────────────────────────"
  echo "→ $1"
  echo "─────────────────────────────────────────"
}

run_example() {
  local title="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"

  print_section "$title"
  
  if [ "$method" = "GET" ]; then
    echo "$ curl $BASE_URL$endpoint"
    echo ""
    curl -s -X GET "$BASE_URL$endpoint" | python3 -m json.tool
  else
    echo "$ curl -X $method $BASE_URL$endpoint -H 'Content-Type: application/json' -d '$data'"
    echo ""
    curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" | python3 -m json.tool
  fi
}

# ===== TESTS =====

run_example "1. Health Check" "GET" "/health"

run_example "2. Reset Graph (clear all)" "POST" "/reset" '{}'

run_example "3. Seed Graph (load demo data)" "POST" "/seed" '{}'

run_example "4. Get Full Graph" "GET" "/graph"

run_example "5. Get Specific Node" "GET" "/node/task-1"

run_example "6. Add Custom Node (Task)" "POST" "/add_node" '{
  "id": "task-custom-1",
  "type": "Task",
  "content": "Custom task from curl example",
  "agent": "curl-test"
}'

run_example "7. Add Another Node (Person)" "POST" "/add_node" '{
  "id": "person-custom-1",
  "type": "Person",
  "content": "John Doe (Custom)",
  "agent": "curl-test"
}'

run_example "8. Add Edge between nodes" "POST" "/add_edge" '{
  "source": "person-custom-1",
  "target": "task-custom-1",
  "type": "assigned_to"
}'

run_example "9. Ingest Text (creates Task nodes from text)" "POST" "/ingest_text" '{
  "text": "Préparer la présentation. Valider avec le manager. Envoyer aux stakeholders.",
  "agent": "curl-test"
}'

run_example "10. AI Enrich (adds missing nodes)" "POST" "/ai_enrich" '{}'

run_example "11. Explain Node (show causal path)" "GET" "/explain_node/task-1"

run_example "12. Get Updated Graph" "GET" "/graph"

# ===== ADVANCED EXAMPLES =====

print_section "ADVANCED: Add Multiple Nodes in Sequence"

echo "Creating a workflow structure..."

# Create workflow nodes
for i in {1..3}; do
  echo ""
  echo "Creating workflow step $i..."
  curl -s -X POST "$BASE_URL/add_node" \
    -H "Content-Type: application/json" \
    -d "{
      \"id\": \"workflow-step-$i\",
      \"type\": \"Task\",
      \"content\": \"Workflow step $i\",
      \"agent\": \"curl-advanced\"
    }" | python3 -m json.tool | head -5
done

# Create dependencies
for i in {2..3}; do
  prev=$((i - 1))
  echo ""
  echo "Creating dependency step $prev -> step $i..."
  curl -s -X POST "$BASE_URL/add_edge" \
    -H "Content-Type: application/json" \
    -d "{
      \"source\": \"workflow-step-$i\",
      \"target\": \"workflow-step-$prev\",
      \"type\": \"depends_on\"
    }" | python3 -m json.tool | head -5
done

# ===== JSON FORMATTING EXAMPLES =====

print_section "REFERENCE: JSON Payloads"

echo ""
echo "Add Node Payload:"
cat << 'EOF'
{
  "id": "task-1",
  "type": "Task",
  "content": "Prepare Q3 planning",
  "agent": "AI"
}
EOF

echo ""
echo "Add Edge Payload:"
cat << 'EOF'
{
  "source": "person-1",
  "target": "task-1",
  "type": "assigned_to"
}
EOF

echo ""
echo "Ingest Text Payload:"
cat << 'EOF'
{
  "text": "Task 1. Task 2. Task 3."
}
EOF

# ===== BATCH OPERATIONS =====

print_section "BATCH: Create Test Dataset"

echo ""
echo "Resetting graph..."
curl -s -X POST "$BASE_URL/reset" > /dev/null

echo "Creating nodes..."
NODES=(
  '{"id":"task-a","type":"Task","content":"Design API","agent":"batch"}'
  '{"id":"task-b","type":"Task","content":"Implement API","agent":"batch"}'
  '{"id":"task-c","type":"Task","content":"Test API","agent":"batch"}'
  '{"id":"person-a","type":"Person","content":"Alice (Dev)","agent":"batch"}'
  '{"id":"person-b","type":"Person","content":"Bob (QA)","agent":"batch"}'
)

for node in "${NODES[@]}"; do
  curl -s -X POST "$BASE_URL/add_node" \
    -H "Content-Type: application/json" \
    -d "$node" > /dev/null
  sleep 0.1
done

echo "✓ Created ${#NODES[@]} nodes"

echo ""
echo "Creating edges..."
EDGES=(
  '{"source":"task-b","target":"task-a","type":"depends_on"}'
  '{"source":"task-c","target":"task-b","type":"depends_on"}'
  '{"source":"person-a","target":"task-a","type":"assigned_to"}'
  '{"source":"person-a","target":"task-b","type":"assigned_to"}'
  '{"source":"person-b","target":"task-c","type":"assigned_to"}'
)

for edge in "${EDGES[@]}"; do
  curl -s -X POST "$BASE_URL/add_edge" \
    -H "Content-Type: application/json" \
    -d "$edge" > /dev/null
  sleep 0.1
done

echo "✓ Created ${#EDGES[@]} edges"

print_section "Batch Dataset Created - View Result"
curl -s -X GET "$BASE_URL/graph" | python3 -m json.tool

# ===== PERFORMANCE TEST =====

print_section "PERFORMANCE: Measure Response Time"

echo ""
echo "Testing /graph endpoint performance..."
for i in {1..5}; do
  time_start=$(date +%s%N)
  curl -s -X GET "$BASE_URL/graph" > /dev/null
  time_end=$(date +%s%N)
  elapsed=$((($time_end - $time_start) / 1000000))
  echo "Request $i: ${elapsed}ms"
done

# ===== SUMMARY =====

print_section "Summary"

curl -s -X GET "$BASE_URL/graph" | python3 << 'EOF'
import sys, json
data = json.load(sys.stdin)
print(f"Total Nodes: {len(data['nodes'])}")
print(f"Total Edges: {len(data['edges'])}")
print(f"\nNode Types:")
types = {}
for node in data['nodes']:
    t = node.get('type', 'Unknown')
    types[t] = types.get(t, 0) + 1
for t, count in sorted(types.items()):
    print(f"  - {t}: {count}")
print(f"\nEdge Types:")
edge_types = {}
for edge in data['edges']:
    t = edge.get('type', 'Unknown')
    edge_types[t] = edge_types.get(t, 0) + 1
for t, count in sorted(edge_types.items()):
    print(f"  - {t}: {count}")
EOF

print_section "Done!"

echo ""
echo "Next steps:"
echo "1. Check /docs for interactive Swagger UI"
echo "2. Integrate with n8n (see N8N_INTEGRATION.md)"
echo "3. Integrate with Lovable (see LOVABLE_INTEGRATION.md)"
echo ""
