---
id: 0001
title: RAG Chatbot Specification
stage: spec
date: 2025-11-29
surface: agent
model: claude-opus-4.5
feature: 004-rag-chatbot
branch: book-writing
user: naimalarain
command: manual
labels: ["specification", "rag-chatbot", "hackathon", "cursor-agent", "zero-cost"]
links:
  spec: specs/004-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-rag-chatbot/spec.md
tests:
  - N/A (specification stage - no tests created)
---

## Prompt

User request (via Cursor with Claude Opus 4.5): Implement RAG-based chatbot that can answer questions from textbook content, handle text selection queries, navigate users to relevant pages, and guide students through the book.

High-level functionalities requested:
1. Can answer anything from the book only.
2. Can answer anything from the selected text.
3. Can navigate the user or give the URL of that page what user is concerned about.
4. Can guide the student throughout the book content.

Additional requirements:
- Focus should be on top 4 functionalities
- Need a high quality specification for this so that planning should be up to the mark
- List down the things which are needed for the implementation of each feature like qdrant api, url or other things
- Distinguish the backend in a separate folder and use uv as a package manager
- **CRITICAL**: $0 cost implementation using free services only
  - Use OpenAI Agents SDK with **Gemini 1.5 Flash** (custom provider, free tier)
  - Use **Qdrant FastEmbed** for embeddings (local, free - no API cost)
  - Use Qdrant Cloud free tier for vector storage

Context:
- Feature 002 (textbook content generation) completed with 3 chapters, 6 lessons
- Docusaurus textbook deployed with full content
- Overview page created with course introduction
- Goal: Add intelligent learning assistant embedded in the textbook

## Response snapshot

Successfully created comprehensive RAG chatbot specification via Cursor agent with Claude Opus 4.5:

**Feature Specification Structure:**

1. **Executive Summary**
   - RAG chatbot as intelligent learning assistant
   - Embedded within Docusaurus textbook
   - Exclusive textbook content sourcing
   - **$0 cost implementation using free services**

2. **User Stories Defined (4 total):**
   - **US1 (P0)**: Answer Questions from Book Content
     - Core RAG functionality
     - 4 acceptance scenarios
     - Source citation requirements

   - **US2 (P1)**: Answer Questions from Selected Text
     - Text-selection feature
     - "Ask about this" button
     - 4 acceptance scenarios

   - **US3 (P2)**: Navigate User to Relevant Pages
     - Link generation to lessons
     - Topic discovery
     - 4 acceptance scenarios

   - **US4 (P3)**: Guide Student Through Book Content
     - Learning path recommendations
     - Course overview
     - 4 acceptance scenarios

3. **Functional Requirements (35 total):**
   - Core RAG (FR-001 to FR-007):
     - Qdrant Cloud (free tier) for vector storage
     - **Qdrant FastEmbed** (local, free) for embeddings
     - **Gemini 1.5 Flash** (free tier) via OpenAI Agents SDK
   - Text Selection (FR-008 to FR-011): Capture, button, context passing
   - Navigation (FR-012 to FR-015): URL mapping, clickable links
   - Guidance (FR-016 to FR-018): Curriculum structure understanding
   - UI/UX (FR-019 to FR-024): Floating button, responsive, bilingual
   - Backend (FR-025 to FR-031): FastAPI, uv, SSE streaming, rate limiting
   - Security (FR-032 to FR-035): Input sanitization, env vars, CORS

4. **Key Entities:**
   - ContentChunk: id, content, chapter, lesson, section, url, embedding (384-dim)
   - ChatMessage: id, role, content, sources, timestamp
   - ChatSession: session_id, messages, created_at, current_page

5. **Technical Requirements & Dependencies:**
   - **Gemini API**: Free tier for chat completion (gemini-1.5-flash)
   - **Qdrant FastEmbed**: Local embedding generation (BAAI/bge-small-en-v1.5, 384 dimensions) - **$0 cost**
   - **Qdrant Cloud**: Free tier (1GB) for vector database
   - **Python Dependencies**: FastAPI, uvicorn, fastembed, agents (OpenAI Agents SDK), qdrant-client, pydantic, sse-starlette
   - **Frontend Dependencies**: react-markdown, remark-gfm
   - **Total API Cost**: **$0** (all services use free tiers)

6. **Success Criteria (8 measurable outcomes):**
   - SC-001: <3s p95 latency
   - SC-002: 90%+ accuracy
   - SC-003: 100% correct citations
   - SC-004: Text selection works on 4 pages
   - SC-005: Navigation links 100% accurate
   - SC-006: 100 concurrent users
   - SC-007: Zero security vulnerabilities
   - SC-008: 95%+ off-topic refusal rate

7. **Appendices:**
   - Appendix A: API Contract (POST /api/chat, GET /api/health)
   - Appendix B: Content Indexing Strategy (~50-60 chunks)
   - Appendix C: Environment Variables (GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY)

8. **Constitution Compliance Check:**
   - 7/9 principles applicable and passing
   - 2 principles N/A (personalization, not in scope)

**Zero-Cost Architecture:**
- **LLM**: Gemini 1.5 Flash (free tier) via OpenAI Agents SDK custom provider
- **Embeddings**: Qdrant FastEmbed (local model, no API calls)
- **Vector DB**: Qdrant Cloud free tier (1GB storage)
- **Hosting**: GitHub Pages (frontend), Render free tier (backend)

## Outcome

- ✅ Impact: Comprehensive 403-line specification created defining all requirements for RAG chatbot feature with **$0 cost constraint**. Clear user stories with priorities (P0-P3), 35 functional requirements, API contracts, success criteria, and technical dependencies documented. Spec explicitly uses free services: Gemini 1.5 Flash (via OpenAI Agents SDK), Qdrant FastEmbed (local embeddings), and Qdrant Cloud free tier. Ready for implementation planning.
- 🧪 Tests: N/A (specification stage - integration test scenarios defined in acceptance criteria for future implementation)
- 📁 Files: Created specs/004-rag-chatbot/spec.md (403 lines, ~3.8KB)
- 🔁 Next prompts: Create implementation plan (plan.md) detailing technical approach with Gemini + FastEmbed, architecture, phases, and deployment strategy
- 🧠 Reflection: Specification created via Cursor agent with Claude Opus 4.5 provides excellent detail and structure. All hackathon requirements covered with $0 cost constraint. Uses Gemini 1.5 Flash (free) instead of paid OpenAI models, and Qdrant FastEmbed for local embedding generation (no API cost). Clear progression from core Q&A (P0) to advanced features (P1-P3) enables MVP-first approach.

## Evaluation notes (flywheel)

- Failure modes observed: None - specification completed successfully via Cursor agent
- Graders run and results (PASS/FAIL): N/A (specification stage)
- Prompt variant (if applicable): Created via Cursor with Claude Opus 4.5 (not Claude Code workflow), optimized for zero-cost implementation
- Next experiment (smallest change to try): Create implementation plan to validate spec completeness and verify Gemini + FastEmbed integration approach
