"""
Embedding service using Qdrant FastEmbed for local, free embedding generation.
"""
from typing import List
from fastembed import TextEmbedding


class EmbeddingService:
    """Handles text embedding generation using FastEmbed."""

    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        """
        Initialize FastEmbed model.

        Args:
            model_name: FastEmbed model name (default: BAAI/bge-small-en-v1.5, 384-dim)
        """
        self.model_name = model_name
        self.model = None

    def _ensure_model_loaded(self):
        """Lazy load the embedding model on first use."""
        if self.model is None:
            print(f"Loading FastEmbed model: {self.model_name}...")
            self.model = TextEmbedding(model_name=self.model_name)
            print(f"✓ FastEmbed model loaded")

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.

        Args:
            text: Input text to embed

        Returns:
            384-dimensional embedding vector
        """
        self._ensure_model_loaded()
        embeddings = list(self.model.embed([text]))
        return embeddings[0].tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.

        Args:
            texts: List of input texts

        Returns:
            List of 384-dimensional embedding vectors
        """
        self._ensure_model_loaded()
        embeddings = list(self.model.embed(texts))
        return [emb.tolist() for emb in embeddings]
