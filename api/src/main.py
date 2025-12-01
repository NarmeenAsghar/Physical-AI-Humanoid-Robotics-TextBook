"""
FastAPI application entry point.
Physical AI Chatbot API with RAG capabilities.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import settings
from .routes import health, chat, auth, user

# Create FastAPI app
app = FastAPI(
    title="Physical AI Chatbot API",
    description="RAG-based chatbot for Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(user.router, prefix="/api", tags=["user"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Physical AI Chatbot API", "version": "1.0.0", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3001)
