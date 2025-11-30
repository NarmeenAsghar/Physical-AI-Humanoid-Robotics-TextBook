# Physical AI & Humanoid Robotics Textbook

Comprehensive interactive textbook for Physical AI and Humanoid Robotics with integrated RAG-powered chatbot assistant.

## 🎯 Project Overview

This project combines an educational textbook platform built with Docusaurus with an intelligent chatbot assistant powered by RAG (Retrieval-Augmented Generation). Students can learn about Physical AI and Humanoid Robotics while getting instant, context-aware help from the AI assistant.

## ✨ Key Features

### 📖 Interactive Textbook
- **Docusaurus-based** modern documentation platform
- **Multi-language support**: English and Urdu (اردو)
- **Responsive design**: Works on desktop, tablet, and mobile
- **Dark mode** support for comfortable reading
- **Chapter-based structure** with progressive learning path

### 🤖 RAG Chatbot Assistant
- **Zero-cost architecture**: Gemini 1.5 Flash (free tier) + Qdrant Cloud (free tier) + FastEmbed (local)
- **Streaming responses**: Real-time SSE streaming for instant feedback
- **Source citations**: Every answer includes links to relevant textbook sections
- **Context-aware**: Maintains conversation history for natural dialogue
- **Floating widget**: Always accessible from any page without disrupting reading
- **Dark mode support**: Seamlessly integrates with site theme

## 🏗️ Architecture

### Frontend (`/docs`)
- **Framework**: Docusaurus (React + TypeScript)
- **UI Components**: Custom ChatWidget with CSS modules
- **Internationalization**: i18n support for English and Urdu
- **Deployment**: GitHub Pages

### Backend (`/api`)
- **Framework**: FastAPI (Python 3.11+)
- **Package Manager**: `uv` for fast dependency management
- **LLM**: Gemini 1.5 Flash via OpenAI Agents SDK
- **Embeddings**: Qdrant FastEmbed - BAAI/bge-small-en-v1.5 (384-dim, local)
- **Vector Database**: Qdrant Cloud
- **Streaming**: Server-Sent Events (SSE)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- uv package manager
- Gemini API key (free tier)
- Qdrant Cloud account (free tier)

### 1. Clone Repository

```bash
git clone https://github.com/NaimalArain13/physical-ai-and-humaniod-robotics.git
cd physical-ai-and-humaniod-robotics
```

### 2. Setup Backend

```bash
cd api

# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Install dependencies (run in separate terminal - 591MB TensorFlow download)
uv add fastapi uvicorn fastembed agents qdrant-client pydantic pydantic-settings python-dotenv httpx tiktoken sse-starlette
uv add --dev pytest pytest-asyncio httpx

# Configure environment
cp .env.example .env
# Edit .env and add your Gemini API key and Qdrant credentials

# Test Qdrant connection
uv run python scripts/test_qdrant.py

# Index textbook content
uv run python scripts/index_content.py

# Start API server
uv run uvicorn src.main:app --reload --port 8000
```

API will be available at http://localhost:8000

### 3. Setup Frontend

```bash
cd docs

# Install dependencies
npm install

# Start development server
npm start
```

Site will be available at http://localhost:3000

### 4. Using the Chatbot

1. Open http://localhost:3000 in your browser
2. Look for the floating chat button (💬) in the bottom-right corner
3. Click to open the chat panel
4. Ask questions about the course content!

Example questions:
- "What is embodied intelligence?"
- "Explain ROS 2 architecture"
- "How does Gazebo simulation work?"

## 📁 Project Structure

```
.
├── docs/                          # Frontend (Docusaurus)
│   ├── docs/                      # Markdown lesson files
│   │   ├── chapter-01-foundations/
│   │   ├── chapter-02-ros2/
│   │   └── chapter-03-simulation/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWidget/        # Chatbot component
│   │   │       ├── index.tsx
│   │   │       ├── types.ts
│   │   │       └── styles.module.css
│   │   └── theme/
│   │       └── Root/              # Swizzled root for global ChatWidget
│   ├── i18n/                      # Urdu translations
│   └── docusaurus.config.ts
│
├── api/                           # Backend (FastAPI)
│   ├── src/
│   │   ├── main.py                # FastAPI app
│   │   ├── config/
│   │   │   └── settings.py        # Pydantic settings
│   │   ├── models/
│   │   │   └── schemas.py         # Request/response models
│   │   ├── services/
│   │   │   ├── embeddings.py      # FastEmbed service
│   │   │   ├── indexer.py         # Content indexing
│   │   │   ├── rag.py             # RAG retrieval
│   │   │   └── llm.py             # Gemini integration
│   │   ├── routes/
│   │   │   ├── health.py          # Health check
│   │   │   └── chat.py            # Chat endpoints
│   │   └── utils/
│   │       └── chunker.py         # Markdown chunking
│   ├── scripts/
│   │   ├── test_qdrant.py         # Connection test
│   │   └── index_content.py       # Content indexing
│   ├── .env                       # Environment variables (gitignored)
│   ├── .env.example               # Example environment
│   └── pyproject.toml             # uv project config
│
├── specs/                         # Technical specifications
│   └── 004-rag-chatbot/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── CHATBOT_SETUP.md               # Detailed chatbot setup guide
└── README.md                      # This file
```

## 📚 Documentation

- **[Chatbot Setup Guide](./CHATBOT_SETUP.md)** - Comprehensive setup and troubleshooting
- **[API Documentation](./api/README.md)** - Backend API reference
- **[Frontend Documentation](./docs/README.md)** - Docusaurus customization

## 🎓 Course Content (Phase 1)

### Fully Written Lessons
1. **Chapter 1, Lesson 1**: Introduction to Embodied Intelligence
2. **Chapter 2, Lesson 1**: ROS 2 Architecture and Core Concepts
3. **Chapter 3, Lesson 1**: Gazebo Simulation Environment

### Placeholder Lessons (Template-Generated)
- Chapter 1, Lesson 2
- Chapter 2, Lesson 2
- Chapter 3, Lesson 2

Post-hackathon expansion will include Chapters 4-6 with additional lessons.

## 🔧 API Endpoints

### Health Check
```bash
GET /api/health
```

### Chat (Streaming)
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "What is embodied intelligence?",
  "conversation_history": []
}
```

### Chat (Sync - for testing)
```bash
POST /api/chat/sync
Content-Type: application/json

{
  "message": "Explain ROS 2 architecture"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd api
uv run pytest
```

### Frontend Tests
```bash
cd docs
npm test
```

### Manual Integration Test
1. Start backend: `uv run uvicorn src.main:app --reload --port 8000`
2. Start frontend: `npm start`
3. Open browser to http://localhost:3000
4. Use chat widget to ask questions
5. Verify sources are linked correctly

## 🌐 Deployment

### Frontend (GitHub Pages)
```bash
cd docs
npm run build
npm run deploy
```

### Backend (Multiple Options)
- **Render**: Recommended for free tier hosting
- **Railway**: Easy deployment with Git integration
- **Hugging Face Spaces**: Docker-based deployment
- **Fly.io**: Global edge deployment

See [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) for detailed deployment guides.

## 💰 Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| Gemini 1.5 Flash | Free | $0 | 15 RPM, 1M TPM, 1,500 RPD |
| Qdrant Cloud | Free | $0 | 1GB storage |
| FastEmbed | Local | $0 | Unlimited |
| GitHub Pages | Free | $0 | Public repos |
| **Total** | | **$0** | |

## 🛠️ Technology Stack

### Frontend
- React + TypeScript
- Docusaurus
- CSS Modules
- i18n (English + Urdu)

### Backend
- Python 3.11+
- FastAPI
- Pydantic
- Qdrant FastEmbed
- OpenAI Agents SDK
- Server-Sent Events

### AI/ML
- Gemini 1.5 Flash (LLM)
- BAAI/bge-small-en-v1.5 (embeddings)
- Qdrant (vector database)

## 📅 Project Timeline

- **Phase 1** (Before Sunday, Nov 30, 6 PM PKT): Core textbook + RAG chatbot
- **Post-Hackathon**: Chapters 4-6, assessment features, additional skills

## 🤝 Contributing

This is a hackathon project. Contributions are welcome after the initial submission!

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Docusaurus
- Powered by Gemini and Qdrant
- Inspired by modern educational technology

## 📧 Contact

- **Author**: Naimal Arain
- **GitHub**: [@NaimalArain13](https://github.com/NaimalArain13)
- **Repository**: [physical-ai-and-humaniod-robotics](https://github.com/NaimalArain13/physical-ai-and-humaniod-robotics)

---

**Status**: ✅ Phase 1 Complete - RAG Chatbot Integrated

Last Updated: November 29, 2025
