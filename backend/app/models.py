from pydantic import BaseModel
from typing import List, Optional

class Node(BaseModel):
    id: str
    type: str
    content: str
    agent: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    type: str
