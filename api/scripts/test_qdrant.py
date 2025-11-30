"""
Test Qdrant connection.
Verifies that Qdrant credentials are correct and connection works.

Usage:
    python scripts/test_qdrant.py
"""
import sys
from pathlib import Path

# Add parent directory to path to import src package
sys.path.insert(0, str(Path(__file__).parent.parent))

from qdrant_client import QdrantClient
from src.config.settings import settings


def main():
    """Test Qdrant connection."""
    print("="* 60)
    print("Testing Qdrant Connection")
    print("="* 60)

    print(f"\nQdrant URL: {settings.qdrant_url}")
    print(f"Collection: {settings.collection_name}")

    try:
        # Initialize client
        client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )

        # Get collections
        collections = client.get_collections()
        print(f"\n✓ Connection successful!", collections)
        print(f"  Available collections: {len(collections.collections)}")

        for collection in collections.collections:
            print(f"    - {collection.name}")

        print("\n" + "="* 60)
        print("✓ Qdrant connection test passed!")
        print("="* 60)

    except Exception as e:
        print(f"\n✗ Connection failed: {str(e)}")
        print("\nPlease check:")
        print("  1. QDRANT_URL is correct in .env")
        print("  2. QDRANT_API_KEY is correct in .env")
        print("  3. Network connection is available")
        sys.exit(1)


if __name__ == "__main__":
    main()
