# RAG Chatbot Implementation Guide

> **Quick Reference**: This document captures the key decisions and thinking for the RAG chatbot implementation. Refer to `spec.md` for full requirements and `plan.md` for implementation details.

---

## 🎯 Core Objective

Build a RAG-based chatbot that:
1. **Answers questions** from textbook content only
2. **Explains selected text** when user highlights passages
3. **Navigates users** to relevant pages via clickable links
4. **Guides students** through the learning path

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docusaurus Frontend                         │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐ │
│  │ TextSelection   │  │         ChatWidget                    │ │
│  │ Handler         │──│  • Message List                       │ │
│  │ • Capture text  │  │  • Input Field                        │ │
│  │ • "Ask" button  │  │  • Source Citations                   │ │
│  └─────────────────┘  └──────────────────────────────────────┘ │
│                              │ SSE Stream                       │
└──────────────────────────────│──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (api/)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ /api/chat   │  │ RAG Service │  │ LLM Service             │ │
│  │ POST        │──│ • Query     │──│ • System Prompt         │ │
│  │ • message   │  │ • Retrieve  │  │ • Context Injection     │ │
│  │ • selected  │  │ • Rank      │  │ • Stream Response       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                          │                    │                  │
└──────────────────────────│────────────────────│──────────────────┘
                           ▼                    ▼
                   ┌──────────────┐     ┌──────────────┐
                   │ Qdrant Cloud │     │  Gemini API  │
                   │ Vector Store │     │  (Free Tier) │
                   │ (Free Tier)  │     │  + FastEmbed │
                   └──────────────┘     └──────────────┘
```

---

## 📦 Key Dependencies

### Backend (Python)
```
fastapi          - Web framework
uvicorn          - ASGI server
fastembed        - Qdrant FastEmbed (local embeddings)
agents           - OpenAI Agents SDK (for Gemini)
qdrant-client    - Vector DB client
pydantic         - Data validation
sse-starlette    - Server-Sent Events
tiktoken         - Token counting
uv               - Package manager
```

### Frontend (React)
```
react-markdown   - Render markdown in chat
remark-gfm       - GitHub Flavored Markdown
```

---

## 🔑 Required Credentials

| Service | Environment Variable | How to Get |
|---------|---------------------|------------|
| Gemini | `GEMINI_API_KEY` | [makersuite.google.com](https://makersuite.google.com/app/apikey) |
| Qdrant | `QDRANT_URL` | [cloud.qdrant.io](https://cloud.qdrant.io/) → Create Cluster |
| Qdrant | `QDRANT_API_KEY` | Qdrant Dashboard → API Keys |

**Note**: Embeddings use Qdrant FastEmbed (local, free) - no API key needed!

---

## 📊 Content Indexing Strategy

### Chunking Rules
1. **Split by `##` headings** - Each section becomes a chunk
2. **Max 1000 tokens** per chunk (with 100 token overlap)
3. **Preserve metadata**: Chapter, Lesson, Section, URL

### Content to Index (Phase 1)
| File | Location | Est. Chunks |
|------|----------|-------------|
| Overview | `docs/docs/overview.md` | 8-10 |
| Lesson 1.1 | `docs/docs/chapter-01-foundations/lesson-01-*.md` | 12-15 |
| Lesson 2.1 | `docs/docs/chapter-02-ros2/lesson-01-*.md` | 15-18 |
| Lesson 3.1 | `docs/docs/chapter-03-simulation/lesson-01-*.md` | 15-18 |
| **Total** | | **~50-60 chunks** |

---

## 🔄 RAG Workflow

```
User Query: "What is embodied intelligence?"
     │
     ▼
┌─────────────────────────────────────────┐
│ 1. Generate Query Embedding             │
│    Qdrant FastEmbed (BAAI/bge-small)    │
│    → 384-dimensional vector             │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ 2. Search Qdrant (top-5 similar)        │
│    Collection: textbook_content         │
│    → Returns chunks with metadata       │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ 3. Build Context                        │
│    Combine top chunks into prompt       │
│    Include source URLs for citations    │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ 4. Generate Response (GPT-4o-mini)      │
│    System: "You are a helpful tutor..." │
│    Context: [retrieved chunks]          │
│    Query: "What is embodied intel..."   │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ 5. Stream Response via SSE              │
│    data: {"type": "chunk", "content":...│
│    data: {"type": "sources", ...}       │
│    data: {"type": "done"}               │
└─────────────────────────────────────────┘
```

---

## 💡 System Prompt Template

```markdown
You are a helpful tutor for the "Physical AI & Humanoid Robotics" textbook.

RULES:
1. ONLY answer questions based on the provided context from the textbook
2. If the question is not covered in the context, say "This topic is not covered in the textbook"
3. Always cite your sources using [Chapter X, Lesson Y, Section Z] format
4. Provide clear, educational explanations suitable for students
5. If the user asks for navigation, provide the relevant page URL
6. If text is selected, explain that specific passage in context

CONTEXT FROM TEXTBOOK:
{retrieved_chunks}

CURRENT PAGE: {current_page}
SELECTED TEXT: {selected_text or "None"}

Answer the following question:
```

---

## 🎨 UI Components

### ChatWidget
- **Floating button**: Bottom-right, 60x60px, chat icon
- **Chat panel**: 400x600px, slides up on click
- **Message list**: Scrollable, markdown-rendered
- **Input**: Text field + send button
- **Sources**: Collapsible list with clickable links

### TextSelectionHandler
- **Trigger**: `mouseup` / `touchend` events
- **Button**: "Ask about this" appears near selection
- **Behavior**: Opens chat with selected text pre-filled

---

## 🚀 Quick Start Commands

```bash
# 1. Set up backend
cd api
uv init
uv add fastapi uvicorn fastembed agents qdrant-client pydantic pydantic-settings python-dotenv sse-starlette tiktoken httpx
uv add --dev pytest pytest-asyncio

# 2. Create .env file
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and QDRANT credentials

# 3. Index content (one-time)
uv run python scripts/index_content.py

# 4. Start backend
uv run uvicorn src.main:app --reload --port 8000

# 5. Start frontend (separate terminal)
cd docs
npm run start

# 6. Test
# Open http://localhost:3000
# Click chat button
# Ask "What is embodied intelligence?"
```

---

## ✅ Testing Checklist

### P0: Core Q&A
- [ ] Ask "What is embodied intelligence?" → Get accurate answer with source
- [ ] Ask "What is quantum computing?" → Get "not covered" response
- [ ] Ask follow-up question → Context maintained
- [ ] Source citation links work

### P1: Text Selection
- [ ] Select text on Lesson 1.1 → "Ask about this" button appears
- [ ] Click button → Chat opens with selection
- [ ] Ask "Explain this" → Get contextual explanation

### P2: Navigation
- [ ] Ask "Where can I learn about ROS 2?" → Get link to Chapter 2
- [ ] Ask "What topics are in Chapter 1?" → Get list with links
- [ ] Click link in response → Navigate to correct page

### P3: Guidance
- [ ] Ask "What should I study next?" → Get recommendation
- [ ] Ask "Give me an overview" → Get course summary
- [ ] Ask "Prerequisites for Chapter 3?" → Get list

### Performance
- [ ] Response time < 3 seconds (p95)
- [ ] Works with 10+ concurrent users
- [ ] No errors in console

---

## 📝 Files to Create

```
api/
├── pyproject.toml
├── .env.example
├── .python-version (3.11)
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config/settings.py
│   ├── routes/chat.py
│   ├── routes/health.py
│   ├── services/embeddings.py
│   ├── services/rag.py
│   ├── services/llm.py
│   ├── services/indexer.py
│   ├── models/schemas.py
│   └── utils/chunker.py
├── scripts/
│   └── index_content.py
└── tests/
    ├── conftest.py
    ├── test_chat.py
    └── test_health.py

docs/src/
├── components/
│   ├── ChatWidget/
│   │   ├── index.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── SourceCitation.tsx
│   │   └── styles.module.css
│   └── TextSelectionHandler/
│       ├── index.tsx
│       └── styles.module.css
└── theme/
    └── Root.tsx
```

---

## 🔗 Useful Links

- [Qdrant Cloud Console](https://cloud.qdrant.io/)
- [Gemini API Key](https://makersuite.google.com/app/apikey)
- [Qdrant FastEmbed Documentation](https://qdrant.github.io/fastembed/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docusaurus Swizzling](https://docusaurus.io/docs/swizzling)
- [SSE in FastAPI](https://github.com/sysid/sse-starlette)

---

## ⏰ Time Breakdown

| Task | Time | Cumulative |
|------|------|------------|
| Setup & Research | 2-3h | 2-3h |
| Backend Core (P0) | 4-5h | 6-8h |
| Frontend Integration (P0) | 3-4h | 9-12h |
| Text Selection (P1) | 1-2h | 10-14h |
| Navigation (P2) | 1-2h | 11-16h |
| Guidance (P3) | 1h | 12-17h |
| Testing & Polish | 2-3h | 14-20h |

**Estimated Total: 14-20 hours**

---

*Last Updated: 2025-11-29*

