# Tasks: RAG-Based Chatbot

**Input**: Design documents from `/specs/004-rag-chatbot/`
**Prerequisites**: plan.md, spec.md, README.md

**Tests**: No automated tests for this feature - validation done through manual testing and integration checks

**Organization**: Tasks are grouped by user story (P0, P1, P2, P3) to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths or agent names in descriptions

## Path Conventions

This is a web application with separate backend and frontend:
- **Backend**: `api/` (FastAPI with `uv` package manager)
- **Frontend**: `docs/` (Docusaurus with React components)
- **Credentials**: User will manually provide after `.env` creation

---

## Phase 0: Setup & Prerequisites (2-3 hours)

**Purpose**: Initialize backend project, verify API access, set up Qdrant Cloud

- [X] T001 Create api/ directory structure (src/, scripts/, tests/)
- [X] T002 Initialize uv project in api/ directory with pyproject.toml
- [X] T003 Add FastAPI dependencies: uv add fastapi uvicorn fastembed agents qdrant-client pydantic pydantic-settings python-dotenv httpx tiktoken sse-starlette
- [X] T004 Add dev dependencies: uv add --dev pytest pytest-asyncio httpx
- [X] T005 Create api/.env.example with GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY, CORS_ORIGINS placeholders
- [X] T006 Create api/.env file (user will manually paste credentials from provided Qdrant connection code)
- [X] T007 Create api/.python-version file with "3.11"
- [X] T008 [P] Create api/src/__init__.py and subdirectory __init__.py files
- [ ] T009 Test Qdrant connection with provided credentials using scripts/test_qdrant.py
- [ ] T010 Test Gemini API access via OpenAI Agents SDK with gemini-1.5-flash model

**Checkpoint**: Development environment ready - backend can be developed

---

## Phase 1: Backend Core Implementation - Configuration & Models (30 min)

**Purpose**: Set up configuration management and data models

- [X] T011 [P] Create api/src/config/settings.py with Pydantic settings (gemini_api_key, qdrant_url, qdrant_api_key, cors_origins, collection_name, embedding_model, chat_model, gemini_base_url)
- [X] T012 [P] Create api/src/models/schemas.py with ChatRequest (message, selected_text, current_page, conversation_history)
- [X] T013 [P] Add Source model to schemas.py (chapter, lesson, section, url)
- [X] T014 [P] Add ChatResponse model to schemas.py (content, sources)

**Checkpoint**: Configuration and models ready

---

## Phase 2: Backend Core Implementation - Services (3-4 hours)

**Purpose**: Implement core RAG functionality with Gemini and FastEmbed

### Content Indexing (1 hour)

- [ ] T015 Create api/src/utils/chunker.py for markdown content chunking by ## headings
- [ ] T016 Create api/src/services/embeddings.py with FastEmbed initialization (BAAI/bge-small-en-v1.5, 384-dim)
- [ ] T017 Create api/src/services/indexer.py to read docs/docs/chapter-*/lesson-*.md files
- [ ] T018 Implement chunk generation in indexer.py with metadata (chapter, lesson, section, url)
- [ ] T019 Implement embedding generation using FastEmbed in indexer.py
- [ ] T020 Implement Qdrant collection creation and upsert in indexer.py (384-dimensional vectors)
- [ ] T021 Create api/scripts/index_content.py script to run indexer service

### RAG Service (1.5 hours)

- [ ] T022 Create api/src/services/rag.py with query embedding generation using FastEmbed
- [ ] T023 Implement Qdrant search in rag.py (top-5 similar chunks, 384-dim query vector)
- [ ] T024 Implement context building from retrieved chunks in rag.py
- [ ] T025 Implement source metadata extraction in rag.py

### LLM Service (1 hour)

- [ ] T026 Create api/src/services/llm.py with Gemini initialization via OpenAI Agents SDK
- [ ] T027 Implement custom provider setup in llm.py (AsyncOpenAI with Gemini base URL)
- [ ] T028 Implement OpenAIChatCompletionsModel initialization in llm.py (gemini-1.5-flash)
- [ ] T029 Implement system prompt for textbook assistant in llm.py
- [ ] T030 Implement context injection from RAG service in llm.py
- [ ] T031 Implement streaming response handler in llm.py
- [ ] T032 Implement source citation extraction in llm.py

**Checkpoint**: Core services ready

---

## Phase 3: Backend API Endpoints (1 hour)

**Purpose**: Implement REST API endpoints

- [ ] T033 Create api/src/main.py with FastAPI app initialization
- [ ] T034 Configure CORS middleware in main.py
- [ ] T035 [P] Create api/src/routes/health.py with GET /api/health endpoint
- [ ] T036 Create api/src/routes/chat.py with POST /api/chat endpoint
- [ ] T037 Implement SSE streaming response in chat.py
- [ ] T038 Integrate RAG and LLM services in chat.py
- [ ] T039 Add error handling and input validation in chat.py
- [ ] T040 Register routes in main.py

**Checkpoint**: Backend API functional - test with curl/Postman

---

## Phase 4: User Story 1 - Answer Questions from Book Content (Priority: P0) 🎯 MVP

**Goal**: Implement core Q&A functionality where chatbot answers questions exclusively from textbook content with source citations

**Independent Test**:
```bash
# Start backend: cd api && uv run uvicorn src.main:app --reload
# Test: curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d '{"message": "What is embodied intelligence?"}'
# Expected: Response with definition from Lesson 1.1 and source citation
```

### Frontend Components (3 hours)

- [ ] T041 [US1] Create docs/src/components/ChatWidget/index.tsx with floating chat button
- [ ] T042 [P] [US1] Create docs/src/components/ChatWidget/ChatMessage.tsx for message display
- [ ] T043 [P] [US1] Create docs/src/components/ChatWidget/ChatInput.tsx for user input
- [ ] T044 [P] [US1] Create docs/src/components/ChatWidget/SourceCitation.tsx for source links
- [ ] T045 [P] [US1] Create docs/src/components/ChatWidget/styles.module.css for styling
- [ ] T046 [US1] Implement chat state management in ChatWidget/index.tsx (messages, loading, expanded)
- [ ] T047 [US1] Implement API integration in ChatWidget/index.tsx (POST /api/chat with SSE)
- [ ] T048 [US1] Implement markdown rendering in ChatMessage.tsx using react-markdown
- [ ] T049 [US1] Implement typing indicator in ChatMessage.tsx
- [ ] T050 [US1] Implement source citation rendering with clickable links in SourceCitation.tsx

### Docusaurus Integration (1 hour)

- [ ] T051 [US1] Swizzle Docusaurus Root component: npm run swizzle @docusaurus/theme-classic Root -- --wrap
- [ ] T052 [US1] Import ChatWidget in docs/src/theme/Root.tsx
- [ ] T053 [US1] Add ChatWidget to Root.tsx render
- [ ] T054 [US1] Test chatbot appears on all pages

### Integration & Testing (30 min)

- [ ] T055 [US1] Run content indexing script: uv run python api/scripts/index_content.py
- [ ] T056 [US1] Test basic Q&A: "What is embodied intelligence?" expects Lesson 1.1 citation
- [ ] T057 [US1] Test off-topic refusal: "What is quantum computing?" expects polite refusal
- [ ] T058 [US1] Test conversation context: Follow-up questions maintain context
- [ ] T059 [US1] Test source citations: All responses include clickable chapter/lesson/section links

**Checkpoint**: User Story 1 complete - Core Q&A working with citations

---

## Phase 5: User Story 2 - Answer Questions from Selected Text (Priority: P1)

**Goal**: Implement text selection feature where users can highlight text and ask questions about it

**Independent Test**:
```bash
# Navigate to any lesson page
# Select text "sensor-motor integration"
# Click "Ask about this" button
# Expected: Chatbot opens with selected text as context, provides explanation
```

### Implementation (1-2 hours)

- [ ] T060 [US2] Create docs/src/components/TextSelectionHandler/index.tsx
- [ ] T061 [P] [US2] Create docs/src/components/TextSelectionHandler/styles.module.css
- [ ] T062 [US2] Implement text selection detection in TextSelectionHandler (mouseup, touchend events)
- [ ] T063 [US2] Implement floating "Ask about this" button positioning
- [ ] T064 [US2] Implement button click handler to open ChatWidget with selected_text
- [ ] T065 [US2] Update ChatWidget to accept and display selected_text context
- [ ] T066 [US2] Update backend chat.py to handle selected_text in ChatRequest
- [ ] T067 [US2] Update LLM prompt to reference selected text when provided
- [ ] T068 [US2] Import TextSelectionHandler in docs/src/theme/Root.tsx
- [ ] T069 [US2] Add TextSelectionHandler to Root.tsx render

### Testing (30 min)

- [ ] T070 [US2] Test text selection on Lesson 1.1: Select "embodied intelligence", ask "Explain this"
- [ ] T071 [US2] Test code block selection: Select Python code, ask "What does this do?"
- [ ] T072 [US2] Test multi-paragraph selection: Select 3 paragraphs, ask question
- [ ] T073 [US2] Test no selection: Verify "Ask about this" button is disabled

**Checkpoint**: User Story 2 complete - Text selection working

---

## Phase 6: User Story 3 - Navigate User to Relevant Pages (Priority: P2)

**Goal**: Implement navigation guidance where chatbot provides direct links to relevant lessons

**Independent Test**:
```bash
# Ask chatbot: "Where can I learn about Gazebo?"
# Expected: Response with clickable link to Chapter 3, Lesson 1
```

### Implementation (1-2 hours)

- [ ] T074 [US3] Verify all content chunks in Qdrant have correct URL metadata
- [ ] T075 [US3] Update LLM system prompt in llm.py to include link generation instructions
- [ ] T076 [US3] Update SourceCitation.tsx to render URLs as clickable links
- [ ] T077 [US3] Implement link formatting in ChatMessage.tsx for markdown links

### Testing (30 min)

- [ ] T078 [US3] Test topic query: "Where can I learn about ROS 2 nodes?" expects Lesson 2.x link
- [ ] T079 [US3] Test chapter query: "What topics are covered in Chapter 1?" expects all Chapter 1 lesson links
- [ ] T080 [US3] Test multi-topic query: "Where can I learn about simulation?" expects multiple lesson links
- [ ] T081 [US3] Test unavailable topic: "Where can I learn about quantum computing?" expects polite refusal

**Checkpoint**: User Story 3 complete - Navigation links working

---

## Phase 7: User Story 4 - Guide Student Through Book Content (Priority: P3)

**Goal**: Implement study guidance where chatbot recommends learning paths and provides course overview

**Independent Test**:
```bash
# Ask chatbot: "What should I study after Embodied Intelligence?"
# Expected: Recommendation for Lesson 1.2 or Chapter 2
```

### Implementation (1 hour)

- [ ] T082 [US4] Add curriculum structure to LLM context in llm.py (chapter order, prerequisites)
- [ ] T083 [US4] Implement "What should I study next?" query handling in LLM prompt
- [ ] T084 [US4] Implement "Give me an overview" query handling in LLM prompt
- [ ] T085 [US4] Implement prerequisite query handling in LLM prompt

### Testing (30 min)

- [ ] T086 [US4] Test progression query: "What should I study after Lesson 1.1?" expects Lesson 1.2
- [ ] T087 [US4] Test overview query: "Give me an overview of this textbook" expects chapter summaries
- [ ] T088 [US4] Test prerequisite query: "What prerequisites do I need for Chapter 3?" expects Chapters 1-2
- [ ] T089 [US4] Test duration query: "How long will it take to complete?" expects time estimate

**Checkpoint**: User Story 4 complete - Guidance features working

---

## Phase 8: Polish & Testing (2-3 hours)

**Purpose**: Final integration testing, error handling, and deployment preparation

### Error Handling & Edge Cases (1 hour)

- [ ] T090 [P] Implement empty query validation in chat.py
- [ ] T091 [P] Implement query length limit (1000 chars) in chat.py
- [ ] T092 [P] Implement input sanitization for XSS prevention in chat.py
- [ ] T093 [P] Implement rate limiting in chat.py (20 requests/min per session)
- [ ] T094 [P] Implement error messages in ChatWidget for network failures
- [ ] T095 [P] Add loading states and error handling to ChatWidget

### Bilingual Support (30 min)

- [ ] T096 [P] Add Urdu locale support to ChatWidget UI strings
- [ ] T097 [P] Test chatbot responds in Urdu when Urdu locale is active

### Performance Testing (1 hour)

- [ ] T098 Test concurrent users: Simulate 10+ concurrent requests
- [ ] T099 Test response latency: Verify <3s p95 for typical queries
- [ ] T100 Test Qdrant free tier limits: Monitor usage under load
- [ ] T101 Test cold start latency: Verify acceptable startup time

**Checkpoint**: All features complete, tested, ready for deployment

---

## Phase 9: Deployment Configuration (1-2 hours)

**Purpose**: Create deployment configurations for multiple platforms

### Docker Containerization (30 min)

- [ ] T102 [P] Create api/Dockerfile with Python 3.11, uv installation, and FastAPI setup
- [ ] T103 [P] Create api/.dockerignore with .env, __pycache__, .pytest_cache, .venv
- [ ] T104 [P] Create docker-compose.yml at repository root for local development
- [ ] T105 [P] Add Docker build and run commands to api/README.md

### Render Deployment (15 min)

- [ ] T106 [P] Create api/render.yaml with web service configuration
- [ ] T107 [P] Set build command in render.yaml: pip install uv && uv sync
- [ ] T108 [P] Set start command in render.yaml: uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT
- [ ] T109 [P] Document environment variables in render.yaml (GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY, CORS_ORIGINS)

### Railway Deployment (15 min)

- [ ] T110 [P] Create api/railway.json with service configuration
- [ ] T111 [P] Set build command in railway.json: pip install uv && uv sync
- [ ] T112 [P] Set start command in railway.json: uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT
- [ ] T113 [P] Create api/Procfile with web: uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT

### Hugging Face Spaces Deployment (30 min)

- [ ] T114 [P] Create api/app.py entry point for Hugging Face Spaces
- [ ] T115 [P] Create api/requirements.txt from pyproject.toml dependencies
- [ ] T116 [P] Create api/README_HF.md with Hugging Face Spaces deployment instructions
- [ ] T117 [P] Configure app.py to use Hugging Face Spaces secrets for environment variables

### Deployment Documentation (30 min)

- [ ] T118 Create comprehensive deployment guide in specs/004-rag-chatbot/DEPLOYMENT.md
- [ ] T119 Document Render deployment steps in DEPLOYMENT.md
- [ ] T120 Document Railway deployment steps in DEPLOYMENT.md
- [ ] T121 Document Hugging Face Spaces deployment steps in DEPLOYMENT.md
- [ ] T122 Document Docker local deployment steps in DEPLOYMENT.md
- [ ] T123 Document environment variable configuration for each platform in DEPLOYMENT.md
- [ ] T124 Update docs frontend config with production API URL placeholder in DEPLOYMENT.md

**Checkpoint**: Deployment configurations ready for all platforms

---

## Dependencies & Execution Strategy

### Story Dependencies

```
Phase 0 (Setup)
    ↓
Phase 1 (Configuration)
    ↓
Phase 2 (Services)
    ↓
Phase 3 (API)
    ↓
Phase 4 (US1 - P0) ← Core Q&A
    ↓
Phase 5 (US2 - P1) ← Text Selection
    ↓
Phase 6 (US3 - P2) ← Navigation
    ↓
Phase 7 (US4 - P3) ← Guidance
    ↓
Phase 8 (Polish)
    ↓
Phase 9 (Deployment)
```

### Parallel Execution Opportunities

**Phase 0-3 (Backend)**: Sequential execution required

**Phase 4 (US1)**: Frontend components can be built in parallel:
- T042, T043, T044, T045 can all run in parallel

**Phase 5-7 (US2-US4)**: Each user story is independent and can be implemented separately

**Phase 8 (Polish)**: Most tasks (T090-T097) can run in parallel

**Phase 9 (Deployment)**: All deployment configs (T102-T117) can be created in parallel

### MVP Scope

**Minimum Viable Product includes ALL features**:
- ✅ Core Q&A from textbook (US1 - P0)
- ✅ Text selection queries (US2 - P1)
- ✅ Navigation guidance (US3 - P2)
- ✅ Study guidance (US4 - P3)
- ✅ Multiple deployment options

**Estimated Time**:
- Complete Feature Set: **16-22 hours**

---

## Deployment Options Summary

| Platform | Pros | Cons | Cost | Tasks |
|----------|------|------|------|-------|
| **Docker (Local)** | Full control, reproducible | Manual scaling | Free | T102-T105 |
| **Render** | Easy Python deploy, free tier | Cold starts | Free | T106-T109 |
| **Railway** | Fast deploys, good DX | Limited free tier | Free/$5/mo | T110-T113 |
| **Hugging Face Spaces** | ML-focused, great for demos | Community visibility | Free | T114-T117 |

**Recommendation**:
- **Development**: Docker local (T102-T105)
- **Demo/Hackathon**: Hugging Face Spaces (T114-T117)
- **Production**: Render or Railway (T106-T113)

---

## Task Summary

**Total Tasks**: 124
- Phase 0 (Setup): 10 tasks
- Phase 1 (Config): 4 tasks
- Phase 2 (Services): 18 tasks
- Phase 3 (API): 8 tasks
- Phase 4 (US1 - P0): 19 tasks
- Phase 5 (US2 - P1): 14 tasks
- Phase 6 (US3 - P2): 8 tasks
- Phase 7 (US4 - P3): 8 tasks
- Phase 8 (Polish): 12 tasks
- Phase 9 (Deployment): 23 tasks

**Parallel Opportunities**: 35+ tasks marked [P] can run in parallel
**User Story Tasks**: 49 tasks organized by user story (US1-US4)
**Deployment Tasks**: 23 tasks for Docker, Render, Railway, Hugging Face

---

## Implementation Notes

**All Features Included**:
- ✅ US1 (P0): Core Q&A from textbook
- ✅ US2 (P1): Text selection queries
- ✅ US3 (P2): Navigation guidance
- ✅ US4 (P3): Study guidance

**Credentials Setup**:
- User will manually create `api/.env` file (T006)
- User will manually paste Qdrant connection code and Gemini API key
- Test Qdrant connection (T009) before proceeding with content indexing

**Zero-Cost Architecture**:
- Gemini 1.5 Flash: Free tier via OpenAI Agents SDK
- Qdrant FastEmbed: Local embedding generation (no API cost)
- Qdrant Cloud: Free tier (1GB storage)
- **Total Cost: $0**

**Deployment Flexibility**:
- Docker for local development and testing
- Render for simple, free cloud deployment
- Railway for fast, modern deployment experience
- Hugging Face Spaces for ML-focused hosting and demos

**Testing Strategy**:
- Manual integration testing for each user story
- No unit tests required for this hackathon feature
- Validation through independent test criteria per story

**Frontend Integration**:
- Update API URL in docs config after deployment (T124)
- CORS origins must include production frontend URL
