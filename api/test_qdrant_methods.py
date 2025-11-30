"""Test script to check available Qdrant client methods."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from qdrant_client import QdrantClient
from src.config.settings import settings

# Create client
client = QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)

# Check available methods
print("Available methods on QdrantClient:")
methods = [
    m
    for m in dir(client)
    if not m.startswith("_") and callable(getattr(client, m, None))
]
search_methods = [m for m in methods if "search" in m.lower() or "query" in m.lower()]
print("\nSearch/Query related methods:")
for method in search_methods:
    print(f"  - {method}")

print("\nAll methods (first 20):")
for method in methods[:20]:
    print(f"  - {method}")
