"""
Pydantic models for API request/response schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class Source(BaseModel):
    """Source citation for chatbot responses."""
    chapter: int = Field(..., description="Chapter number")
    lesson: int = Field(..., description="Lesson number within chapter")
    section: str = Field(..., description="Section name")
    url: str = Field(..., description="URL to the source page")


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str = Field(..., description="User's question or message")
    selected_text: Optional[str] = Field(None, description="Text selected by user (for context)")
    current_page: Optional[str] = Field(None, description="Current page URL user is on")
    conversation_history: List[dict] = Field(default_factory=list, description="Previous messages")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What is embodied intelligence?",
                "selected_text": None,
                "current_page": "/docs/chapter-01-foundations/lesson-01",
                "conversation_history": []
            }
        }


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    content: str = Field(..., description="Generated response content")
    sources: List[Source] = Field(..., description="Source citations for the response")

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Embodied intelligence refers to AI systems that interact with the physical world...",
                "sources": [
                    {
                        "chapter": 1,
                        "lesson": 1,
                        "section": "Introduction to Embodied Intelligence",
                        "url": "/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence"
                    }
                ]
            }
        }


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
