feature: 004-rag-chatbot
created: 2025-11-29
status: Draft

prompt: |
  Generate an implementation plan for the RAG chatbot feature based on the updated `spec.md`, ensuring high quality, explicit technical requirements, separation of backend, and use of `uv` package manager. The plan should cover scope, key decisions, API contracts, NFRs, data management, operational readiness, risk analysis, evaluation, and constitution compliance.

# Implementation Plan: RAG-Based Chatbot

---

## Summary

Implement a production-ready RAG (Retrieval-Augmented Generation) chatbot embedded in the Physical AI & Humanoid Robotics Docusaurus textbook. The chatbot will answer questions from textbook content, support text-selection queries, provide navigation links, and guide students through the curriculum.

**Technical Approach**:
1. **Backend**: FastAPI (Python 3.11+) with `uv` package manager in separate `api/` directory
2. **Vector Store**: Qdrant Cloud (free tier) for semantic search
3. **LLM**: Gemini 1.5 Flash via OpenAI Agents SDK (custom provider)
4. **Embeddings**: Qdrant FastEmbed (free, local embeddings)
5. **Frontend**: React components integrated into Docusaurus via theme swizzling
6. **Communication**: Server-Sent Events (SSE) for streaming responses

---

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript/React (Frontend)  
**Primary Dependencies**: FastAPI, Qdrant Client, Qdrant FastEmbed, OpenAI Agents SDK, React  
**Storage**: Qdrant Cloud (vector store), In-memory (session state)  
**Testing**: pytest + pytest-asyncio (Backend), Jest (Frontend)  
**Target Platform**: GitHub Pages (Frontend), Any Python host (Backend - Render/Railway recommended)  
**Project Type**: Web application (separate backend + frontend)  
**Performance Goals**: <3s p95 latency, 100 concurrent users  
**Constraints**: Free tier only (Qdrant 1GB, Gemini free tier, FastEmbed local - all free)  
**Scale/Scope**: ~60 content chunks, 4 content pages, single collection

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation Notes |
|-----------|--------|---------------------|
| I. Content-First | ✅ PASS | Chatbot answers only from textbook content |
| II. Spec-Driven | ✅ PASS | Full spec completed before this plan |
| III. Progressive Enhancement | ✅ PASS | P0→P1→P2→P3 priority order |
| IV. Reusable Intelligence | ✅ PASS | Content indexer skill to be created |
| V. Personalization | N/A | Out of scope for this feature |
| VI. Multilingual | ✅ PASS | Urdu locale support in UI |
| VII. Performance | ✅ PASS | <3s latency, 100 users defined |
| VIII. Test-First | ✅ PASS | Contract tests in spec appendix |
| IX. Documentation | ✅ PASS | Full spec + plan + PHR workflow |

---

## Project Structure

### Documentation (this feature)

```text
specs/004-rag-chatbot/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output (setup guide)
├── contracts/           # API contracts
│   ├── chat.contract.md
│   └── health.contract.md
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
api/                           # Backend (FastAPI + uv)
├── pyproject.toml             # uv project config
├── uv.lock                    # Lockfile
├── .env.example               # Environment template
├── .python-version            # Python version (3.11)
├── src/
│   ├── __init__.py
│   ├── main.py                # FastAPI app entry
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py        # Pydantic settings
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── chat.py            # /api/chat endpoint
│   │   └── health.py          # /api/health endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   ├── embeddings.py      # Qdrant FastEmbed embeddings
│   │   ├── rag.py             # RAG retrieval logic
│   │   ├── llm.py             # Gemini chat completion (via OpenAI Agents SDK)
│   │   └── indexer.py         # Content indexing
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py         # Pydantic models
│   └── utils/
│       ├── __init__.py
│       └── chunker.py         # Markdown chunking
├── scripts/
│   ├── index_content.py       # One-time indexing script
│   └── test_qdrant.py         # Qdrant connection test
└── tests/
    ├── __init__.py
    ├── conftest.py            # Pytest fixtures
    ├── test_chat.py           # Chat endpoint tests
    ├── test_rag.py            # RAG service tests
    └── test_health.py         # Health endpoint tests

docs/                          # Frontend (Docusaurus)
├── src/
│   ├── components/
│   │   ├── ChatWidget/
│   │   │   ├── index.tsx      # Main chat component
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── SourceCitation.tsx
│   │   │   └── styles.module.css
│   │   └── TextSelectionHandler/
│   │       ├── index.tsx      # Text selection capture
│   │       └── styles.module.css
│   └── theme/
│       └── Root.tsx           # Swizzled Root for global chat
└── static/
    └── img/
        └── chat-icon.svg      # Chat button icon
```

**Structure Decision**: Web application pattern with separate `api/` backend and `docs/` frontend. Backend uses `uv` for fast, reproducible Python environment. Frontend integrates via Docusaurus theme swizzling.

---

## Implementation Phases

### Phase 0: Research & Setup (2-3 hours)

**Objective**: Validate technical approach and set up development environment.

#### Tasks:

1. **Set up Qdrant Cloud account**
   - Create free cluster
   - Note cluster URL and API key
   - Test connection with Python client

2. **Verify API access**
   - Test Qdrant FastEmbed local embedding generation
   - Test Gemini chat completion (gemini-1.5-flash via OpenAI Agents SDK)
   - Verify embedding dimensions match Qdrant collection setup

3. **Initialize backend project**
   ```bash
   mkdir api && cd api
   uv init
   uv add fastapi uvicorn fastembed agents qdrant-client pydantic pydantic-settings python-dotenv httpx tiktoken sse-starlette
   uv add --dev pytest pytest-asyncio httpx
   ```

4. **Create `.env.example`**
   ```env
   GEMINI_API_KEY=Ai-your-gemini-key-here
   QDRANT_URL=https://your-cluster.qdrant.io:6333
   QDRANT_API_KEY=your-qdrant-key
   CORS_ORIGINS=http://localhost:3000,https://naimalarain13.github.io/physical-ai-and-humaniod-robotics
   ```

**Deliverables**:
- `specs/004-rag-chatbot/research.md` with findings
- `api/` directory initialized with `uv`
- Qdrant connection verified

---

### Phase 1: Backend Core Implementation (4-5 hours)

**Objective**: Implement FastAPI backend with RAG functionality.

#### 1.1 Configuration & Models (30 min)

```python
# api/src/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str  # For chat completion
    qdrant_url: str
    qdrant_api_key: str
    cors_origins: list[str] = ["http://localhost:3000"]
    collection_name: str = "textbook_content"
    embedding_model: str = "BAAI/bge-small-en-v1.5"  # FastEmbed model
    chat_model: str = "gemini-1.5-flash"
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai"
    
    class Config:
        env_file = ".env"
```

```python
# api/src/models/schemas.py
from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    selected_text: Optional[str] = None
    current_page: Optional[str] = None
    conversation_history: list[dict] = []

class Source(BaseModel):
    chapter: int
    lesson: int
    section: str
    url: str

class ChatResponse(BaseModel):
    content: str
    sources: list[Source]
```

#### 1.2 Content Indexing Service (1 hour)

```python
# api/src/services/indexer.py
- Read markdown files from docs/docs/
- Split into chunks by ## headings
- Generate embeddings using Qdrant FastEmbed (local, free)
- Store in Qdrant with metadata (chapter, lesson, section, url)

Example FastEmbed usage:
from fastembed import TextEmbedding

embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
# Model produces 384-dimensional vectors
embeddings = list(embedding_model.embed(chunks))
# Note: Qdrant collection must be configured for 384 dimensions
```

#### 1.3 RAG Service (1.5 hours)

```python
# api/src/services/rag.py
- Generate query embedding using FastEmbed
- Query Qdrant for top-5 similar chunks (384-dim vectors)
- Build context from retrieved chunks
- Include source metadata for citations
```

#### 1.4 LLM Service (1 hour)

```python
# api/src/services/llm.py
- Initialize Gemini via OpenAI Agents SDK (custom provider pattern)
- System prompt for textbook assistant
- Include retrieved context
- Stream response via SSE
- Extract and format source citations

Example initialization:
from agents import AsyncOpenAI, OpenAIChatCompletionsModel
from agents.run import RunConfig
import os

gemini_api_key = os.getenv("GEMINI_API_KEY")
external_provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai"
)
model = OpenAIChatCompletionsModel(
    openai_client=external_provider,
    model="gemini-1.5-flash",
)
config = RunConfig(
    model=model, 
    model_provider=external_provider, 
    tracing_disabled=True
)
```

#### 1.5 API Endpoints (1 hour)

```python
# api/src/routes/chat.py
@router.post("/chat")
async def chat(request: ChatRequest):
    # 1. Generate query embedding
    # 2. Retrieve relevant chunks
    # 3. Generate response with LLM
    # 4. Stream response with sources
```

**Deliverables**:
- Working `/api/chat` endpoint
- Working `/api/health` endpoint
- Content indexed in Qdrant
- All backend tests passing

---

### Phase 2: Frontend Integration (3-4 hours)

**Objective**: Create React chat widget and integrate with Docusaurus.

#### 2.1 Chat Widget Component (2 hours)

```tsx
// docs/src/components/ChatWidget/index.tsx
- Floating chat button (bottom-right)
- Expandable chat panel
- Message list with markdown rendering
- Input field with send button
- Typing indicator
- Source citations with links
```

#### 2.2 Text Selection Handler (1 hour)

```tsx
// docs/src/components/TextSelectionHandler/index.tsx
- Listen for text selection events
- Show floating "Ask about this" button
- Pass selected text to chat widget
```

#### 2.3 Docusaurus Integration (1 hour)

```bash
# Swizzle Root component
cd docs
npm run swizzle @docusaurus/theme-classic Root -- --wrap
```

```tsx
// docs/src/theme/Root.tsx
import ChatWidget from '@site/src/components/ChatWidget';
import TextSelectionHandler from '@site/src/components/TextSelectionHandler';

export default function Root({children}) {
  return (
    <>
      {children}
      <TextSelectionHandler />
      <ChatWidget />
    </>
  );
}
```

**Deliverables**:
- ChatWidget component working
- TextSelectionHandler component working
- Both integrated into all pages via Root swizzle

---

### Phase 3: Text Selection Feature (1-2 hours)

**Objective**: Implement P1 text selection query feature.

#### Tasks:

1. Capture text selection on mouseup/touchend
2. Show floating button near selection
3. On click, open chat with selected text as context
4. Backend handles selected_text in query
5. Response references the selected passage

**Deliverables**:
- Text selection working on all lesson pages
- "Ask about this" button functional
- Context-aware responses for selections

---

### Phase 4: Navigation Feature (1-2 hours)

**Objective**: Implement P2 navigation guidance feature.

#### Tasks:

1. Ensure all chunks have correct URLs in metadata
2. LLM prompt includes instruction to provide links
3. Frontend renders links as clickable
4. Test navigation queries ("Where can I learn about X?")

**Deliverables**:
- Clickable source citations
- Navigation queries return relevant links
- Links correctly route to target pages

---

### Phase 5: Guidance Feature (1 hour)

**Objective**: Implement P3 study guidance feature.

#### Tasks:

1. Add curriculum structure to LLM context
2. Handle "What should I study next?" queries
3. Handle "Give me an overview" queries
4. Test guidance scenarios

**Deliverables**:
- Study recommendations working
- Course overview available
- Prerequisite queries answered

---

### Phase 6: Polish & Testing (2-3 hours)

**Objective**: Final testing, optimization, and deployment preparation.

#### Tasks:

1. Run all integration tests
2. Test with 10+ concurrent users
3. Verify <3s latency for 95% of queries
4. Test error handling scenarios
5. Verify Urdu locale support
6. Create deployment documentation

**Deliverables**:
- All tests passing
- Performance validated
- Deployment ready

---

## Deployment Strategy

### Backend Deployment Options

| Platform | Pros | Cons | Cost |
|----------|------|------|------|
| **Render** | Easy Python deploy, free tier | Cold starts | Free |
| **Railway** | Fast deploys, good DX | Limited free tier | Free/$5/mo |
| **Fly.io** | Global edge, fast | More complex setup | Free |

**Recommendation**: Render for simplicity with free tier.

### Backend Deployment Steps (Render)

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: physical-ai-chatbot
    env: python
    buildCommand: pip install uv && uv sync
    startCommand: uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: QDRANT_URL
        sync: false
      - key: QDRANT_API_KEY
        sync: false
```

2. Connect GitHub repo to Render
3. Set environment variables
4. Deploy

### Frontend Deployment

Frontend deploys automatically via existing GitHub Pages workflow. Just need to:
1. Update API base URL in frontend config
2. Rebuild and deploy

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Qdrant free tier limits | Low | High | Monitor usage, optimize chunk size |
| Gemini API costs | Low | Low | Free tier generous, cache common queries |
| FastEmbed model download | Low | Low | One-time download on first run |
| Cold start latency | Medium | Medium | Keep-alive pings, loading state UI |
| CORS issues | Medium | Low | Proper CORS config, test early |
| Rate limiting | Low | Low | Implement client-side throttling |

---

## Time Estimate

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 0: Research & Setup | 2-3 hours | Required |
| Phase 1: Backend Core | 4-5 hours | P0 |
| Phase 2: Frontend Integration | 3-4 hours | P0 |
| Phase 3: Text Selection | 1-2 hours | P1 |
| Phase 4: Navigation | 1-2 hours | P2 |
| Phase 5: Guidance | 1 hour | P3 |
| Phase 6: Polish & Testing | 2-3 hours | Required |
| **Total** | **14-20 hours** | |

---

## Complexity Tracking

> No constitution violations requiring justification.

| Decision | Rationale | Simpler Alternative |
|----------|-----------|---------------------|
| Separate `api/` directory | Clean separation, independent deployment | Could embed in docs/ but harder to deploy |
| SSE for streaming | Better UX, shows response as it generates | Could use simple POST but feels slower |
| Theme swizzling | Only way to add global components in Docusaurus | Could add to each page manually but not DRY |

---

## Next Steps

1. **Create `tasks.md`** with detailed task breakdown
2. **Set up Qdrant Cloud** account and get credentials
3. **Initialize `api/` directory** with `uv`
4. **Begin Phase 1** implementation

---

## Appendix: Quick Commands

```bash
# Backend development
cd api
uv sync                          # Install dependencies
uv run uvicorn src.main:app --reload  # Start dev server
uv run pytest                    # Run tests
uv run python scripts/index_content.py  # Index content

# Frontend development
cd docs
npm run start                    # Start Docusaurus dev server
npm run build                    # Build for production

# Full stack local testing
# Terminal 1: cd api && uv run uvicorn src.main:app --reload --port 8000
# Terminal 2: cd docs && npm run start
# Access: http://localhost:3000
```

