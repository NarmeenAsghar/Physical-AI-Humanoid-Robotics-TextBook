"""
Chat endpoint with RAG and streaming support.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import json

from ..models.schemas import ChatRequest, ChatResponse
from ..services.rag import RAGService
from ..services.llm import LLMService

router = APIRouter()

# Lazy initialization - services will be created when first needed
_rag_service = None
_llm_service = None


def get_rag_service() -> RAGService:
    """Get or create RAG service instance."""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


def get_llm_service() -> LLMService:
    """Get or create LLM service instance."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service


async def generate_sse_stream(
    query: str,
    context: str,
    sources: list,
    llm_service: LLMService,
    conversation_history: list = None,
    selected_text: str = None,
) -> AsyncGenerator[str, None]:
    """
    Generate Server-Sent Events stream for chat response.

    Args:
        query: User's question
        context: Retrieved context from RAG
        sources: Source citations
        conversation_history: Previous messages
        selected_text: Optional selected text

    Yields:
        SSE-formatted chunks
    """
    try:
        # First, send sources
        sources_data = json.dumps({"type": "sources", "sources": sources})
        yield f"data: {sources_data}\n\n"

        # Stream response content
        async for chunk in llm_service.generate_response(
            query=query,
            context=context,
            conversation_history=conversation_history,
            selected_text=selected_text,
        ):
            content_data = json.dumps({"type": "content", "chunk": chunk})
            yield f"data: {content_data}\n\n"

        # Send completion signal
        done_data = json.dumps({"type": "done"})
        yield f"data: {done_data}\n\n"

    except Exception as e:
        error_data = json.dumps({"type": "error", "message": str(e)})
        yield f"data: {error_data}\n\n"


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint with RAG and streaming response.

    Args:
        request: ChatRequest with message, optional selected_text and conversation_history

    Returns:
        StreamingResponse with SSE stream
    """
    try:
        # Get services (lazy initialization)
        rag_service = get_rag_service()
        llm_service = get_llm_service()

        # Retrieve relevant context from Qdrant
        chunks = rag_service.retrieve_context(
            query=request.message, top_k=5, selected_text=request.selected_text
        )

        if not chunks:
            raise HTTPException(
                status_code=404, detail="No relevant content found in the textbook"
            )

        # Build context string for LLM
        context = rag_service.build_context_string(chunks)

        # Extract sources for citation
        sources = rag_service.extract_sources(chunks)

        # Return streaming response
        return StreamingResponse(
            generate_sse_stream(
                query=request.message,
                context=context,
                sources=sources,
                conversation_history=request.conversation_history,
                selected_text=request.selected_text,
                llm_service=llm_service,
            ),
            media_type="text/event-stream",
        )

    except HTTPException:
        raise
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/sync", response_model=ChatResponse)
async def chat_sync(request: ChatRequest):
    """
    Synchronous chat endpoint (for testing without streaming).

    Args:
        request: ChatRequest with message, optional selected_text and conversation_history

    Returns:
        ChatResponse with complete response and sources
    """
    try:
        # Get services (lazy initialization)
        rag_service = get_rag_service()
        llm_service = get_llm_service()

        # Retrieve relevant context from Qdrant
        chunks = rag_service.retrieve_context(
            query=request.message, top_k=5, selected_text=request.selected_text
        )

        if not chunks:
            raise HTTPException(
                status_code=404, detail="No relevant content found in the textbook"
            )

        # Build context string for LLM
        context = rag_service.build_context_string(chunks)

        # Extract sources for citation
        sources = rag_service.extract_sources(chunks)

        # Generate response
        content = await llm_service.generate_response_text(
            query=request.message,
            context=context,
            conversation_history=request.conversation_history,
            selected_text=request.selected_text,
        )

        return ChatResponse(content=content, sources=sources)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
