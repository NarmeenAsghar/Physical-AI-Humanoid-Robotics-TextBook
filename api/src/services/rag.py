"""
RAG (Retrieval-Augmented Generation) service.
Retrieves relevant content chunks from Qdrant for answering questions.
"""

from typing import List, Dict, Any
from qdrant_client import QdrantClient

from ..services.embeddings import EmbeddingService
from ..config.settings import settings


class RAGService:
    """Retrieval service for finding relevant content chunks."""

    def __init__(self):
        """Initialize RAG service with Qdrant client and embeddings."""
        self.client = QdrantClient(
            url=settings.qdrant_url, api_key=settings.qdrant_api_key
        )
        self.embedding_service = EmbeddingService(model_name=settings.embedding_model)
        self.collection_name = settings.collection_name

    def retrieve_context(
        self, query: str, top_k: int = 5, selected_text: str = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve top-k most relevant content chunks for a query.

        Args:
            query: User's question
            top_k: Number of chunks to retrieve (default: 5)
            selected_text: Optional text selected by user for additional context

        Returns:
            List of relevant chunks with content and metadata
        """
        # Build search query (combine query with selected text if provided)
        search_text = query
        if selected_text:
            search_text = f"{selected_text}\n\n{query}"

        # Generate query embedding
        query_embedding = self.embedding_service.embed_text(search_text)

        # Search Qdrant using query_points() method (available in Qdrant client 1.12.1+)
        query_response = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding,  # Pass vector directly
            limit=top_k,
            with_payload=True,
            with_vectors=False,
        )

        # Extract points from QueryResponse
        if hasattr(query_response, "points"):
            points = query_response.points
        elif isinstance(query_response, list):
            points = query_response
        else:
            raise ValueError(f"Unexpected query response type: {type(query_response)}")

        # Extract chunks with metadata
        chunks = []
        for point in points:
            if hasattr(point, "payload") and point.payload:
                chunk = {
                    "content": point.payload.get("content", ""),
                    "chapter": point.payload.get("chapter", 0),
                    "lesson": point.payload.get("lesson", 0),
                    "section": point.payload.get("section", ""),
                    "url": point.payload.get("url", ""),
                    "score": getattr(point, "score", 0.0),
                }
                chunks.append(chunk)

        return chunks

    def build_context_string(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Build a formatted context string from retrieved chunks.

        Args:
            chunks: List of retrieved chunks

        Returns:
            Formatted context string for LLM
        """
        if not chunks:
            return ""

        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            context_parts.append(
                f"[Source {i}] Chapter {chunk['chapter']}, Lesson {chunk['lesson']} - {chunk['section']}:\n"
                f"{chunk['content']}\n"
            )

        return "\n".join(context_parts)

    def extract_sources(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract source citations from retrieved chunks.

        Args:
            chunks: List of retrieved chunks

        Returns:
            List of source dicts with chapter, lesson, section, url
        """
        sources = []
        seen_urls = set()  # Avoid duplicate sources

        print(f"\n[DEBUG] extract_sources called with {len(chunks)} chunks")

        for chunk in chunks:
            url = chunk["url"]
            print(f"[DEBUG] Processing chunk - URL: {url}, Section: {chunk['section']}")

            if url not in seen_urls:
                source = {
                    "chapter": chunk["chapter"],
                    "lesson": chunk["lesson"],
                    "section": chunk["section"],
                    "url": chunk["url"],
                }
                sources.append(source)
                seen_urls.add(url)
                print(f"[DEBUG] Added new source: {source}")
            else:
                print(f"[DEBUG] Skipped duplicate URL: {url}")

        print(f"[DEBUG] Total unique sources: {len(sources)}")
        print(f"[DEBUG] Sources list: {sources}\n")

        return sources
