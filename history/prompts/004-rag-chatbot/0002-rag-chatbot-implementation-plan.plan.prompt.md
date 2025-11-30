---
id: 0002
title: RAG Chatbot Implementation Plan
stage: plan
date: 2025-11-29
surface: agent
model: claude-opus-4.5
feature: 004-rag-chatbot
branch: book-writing
user: naimalarain
command: manual
labels: ["planning", "rag-chatbot", "hackathon", "cursor-agent", "zero-cost", "gemini", "fastembed"]
links:
  spec: specs/004-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-rag-chatbot/plan.md
  - specs/004-rag-chatbot/README.md
tests:
  - N/A (planning phase - no tests created)
---

## Prompt

User request (via Cursor with Claude Opus 4.5): Generate an implementation plan for the RAG chatbot feature based on the updated spec.md, ensuring high quality, explicit technical requirements, separation of backend, and use of uv package manager. The plan should cover scope, key decisions, API contracts, NFRs, data management, operational readiness, risk analysis, evaluation, and constitution compliance.

Requirements:
- Use **Gemini 1.5 Flash** (free tier) via OpenAI Agents SDK with custom provider
- Use **Qdrant FastEmbed** (local, free) for embeddings (BAAI/bge-small-en-v1.5, 384 dimensions)
- Backend in separate `api/` directory with `uv` package manager
- FastAPI with SSE streaming
- React components for Docusaurus frontend
- **Implement all 4 functionalities**: P0 (Q&A), P1 (text selection), P2 (navigation), P3 (guidance)
- **Total cost: $0**

Context:
- spec.md created (403 lines) with 4 user stories (P0-P3)
- 35 functional requirements defined
- Success criteria and API contracts documented
- Need detailed implementation plan with all phases and deployment strategy

## Response snapshot

Successfully created comprehensive implementation plan via Cursor agent with Claude Opus 4.5:

**Implementation Plan Structure:**

1. **Summary**
   - Production-ready RAG chatbot for Docusaurus textbook
   - **Zero-cost architecture** using free services
   - 6 implementation phases (14-20 hours total)
   - **All 4 user stories implemented**: P0, P1, P2, P3

2. **Technical Approach:**
   - **Backend**: FastAPI (Python 3.11+) with `uv` package manager in `api/` directory
   - **Vector Store**: Qdrant Cloud (free tier, 1GB)
   - **LLM**: **Gemini 1.5 Flash** via OpenAI Agents SDK (custom provider)
   - **Embeddings**: **Qdrant FastEmbed** (local, free - BAAI/bge-small-en-v1.5, 384-dim)
   - **Frontend**: React components integrated via Docusaurus theme swizzling
   - **Communication**: Server-Sent Events (SSE) for streaming responses

3. **Technical Context:**
   - Language: Python 3.11+ (Backend), TypeScript/React (Frontend)
   - Dependencies: FastAPI, fastembed, agents (OpenAI SDK), qdrant-client, pydantic, sse-starlette
   - Testing: pytest + pytest-asyncio (Backend), Jest (Frontend)
   - Platform: GitHub Pages (Frontend), Render/Railway free tier (Backend)
   - Performance: <3s p95 latency, 100 concurrent users
   - **Constraints**: Free tier only - $0 total cost

4. **Project Structure:**
   - Documentation: `specs/004-rag-chatbot/` (spec.md, plan.md, research.md, quickstart.md, contracts/, tasks.md)
   - Backend: `api/` with src/, scripts/, tests/ directories
   - Frontend: `docs/src/components/` (ChatWidget, TextSelectionHandler) + theme swizzling

5. **Implementation Phases (All Features):**

   **Phase 0: Research & Setup (2-3 hours)**
   - Set up Qdrant Cloud account (free tier)
   - Verify Gemini API access (free tier)
   - Test Qdrant FastEmbed local embedding generation
   - Initialize `api/` directory with `uv`
   - Create `.env.example` with GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY

   **Phase 1: Backend Core Implementation (4-5 hours) - P0**
   - Configuration with Pydantic settings
   - Content indexing service using FastEmbed (384-dim vectors)
   - RAG service with Qdrant query (top-5 similar chunks)
   - LLM service with Gemini via OpenAI Agents SDK custom provider
   - API endpoints: POST /api/chat (SSE streaming), GET /api/health

   **Phase 2: Frontend Integration (3-4 hours) - P0**
   - ChatWidget component (floating button, message list, markdown rendering)
   - TextSelectionHandler component (capture selection, "Ask about this" button)
   - Docusaurus Root swizzling for global integration

   **Phase 3: Text Selection Feature (1-2 hours) - P1**
   - Capture text selection on mouseup/touchend
   - Show floating button near selection
   - Pass selected_text to backend
   - Context-aware responses for selections

   **Phase 4: Navigation Feature (1-2 hours) - P2**
   - Ensure chunks have correct URLs in metadata
   - LLM prompt includes link generation instructions
   - Frontend renders clickable source citations
   - Test navigation queries ("Where can I learn about X?")

   **Phase 5: Guidance Feature (1 hour) - P3**
   - Add curriculum structure to LLM context
   - Handle "What should I study next?" queries
   - Course overview and prerequisites
   - Learning path recommendations

   **Phase 6: Polish & Testing (2-3 hours)**
   - Run all integration tests
   - Test 10+ concurrent users
   - Verify <3s latency (p95)
   - Error handling and edge cases
   - Urdu locale support
   - Final deployment

6. **Deployment Strategy:**
   - Backend: Render (free tier) with `render.yaml`
   - Frontend: GitHub Pages (existing workflow)
   - Environment variables configured securely
   - Build command: `pip install uv && uv sync`
   - Start command: `uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT`

7. **Risk Assessment:**
   - Qdrant free tier limits (Low/High) - Monitor usage
   - Gemini API costs (Low/Low) - Free tier generous
   - FastEmbed model download (Low/Low) - One-time download
   - Cold start latency (Medium/Medium) - Keep-alive pings
   - CORS issues (Medium/Low) - Proper config
   - Rate limiting (Low/Low) - Client-side throttling

8. **Time Estimate (All Features):**
   - Phase 0: 2-3 hours (Setup)
   - Phase 1: 4-5 hours (P0 - Core Q&A)
   - Phase 2: 3-4 hours (P0 - Frontend)
   - Phase 3: 1-2 hours (P1 - Text Selection)
   - Phase 4: 1-2 hours (P2 - Navigation)
   - Phase 5: 1 hour (P3 - Guidance)
   - Phase 6: 2-3 hours (Polish & Testing)
   - **Total: 14-20 hours**

9. **Zero-Cost Architecture Details:**
   - **Gemini 1.5 Flash**: Free tier via OpenAI Agents SDK
     ```python
     from agents import AsyncOpenAI, OpenAIChatCompletionsModel
     external_provider = AsyncOpenAI(
         api_key=gemini_api_key,
         base_url="https://generativelanguage.googleapis.com/v1beta/openai"
     )
     model = OpenAIChatCompletionsModel(
         openai_client=external_provider,
         model="gemini-1.5-flash"
     )
     ```

   - **Qdrant FastEmbed**: Local embedding generation (no API cost)
     ```python
     from fastembed import TextEmbedding
     embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
     embeddings = list(embedding_model.embed(chunks))  # 384-dimensional vectors
     ```

   - **Qdrant Cloud**: Free tier (1GB storage) for vector database

10. **Quick Commands:**
    ```bash
    # Backend setup
    cd api
    uv sync
    uv run uvicorn src.main:app --reload
    uv run python scripts/index_content.py

    # Frontend
    cd docs
    npm run start
    ```

**Additional Artifacts Created:**
- `specs/004-rag-chatbot/README.md` (321 lines) - Quick reference guide with architecture diagrams, dependencies, credentials table, RAG workflow, system prompt template, UI components, testing checklist, and time breakdown

## Outcome

- ✅ Impact: Comprehensive 547-line implementation plan created with **zero-cost architecture** using Gemini 1.5 Flash + Qdrant FastEmbed. All 6 phases detailed (14-20 hours total) covering all 4 user stories (P0-P3). Complete technical approach with code examples for Gemini integration via OpenAI Agents SDK and FastEmbed local embeddings. Project structure, deployment strategy, risk assessment, and quick start commands documented. README.md provides visual architecture and quick reference.
- 🧪 Tests: N/A (planning phase - test scenarios defined in Phase 6, pytest + pytest-asyncio for backend, Jest for frontend)
- 📁 Files: Created plan.md (547 lines, ~6.2KB) and README.md (321 lines, ~3.5KB) totaling ~9.7KB of planning documentation
- 🔁 Next prompts: Create tasks.md with detailed task breakdown organized by user story and phase (P0, P1, P2, P3)
- 🧠 Reflection: Plan successfully optimized for $0 cost using Gemini free tier and local FastEmbed instead of paid OpenAI services. All 4 functionalities included (Q&A, text selection, navigation, guidance). Code examples provided for custom provider integration. Moderate time estimate (14-20 hours) for complete feature set. All 6 phases clearly defined with deliverables. Risk assessment identifies potential issues (cold starts, CORS) with mitigation strategies.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully via Cursor agent
- Graders run and results (PASS/FAIL): N/A (planning phase)
- Prompt variant (if applicable): Created via Cursor with Claude Opus 4.5 (not Claude Code workflow), optimized for zero-cost implementation with Gemini + FastEmbed, includes all 4 user stories
- Next experiment (smallest change to try): Execute /sp.tasks to generate detailed task breakdown and validate that plan provides sufficient detail for autonomous implementation of all features
