# Physical AI & Humanoid Robotics Textbook Constitution

<!--
Version Change: 0.0.0 → 1.0.0 (Initial constitution)
Modified Principles: None (Initial version)
Added Sections: All core sections
Removed Sections: None
Templates Requiring Updates:
  ✅ spec-template.md - Constitution Check section aligned
  ✅ plan-template.md - Constitution Check gates aligned
  ✅ tasks-template.md - Task categorization aligned
Follow-up TODOs: None
-->

## Core Principles

### I. Content-First Development

The primary focus of this project is creating high-quality, accurate educational content about Physical AI and Humanoid Robotics. Every feature and technical decision MUST serve the goal of delivering clear, accessible, and comprehensive learning material. Content quality takes precedence over technical complexity.

**Rationale**: The textbook exists to educate students before a course launch. Technical features (RAG chatbot, personalization, translation) enhance learning but must never compromise content accuracy or clarity.

### II. AI-Assisted Spec-Driven Workflow

All development work MUST follow the Spec-Kit Plus methodology using Claude Code. Feature specifications precede implementation, planning precedes coding, and all changes are documented through PHRs (Prompt History Records). No code is written without a corresponding spec and plan.

**Rationale**: This hackathon explicitly requires using Spec-Kit Plus and Claude Code. The spec-driven approach ensures clear requirements, prevents scope creep, and maintains traceability throughout development.

### III. Progressive Enhancement Architecture

Base functionality (textbook + RAG chatbot) MUST be fully operational before any bonus features (authentication, personalization, translation). Each layer builds on a stable foundation and can be independently tested and deployed.

**Rationale**: The 100-point base requirements must work perfectly. Bonus features (up to 150 extra points) should add value incrementally without breaking core functionality. Each enhancement layer is optional and can be enabled independently.

### IV. Reusable Intelligence (Subagents & Skills)

Complex, repetitive tasks MUST be abstracted into Claude Code Subagents and Agent Skills to maximize efficiency and earn bonus points. Skills should be designed for reusability across different parts of the project.

**Rationale**: The hackathon awards up to 50 bonus points for creating reusable intelligence. Well-designed subagents reduce development time, improve consistency, and demonstrate advanced Claude Code usage.

### V. User-Centered Personalization

Authentication and personalization features MUST collect meaningful user background data (software/hardware experience) at signup and use this data to genuinely customize content presentation. Personalization is not cosmetic - it adapts learning paths to user expertise.

**Rationale**: The hackathon requirement for personalization (50 bonus points) should deliver real educational value. Knowing a user's background allows the textbook to adjust complexity, provide relevant examples, and optimize learning outcomes.

### VI. Multilingual Accessibility

Translation features (specifically Urdu) MUST maintain technical accuracy and preserve formatting. Translations should be contextual, preserving code examples and technical terminology appropriately.

**Rationale**: The hackathon awards 50 bonus points for Urdu translation. Education should be accessible regardless of language preference, but technical precision must not be lost in translation.

### VII. Performance & Scalability Standards

The RAG chatbot MUST respond within 3 seconds for 95% of queries. The Docusaurus site MUST load initial content within 2 seconds. Database queries MUST be optimized for sub-100ms response times. All services must handle at least 100 concurrent users.

**Rationale**: Student learning is disrupted by slow interfaces. Educational tools must be responsive. The free-tier services (Qdrant Cloud, Neon Postgres) have limits that require careful optimization.

### VIII. Test-Before-Implement Discipline

Integration tests MUST be written and verified to FAIL before implementing any feature. Contract tests MUST validate all API endpoints. RAG chatbot responses MUST be tested against known-correct answers from the textbook content.

**Rationale**: Educational content must be accurate. The RAG chatbot answering questions incorrectly would undermine learning. Testing ensures the system provides reliable, verifiable information.

### IX. Documentation as Code

Every feature specification, architectural decision, and prompt interaction MUST be documented through the Spec-Kit Plus templates (spec.md, plan.md, tasks.md, ADRs, PHRs). Documentation is not optional - it is part of the deliverable.

**Rationale**: The hackathon is about demonstrating AI-driven development methodology. The process documentation (specs, plans, PHRs) is as important as the final product, showing how Claude Code and Spec-Kit Plus were used effectively.

## Technical Stack Requirements

### Mandated Technologies

The following technologies are REQUIRED per hackathon specifications:

- **Documentation Platform**: Docusaurus (for textbook)
- **AI Development**: Claude Code + Spec-Kit Plus
- **RAG Chatbot Backend**: FastAPI (Python)
- **RAG SDKs**: OpenAI Agents/ChatKit SDKs
- **Database**: Neon Serverless Postgres (free tier)
- **Vector Store**: Qdrant Cloud (free tier)
- **Authentication** (if implemented): Better-auth.com
- **Deployment**: GitHub Pages

### Technology Constraints

- MUST use free tiers for all cloud services (Neon, Qdrant)
- MUST deploy to GitHub Pages (static hosting constraints apply)
- MUST embed RAG chatbot within Docusaurus site (not separate app)
- MUST use OpenAI-compatible APIs for RAG functionality

## Development Workflow

### Feature Development Cycle

1. **Specification** (`/sp.specify`): Document user requirements and acceptance criteria
2. **Planning** (`/sp.plan`): Research, design architecture, identify dependencies
3. **Task Generation** (`/sp.tasks`): Break down into testable, independent tasks
4. **Implementation** (`/sp.implement`): Execute tasks in priority order
5. **Documentation** (PHRs): Record all prompt interactions and decisions
6. **ADRs**: Document architecturally significant decisions

### Quality Gates

Every feature MUST pass these gates before merging:

- **Specification Complete**: All acceptance criteria defined and clear
- **Constitution Check**: Verify alignment with all nine core principles
- **Tests Written**: Integration/contract tests exist and initially fail
- **Tests Passing**: All tests pass after implementation
- **PHR Created**: Prompt history recorded with full context
- **Performance Validated**: Meets latency/throughput standards (Principle VII)
- **Content Accuracy**: Educational content reviewed for correctness

### Commit and PR Requirements

- **Commits**: Use conventional commits format (`feat:`, `fix:`, `docs:`, `test:`)
- **PRs**: Must reference spec file, include test evidence, note any ADRs created
- **Branch Names**: `###-feature-name` format matching spec file structure
- **Review**: All PRs must verify constitution compliance before merge

## Scope Boundaries

### In Scope (Required)

- Docusaurus textbook covering Physical AI & Humanoid Robotics course content
- RAG chatbot embedded in textbook answering content questions
- Support for text-selection-based questions (user highlights text, asks about it)
- FastAPI backend serving RAG chatbot functionality
- Neon Postgres database for data persistence
- Qdrant vector store for embeddings
- GitHub Pages deployment

### In Scope (Bonus Points - Optional)
5. Participants can receive up to 50 extra bonus points if they also implement Signup and Signin using https://www.better-auth.com/ At signup you will ask questions from the user about their software and hardware background. Knowing the background of the user we will be able to personalize the content.

6.  Participants can receive up to 50 extra bonus points if the logged user can personalise the content in the chapters by pressing a button at the start of each chapter. 


- Better-auth.com authentication with user background collection (+50 points)
- Per-chapter personalization based on user background (+50 points)
- Per-chapter Urdu translation (+50 points)
- Claude Code Subagents and Agent Skills (+50 points)

### Out of Scope

- Video content or interactive simulations
- Courses beyond Physical AI & Humanoid Robotics
- User-generated content or forums
- Mobile native apps (web-only)
- Real-time collaboration features
- Paid service tiers or premium features

## Security Requirements

- **No Hardcoded Secrets**: All API keys, database credentials in `.env` files (never committed)
- **Input Validation**: All user inputs (chat queries, text selections, login forms) sanitized
- **SQL Injection Protection**: Use parameterized queries for all database operations
- **XSS Prevention**: Sanitize all user-generated content displayed in UI
- **Authentication Security** (if implemented): Follow Better-auth.com best practices, HTTPS-only cookies, secure session management
- **Rate Limiting**: Protect RAG chatbot and API endpoints from abuse (max 10 requests/minute per user)

## Performance Standards

As defined in Principle VII:

- **RAG Chatbot Response**: <3s for 95th percentile (p95)
- **Page Load Time**: <2s for initial Docusaurus content
- **Database Query Time**: <100ms for standard queries
- **Concurrent Users**: Support minimum 100 simultaneous users
- **Vector Search**: <500ms for semantic search queries in Qdrant
- **Translation API**: <2s for chapter translation requests

## Cost Budget

- **Zero Infrastructure Cost**: All services must use free tiers
- **Neon Postgres**: Stay within free tier limits (512 MB storage, 0.25 compute units)
- **Qdrant Cloud**: Stay within free tier limits (1GB cluster)
- **OpenAI API**: Budget TBD - estimate $20 for development/testing
- **GitHub Pages**: Free (public repository required)

## Governance

### Constitution Authority

This constitution supersedes all other development practices and preferences. Any deviation MUST be explicitly documented with justification in an ADR (Architecture Decision Record).

### Amendment Process

1. Proposed amendments must be documented in an ADR
2. Amendment must include rationale and impact analysis
3. All affected templates (spec, plan, tasks) must be updated
4. Version number incremented per semantic versioning:
   - MAJOR: Principle removal or backward-incompatible governance change
   - MINOR: New principle added or section materially expanded
   - PATCH: Clarification, wording improvement, typo fix

### Compliance Review

- All `/sp.plan` executions MUST include "Constitution Check" gate
- All `/sp.tasks` outputs MUST reference relevant principles
- All PRs MUST verify constitution compliance before merge
- PHRs MUST be created for every user prompt as per Principle IX

### Complexity Justification

Any architecture or implementation that violates simplicity (e.g., introducing unnecessary abstractions, adding features not in spec, over-engineering) MUST be justified in the plan.md "Complexity Tracking" section with clear rationale for why a simpler approach is insufficient.

**Version**: 1.0.0 | **Ratified**: 2025-11-28 | **Last Amended**: 2025-11-28
