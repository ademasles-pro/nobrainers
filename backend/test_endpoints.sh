#!/bin/bash

# Test Suite - Enterprise Brain Backend
# Exécute tous les tests pour valider le backend

BASE_URL="http://localhost:8000/api"

echo "====== Enterprise Brain Backend Tests ======"
echo ""

# Test 1: Health Check
echo "[TEST 1] Health Check"
curl -s -X GET "$BASE_URL/health" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 2: Reset Graph
echo "[TEST 2] Reset Graph"
curl -s -X POST "$BASE_URL/reset" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 3: Seed Graph
echo "[TEST 3] Seed Graph with demo data"
curl -s -X POST "$BASE_URL/seed" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 4: Get Full Graph
echo "[TEST 4] Get Full Graph"
curl -s -X GET "$BASE_URL/graph" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 5: Get Specific Node
echo "[TEST 5] Get Specific Node (task-1)"
curl -s -X GET "$BASE_URL/node/task-1" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 6: Add Custom Node
echo "[TEST 6] Add Custom Node"
curl -s -X POST "$BASE_URL/add_node" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "task-custom",
    "type": "Task",
    "content": "Custom task from test",
    "agent": "test"
  }' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 7: Add Edge between custom and existing
echo "[TEST 7] Add Edge"
curl -s -X POST "$BASE_URL/add_edge" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "person-1",
    "target": "task-custom",
    "type": "assigned_to"
  }' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 8: Ingest Text
echo "[TEST 8] Ingest Text"
curl -s -X POST "$BASE_URL/ingest_text" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Finaliser rapport Q3. Valider avec manager. Préparer présentation."
  }' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 9: AI Enrich
echo "[TEST 9] AI Enrich Graph"
curl -s -X POST "$BASE_URL/ai_enrich" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 10: Explain Node
echo "[TEST 10] Explain Node (task-1) - Causal Path"
curl -s -X GET "$BASE_URL/explain_node/task-1" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 11: Get Updated Graph
echo "[TEST 11] Get Updated Graph (final state)"
curl -s -X GET "$BASE_URL/graph" | python3 -m json.tool
echo ""

echo "====== All tests completed ======"
