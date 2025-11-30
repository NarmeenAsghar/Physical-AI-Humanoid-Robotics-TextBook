# Physical AI Chatbot API

RAG-based chatbot backend for the Physical AI & Humanoid Robotics textbook.

## Architecture

- **Framework**: FastAPI with `uv` package manager
- **LLM**: Gemini 1.5 Flash via OpenAI Agents SDK (free tier)
- **Embeddings**: Qdrant FastEmbed - BAAI/bge-small-en-v1.5 (384-dim, local, free)
- **Vector DB**: Qdrant Cloud (free tier)
- **Cost**: $0 (all free services)

## Setup

### 1. Install dependencies (in separate terminal)

```bash
cd api
export PATH="$HOME/.local/bin:$PATH"

# Install dependencies
uv add fastapi uvicorn fastembed agents qdrant-client pydantic pydantic-settings python-dotenv httpx tiktoken sse-starlette

# Install dev dependencies  
uv add --dev pytest pytest-asyncio httpx
```

### 2. Test Qdrant connection

```bash
uv run python scripts/test_qdrant.py
```

### 3. Index textbook content

```bash
uv run python scripts/index_content.py
```

### 4. Start API server

```bash
uv run uvicorn src.main:app --reload --port 8000
```

## API Endpoints

- **GET /api/health** - Health check
- **POST /api/chat** - Chat with streaming (SSE)
- **POST /api/chat/sync** - Chat without streaming

## Features Implemented

✅ All backend Phase 0-3 complete!

See full documentation in this file for usage details.
