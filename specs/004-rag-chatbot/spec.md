# Feature Specification: RAG-Based Chatbot for Physical AI Textbook

feature: 004-rag-chatbot
created: 2025-11-29
status: Draft

prompt: |
  Implement RAG-based chatbot that can answer questions from textbook content, handle text selection queries, navigate users to relevant pages, and guide students through the book.
  High-level functionalities:
  1. Can answer anything from the book only.
  2. Can answer anything from the selected text.
  3. Can navigate the user or give the URL of that page what user is concerned about.
  4. Can guide the student throughout the book content.
  Focus should be on top 4 functionalities.
  Need a high quality specification for this so that planning should be up to the mark.
  One more thing in the specification list down the things which are needed for the implementation of each feature like qdrant api, url or other things.
  I want to distinguish the backend in a separate folder and want to use uv as a package manager.

---

## Executive Summary

This specification defines a Retrieval-Augmented Generation (RAG) chatbot that serves as an intelligent learning assistant embedded within the Physical AI & Humanoid Robotics Docusaurus textbook. The chatbot will answer questions exclusively from the textbook content, support text-selection-based queries, provide navigation guidance, and act as a study companion throughout the learning journey.

---

## User Scenarios & Testing

### User Story 1 - Answer Questions from Book Content (Priority: P0)

As a student reading the textbook, I want to ask questions about the content and receive accurate, contextual answers sourced exclusively from the textbook, so that I can clarify concepts without leaving the learning environment.

**Why this priority**: This is the core RAG functionality. Without accurate content-based Q&A, the chatbot provides no educational value. This must work flawlessly before any other feature.

**Independent Test**: Open chatbot → Ask "What is embodied intelligence?" → Receive answer citing Lesson 1.1 with accurate definition from the textbook.

**Acceptance Scenarios**:

1. **Given** the chatbot is open and the textbook content is indexed, **When** a user asks "What is ROS 2?", **Then** the chatbot responds with accurate information from Lesson 2.1 including source citation.

2. **Given** the chatbot is open, **When** a user asks a question not covered in the textbook (e.g., "What is quantum computing?"), **Then** the chatbot politely indicates the topic is not covered and suggests relevant available topics.

3. **Given** the chatbot is open, **When** a user asks a follow-up question referencing the previous answer, **Then** the chatbot maintains conversation context and provides a coherent response.

4. **Given** the chatbot is open, **When** a user asks a question, **Then** the response includes a source citation (Chapter, Lesson, Section) that the user can click to navigate to.

---

### User Story 2 - Answer Questions from Selected Text (Priority: P1)

As a student reading a complex passage, I want to highlight/select text and ask "What does this mean?" or "Explain this further", so that I can get instant clarification without manually copying text.

**Why this priority**: Text-selection is a key differentiator that enhances the reading experience. It's explicitly required in the hackathon specification and provides significant UX value.

**Independent Test**: Select text on any lesson page → Click "Ask about this" button → Chatbot receives selected text as context → Provides explanation.

**Acceptance Scenarios**:

1. **Given** a user is reading Lesson 1.1, **When** they select "sensor-motor integration" and click "Ask about this", **Then** the chatbot explains the term in context of the surrounding content.

2. **Given** a user selects a code block, **When** they ask "What does this code do?", **Then** the chatbot explains the code with reference to the lesson's context.

3. **Given** a user selects text spanning multiple paragraphs, **When** they ask a question, **Then** the chatbot handles the full selection and provides a coherent answer.

4. **Given** no text is selected, **When** the user clicks "Ask about this", **Then** the button is disabled or prompts the user to select text first.

5. **Given** a user has selected text and the context is visible, **When** they select new text, **Then** the previous selection is replaced with the new selection in the context card (only one selection active at a time).

---

### User Story 3 - Navigate User to Relevant Pages (Priority: P2)

As a student exploring the textbook, I want to ask the chatbot "Where can I learn about Gazebo?" and receive a direct link to the relevant lesson, so that I can quickly navigate to topics of interest.

**Why this priority**: Navigation guidance transforms the chatbot from a Q&A tool to a learning companion. It helps students discover content and reduces friction in finding information.

**Independent Test**: Ask "Where can I learn about simulation?" → Receive response with clickable link to Chapter 3, Lesson 1.

**Acceptance Scenarios**:

1. **Given** the chatbot is open, **When** a user asks "Where can I learn about ROS 2 nodes?", **Then** the chatbot responds with a direct link to Lesson 2.1 (or 2.2 if available).

2. **Given** the chatbot is open, **When** a user asks "What topics are covered in Chapter 1?", **Then** the chatbot lists all lessons in Chapter 1 with clickable links.

3. **Given** the chatbot is open, **When** a user asks about a topic covered in multiple lessons, **Then** the chatbot provides links to all relevant lessons with brief descriptions.

4. **Given** the chatbot is open, **When** a user asks about a topic not in the textbook, **Then** the chatbot indicates the topic is not covered and suggests the closest related available topic.

---

### User Story 4 - Guide Student Through Book Content (Priority: P3)

As a student beginning my learning journey, I want the chatbot to recommend what to study next based on my current position and progress, so that I follow an optimal learning path.

**Why this priority**: Guidance features enhance the learning experience but are less critical than core Q&A and navigation. This can be implemented after core functionality is stable.

**Independent Test**: Ask "What should I learn after Embodied Intelligence?" → Receive recommendation for Lesson 1.2 or Chapter 2.

**Acceptance Scenarios**:

1. **Given** a user is on Lesson 1.1, **When** they ask "What should I study next?", **Then** the chatbot recommends Lesson 1.2 or Chapter 2 based on the curriculum structure.

2. **Given** a user asks "Give me an overview of this textbook", **Then** the chatbot provides a summary of all chapters and their learning objectives.

3. **Given** a user asks "What prerequisites do I need for Chapter 3?", **Then** the chatbot lists concepts from Chapters 1-2 that are foundational.

4. **Given** a user asks "How long will it take to complete this textbook?", **Then** the chatbot provides an estimate based on the 13-week course structure.

---

### Edge Cases

- **Empty Query**: User submits empty message → Chatbot prompts for a question
- **Very Long Query**: User submits 1000+ character query → Chatbot handles gracefully, truncates if necessary
- **Malicious Input**: User attempts XSS/injection → Input is sanitized, no security breach
- **Rate Limiting**: User sends 20+ messages in 1 minute → Rate limit applied, friendly message shown
- **Network Failure**: Backend unavailable → Frontend shows "Service temporarily unavailable" message
- **Concurrent Users**: 100+ users querying simultaneously → System remains responsive (<3s p95)
- **Non-English Query**: User asks in Urdu → Chatbot responds in Urdu if Urdu locale is active
- **Ambiguous Query**: User asks vague question → Chatbot asks for clarification or provides multiple relevant answers

---

## Requirements

### Functional Requirements

#### Core RAG Functionality (P0)

- **FR-001**: System MUST index all textbook content (3 full lessons + overview) into Qdrant vector database
- **FR-002**: System MUST generate embeddings using OpenAI `text-embedding-3-small` model
- **FR-003**: System MUST retrieve top-k (k=5) most relevant content chunks for each query
- **FR-004**: System MUST generate responses using OpenAI GPT-4o-mini with retrieved context
- **FR-005**: System MUST include source citations (Chapter, Lesson, Section) in every response
- **FR-006**: System MUST maintain conversation history (last 5 messages) for context
- **FR-007**: System MUST refuse to answer questions not related to textbook content

#### Text Selection Feature (P1)

- **FR-008**: System MUST capture user text selection on any lesson page
- **FR-009**: System MUST display "Ask about this" floating button near selected text
- **FR-010**: System MUST pass selected text as additional context to RAG query
- **FR-011**: System MUST support text selection up to 2000 characters

#### Navigation Feature (P2)

- **FR-012**: System MUST map content chunks to their source URLs
- **FR-013**: System MUST generate clickable links to relevant lessons in responses
- **FR-014**: System MUST support queries like "Where can I learn about X?"
- **FR-015**: System MUST provide lesson summaries when asked about chapter contents

#### Guidance Feature (P3)

- **FR-016**: System MUST understand the curriculum structure (chapters, lessons, order)
- **FR-017**: System MUST recommend next lessons based on current page context
- **FR-018**: System MUST provide course overview and learning path guidance

#### UI/UX Requirements

- **FR-019**: Chatbot MUST be accessible via floating button on all pages
- **FR-020**: Chatbot MUST support minimize/maximize toggle
- **FR-021**: Chatbot MUST display typing indicator during response generation
- **FR-022**: Chatbot MUST support markdown rendering in responses
- **FR-023**: Chatbot MUST be responsive (mobile, tablet, desktop)
- **FR-024**: Chatbot MUST support both English and Urdu locales

#### Backend Requirements

- **FR-025**: Backend MUST be implemented using FastAPI with Python 3.11+
- **FR-026**: Backend MUST use `uv` as package manager
- **FR-027**: Backend MUST be in separate `api/` directory at project root
- **FR-028**: Backend MUST expose `/api/chat` POST endpoint for queries
- **FR-029**: Backend MUST expose `/api/health` GET endpoint for health checks
- **FR-030**: Backend MUST stream responses using Server-Sent Events (SSE)
- **FR-031**: Backend MUST implement rate limiting (10 requests/minute per IP)

#### Security Requirements

- **FR-032**: System MUST sanitize all user inputs to prevent XSS/injection
- **FR-033**: System MUST use environment variables for all API keys
- **FR-034**: System MUST implement CORS with allowed origins whitelist
- **FR-035**: System MUST log all requests for monitoring (without sensitive data)

---

### Key Entities

- **ContentChunk**: A segment of textbook content with metadata
  - `id`: Unique identifier (e.g., "ch1-l1-s3")
  - `content`: Text content (max 1000 tokens)
  - `chapter`: Chapter number (1-3)
  - `lesson`: Lesson number (1-2)
  - `section`: Section name
  - `url`: Relative URL to the source page
  - `embedding`: Vector representation (1536 dimensions)

- **ChatMessage**: A message in the conversation
  - `id`: Unique message ID
  - `role`: "user" | "assistant"
  - `content`: Message text
  - `sources`: Array of source citations (for assistant messages)
  - `timestamp`: ISO timestamp

- **ChatSession**: A conversation session
  - `session_id`: UUID
  - `messages`: Array of ChatMessage
  - `created_at`: Session start time
  - `current_page`: Current page URL (for context)

---

## Technical Requirements & Dependencies

### External Services Required

| Service | Purpose | Tier | Credentials Needed |
|---------|---------|------|-------------------|
| **Qdrant Cloud** | Vector database for embeddings | Free (1GB) | `QDRANT_URL`, `QDRANT_API_KEY` |
| **OpenAI API** | Embeddings + Chat completion | Pay-as-you-go | `OPENAI_API_KEY` |

### API Endpoints

#### Qdrant Cloud
- **URL**: `https://[cluster-id].qdrant.io:6333`
- **API Key**: From Qdrant Cloud dashboard
- **Collection**: `textbook_content`
- **Vector Size**: 1536 (text-embedding-3-small)

#### OpenAI API
- **Base URL**: `https://api.openai.com/v1`
- **Embedding Model**: `text-embedding-3-small` ($0.02/1M tokens)
- **Chat Model**: `gpt-4o-mini` ($0.15/1M input, $0.60/1M output)

### Python Dependencies (Backend)

Dependencies for the FastAPI backend will be managed using `uv` (a fast Python package installer and resolver), leveraging the `pyproject.toml` format.

```toml
[project]
name = "physical-ai-chatbot"
version = "0.1.0"
requires-python = ">=3.11"

dependencies = [
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
    "openai>=1.12.0",
    "qdrant-client>=1.7.0",
    "pydantic>=2.6.0",
    "pydantic-settings>=2.1.0",
    "python-dotenv>=1.0.0",
    "httpx>=0.26.0",
    "tiktoken>=0.6.0",
    "sse-starlette>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "httpx>=0.26.0",
]
```

### Frontend Dependencies (Docusaurus)

```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0"
  }
}
```

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Chatbot responds to 95% of queries within 3 seconds (p95 latency)
- **SC-002**: Chatbot provides accurate answers (verified against source content) for 90%+ of textbook-related queries
- **SC-003**: Source citations are correct and clickable in 100% of responses
- **SC-004**: Text selection feature works on all 4 content pages (overview + 3 lessons)
- **SC-005**: Navigation links in responses correctly route to target pages 100% of the time
- **SC-006**: System handles 100 concurrent users without degradation
- **SC-007**: Zero security vulnerabilities (XSS, injection, exposed secrets)
- **SC-008**: Chatbot correctly refuses to answer off-topic questions 95%+ of the time

### Quality Metrics

- **QM-001**: All 4 user stories have passing integration tests
- **QM-002**: Backend achieves 80%+ test coverage
- **QM-003**: Frontend component has visual regression tests
- **QM-004**: API contract tests validate all endpoints

---

## Out of Scope (This Iteration)

- User authentication (Better-auth integration is a separate bonus feature)
- Personalization based on user background
- Chat history persistence across sessions
- Voice input/output
- Image/diagram generation
- Multi-language model responses (beyond English/Urdu)
- Admin dashboard for content management
- Analytics and usage tracking dashboard

---

## Appendix A: API Contract

### POST /api/chat

**Request**:
```json
{
  "message": "What is embodied intelligence?",
  "selected_text": null,
  "current_page": "/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hello! How can I help you learn about Physical AI today?"}
  ]
}
```

**Response** (SSE Stream):
```
data: {"type": "chunk", "content": "Embodied intelligence refers to "}
data: {"type": "chunk", "content": "AI systems that perceive and act "}
data: {"type": "chunk", "content": "in physical space..."}
data: {"type": "sources", "sources": [{"chapter": 1, "lesson": 1, "section": "Key Concepts", "url": "/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence#key-concepts"}]}
data: {"type": "done"}
```

### GET /api/health

**Response**:
```json
{
  "status": "healthy",
  "qdrant": "connected",
  "openai": "connected",
  "version": "0.1.0"
}
```

---

## Appendix B: Content Indexing Strategy

### Chunking Strategy

1. **Split by Section**: Each markdown `##` heading creates a new chunk
2. **Max Chunk Size**: 1000 tokens (with 100 token overlap)
3. **Metadata Preserved**: Chapter, Lesson, Section, URL, Title

### Index Contents (Phase 1)

| File | Chunks (Est.) |
|------|---------------|
| `overview.md` | 8-10 |
| `lesson-01-intro-embodied-intelligence.md` | 12-15 |
| `lesson-01-ros2-architecture.md` | 15-18 |
| `lesson-01-gazebo-setup.md` | 15-18 |
| **Total** | ~50-60 chunks |

---

## Appendix C: Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Qdrant Cloud
QDRANT_URL=https://xxx.qdrant.io:6333
QDRANT_API_KEY=...

# Application
CORS_ORIGINS=http://localhost:3000,https://naimalarain13.github.io
RATE_LIMIT_PER_MINUTE=10
LOG_LEVEL=INFO
```

---

## Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Development | ✅ | Chatbot serves educational content exclusively |
| II. AI-Assisted Spec-Driven Workflow | ✅ | This spec precedes implementation |
| III. Progressive Enhancement | ✅ | Core Q&A → Text Selection → Navigation → Guidance |
| IV. Reusable Intelligence | ⏳ | Will create skills for content indexing |
| V. User-Centered Personalization | N/A | Out of scope for this feature |
| VI. Multilingual Accessibility | ✅ | Urdu locale support included |
| VII. Performance Standards | ✅ | <3s p95 latency, 100 concurrent users |
| VIII. Test-Before-Implement | ✅ | Integration tests defined |
| IX. Documentation as Code | ✅ | Full spec with appendices |

