"""
Content indexing service for Qdrant vector database.
Reads markdown files, chunks them, generates embeddings, and stores in Qdrant.
"""
from pathlib import Path
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid

from ..utils.chunker import MarkdownChunker
from ..services.embeddings import EmbeddingService
from ..config.settings import settings


class ContentIndexer:
    """Indexes textbook content into Qdrant vector database."""

    def __init__(self):
        """Initialize indexer with Qdrant client and embedding service."""
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )
        self.chunker = MarkdownChunker()
        self.embedding_service = EmbeddingService(model_name=settings.embedding_model)
        self.collection_name = settings.collection_name

    def create_collection(self):
        """Create Qdrant collection with 384-dimensional vectors."""
        # Check if collection exists
        collections = self.client.get_collections().collections
        collection_exists = any(c.name == self.collection_name for c in collections)

        if collection_exists:
            print(f"Collection '{self.collection_name}' already exists")
            return

        # Create collection with 384-dim vectors (BAAI/bge-small-en-v1.5)
        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
        print(f"✓ Created collection '{self.collection_name}'")

    def index_markdown_files(self, docs_path: str = "docs/docs") -> int:
        """
        Index all markdown lesson files from docs directory.

        Args:
            docs_path: Path to docs directory (relative to project root)

        Returns:
            Number of chunks indexed
        """
        # Find all lesson markdown files
        docs_dir = Path(docs_path)
        lesson_files = list(docs_dir.glob("chapter-*/lesson-*.md"))

        if not lesson_files:
            print(f"No lesson files found in {docs_path}")
            return 0

        print(f"Found {len(lesson_files)} lesson files")

        all_chunks = []
        all_texts = []

        # Process each file
        for filepath in lesson_files:
            print(f"Processing: {filepath.name}")

            # Read file content
            content = filepath.read_text(encoding='utf-8')

            # Extract metadata from path
            metadata = self.chunker.extract_metadata_from_path(filepath)

            # Chunk by headings
            chunks = self.chunker.chunk_by_headings(content, metadata)

            # Collect chunks and texts
            for chunk in chunks:
                all_chunks.append(chunk)
                all_texts.append(chunk["content"])

        print(f"Generated {len(all_chunks)} content chunks")

        # Generate embeddings in batch
        print("Generating embeddings with FastEmbed...")
        embeddings = self.embedding_service.embed_batch(all_texts)
        print(f"✓ Generated {len(embeddings)} embeddings")

        # Prepare points for Qdrant
        points = []
        for chunk, embedding in zip(all_chunks, embeddings):
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "content": chunk["content"],
                    "chapter": chunk["chapter"],
                    "lesson": chunk["lesson"],
                    "section": chunk["section"],
                    "url": chunk["url"]
                }
            )
            points.append(point)

        # Upsert to Qdrant
        print(f"Uploading {len(points)} points to Qdrant...")
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        print(f"✓ Indexed {len(points)} chunks into Qdrant")

        return len(points)

    def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the indexed collection."""
        try:
            info = self.client.get_collection(collection_name=self.collection_name)
            return {
                "name": self.collection_name,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": "healthy"
            }
        except Exception as e:
            return {
                "name": self.collection_name,
                "status": "error",
                "error": str(e)
            }
