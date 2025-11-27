---
id: 001
title: Hackathon Project Constitution
stage: constitution
date: 2025-11-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: NaimalArain13
command: /sp.constitution
labels: ["constitution", "hackathon", "physical-ai", "robotics", "textbook", "initialization"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

I have an  Ai driven development hackathon: I am going to paste the requirement below:

Hackathon: Create a Textbook for Teaching Physical AI & Humanoid Robotics Course

**Requirements**

You are required to complete a unified book project using Claude Code and Spec-Kit Plus. The core deliverables are:

1\. AI/Spec-Driven Book Creation: Write a book using Docusaurus and deploy it to GitHub Pages. You will use Spec-Kit Plus ( [https://github.com/panaversity/spec-kit-plus/](https://github.com/panaversity/spec-kit-plus/) ) and Claude Code ( [https://www.claude.com/product/claude-code](https://www.claude.com/product/claude-code) ) to write the book.

2\. Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot, utilizing the OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier, must be able to answer user questions about the book's content, including answering questions based only on text selected by the user.

3\. Participants will receive points out of 100, for base functionality defined above.

4\. Participants can earn up to 50 extra bonus points by creating and using reusable intelligence via Claude Code Subagents and Agent Skills in the book project.

5\. Participants can receive up to 50 extra bonus points if they also implement Signup and Signin using [https://www.better-auth.com/](https://www.better-auth.com/) At signup you will ask questions from the user about their software and hardware background. Knowing the background of the user we will be able to personalize the content.

6\.  Participants can receive up to 50 extra bonus points if the logged user can personalise the content in the chapters by pressing a button at the start of each chapter.

7\. Participants can receive up to 50 extra bonus points if the logged user can translate the content in Urdu in the chapters by pressing a button at the start of each chapter.

Below are course details.

and in the requirement we have to right a book of this topic the purpose is that before launching the course we have to write a book that we will use to teach the student so that content of the book is pasted below:

## Response snapshot

Created comprehensive project constitution v1.0.0 for Physical AI & Humanoid Robotics Textbook project with nine core principles:

1. Content-First Development - Educational quality over technical complexity
2. AI-Assisted Spec-Driven Workflow - Mandatory Spec-Kit Plus methodology
3. Progressive Enhancement Architecture - Base (100 pts) before bonus features (up to 150 pts)
4. Reusable Intelligence - Claude Code Subagents and Skills for +50 bonus points
5. User-Centered Personalization - Meaningful background-based content customization
6. Multilingual Accessibility - Urdu translation with technical accuracy preservation
7. Performance & Scalability Standards - <3s RAG responses, <2s page loads, 100 concurrent users
8. Test-Before-Implement Discipline - Tests written and failing before implementation
9. Documentation as Code - PHRs, ADRs, specs are deliverables

Defined mandatory tech stack (Docusaurus, FastAPI, Neon Postgres, Qdrant Cloud, Better-auth, GitHub Pages), development workflow with quality gates, scope boundaries (required vs. bonus features), security requirements, performance standards, zero-cost budget constraints, and governance rules.

Constitution includes sync impact report confirming all templates aligned. Version 1.0.0 ratified 2025-11-28.

## Outcome

- ✅ Impact: Project constitution established defining all governance, principles, tech stack, and quality standards for hackathon
- 🧪 Tests: Constitution compliance gates added to workflow; all features must pass constitution check
- 📁 Files: Created .specify/memory/constitution.md (207 lines); templates verified for alignment
- 🔁 Next prompts: Create feature specs using /sp.specify for base requirements (textbook + RAG chatbot), then bonus features
- 🧠 Reflection: Constitution effectively captures hackathon requirements (100 base + 200 bonus points possible) and establishes clear principles for progressive enhancement architecture

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution creation completed successfully
- Graders run and results (PASS/FAIL): PASS - All placeholders filled, no bracket tokens remaining, templates verified aligned
- Prompt variant (if applicable): Standard /sp.constitution command with detailed hackathon requirements
- Next experiment (smallest change to try): Proceed with /sp.specify to create first feature specification for base textbook content
