"""
Content indexing script.
Reads textbook markdown files and indexes them into Qdrant.

Usage:
    python scripts/index_content.py
"""
import sys
from pathlib import Path

# Add parent directory to path to import src package
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.services.indexer import ContentIndexer


def main():
    """Run content indexing."""
    print("="* 60)
    print("Physical AI Chatbot - Content Indexing")
    print("="* 60)

    indexer = ContentIndexer()

    # Create collection
    print("\n1. Creating Qdrant collection...")
    indexer.create_collection()

    # Index content
    print("\n2. Indexing textbook content...")
    # Path relative to api/ directory
    docs_path = "../docs/docs"
    num_chunks = indexer.index_markdown_files(docs_path)

    # Show collection info
    print("\n3. Collection info:")
    info = indexer.get_collection_info()
    print(f"   Collection: {info['name']}")
    print(f"   Status: {info['status']}")
    if 'points_count' in info:
        print(f"   Points: {info['points_count']}")

    print("\n" + "="* 60)
    print(f"✓ Indexing complete! {num_chunks} chunks indexed.")
    print("="* 60)


if __name__ == "__main__":
    main()
