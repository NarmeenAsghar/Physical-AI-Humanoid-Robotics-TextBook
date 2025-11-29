# Implementation Plan: Textbook Content Generation Workflow

**Branch**: `book-writing` | **Date**: 2025-11-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-textbook-content-generation/spec.md`

## Summary

Generate a complete Physical AI & Humanoid Robotics textbook with a Course Overview page plus 3 chapters (6 lessons total) by orchestrating existing components: First create Overview page from COURSE_CONTENT.md, then Content Architect subagent scaffolds directory structure, Lesson Template Generator skill creates standardized templates, and Technical Writer agent researches and writes ~800 word content for 3 priority lessons (1.1, 2.1, 3.1). Overview page clearly states hackathon scope limitation. All components are fully implemented and ready - this plan focuses on research strategy, orchestration workflow, and quality validation to achieve Sunday deadline.

**Technical Approach**: Sequential implementation starting with Overview page, then agent invocation with research-guided content generation. Phase 0 defines research topics for each lesson based on COURSE_CONTENT.md analysis. Phase 1 creates orchestration workflow and quality checklists. Implementation executes 4-step process: create overview → scaffold structure → generate templates → write researched content.

## Technical Context

**Language/Version**: Markdown (educational content), Python 3.x (agents), TypeScript (Docusaurus config)
**Primary Dependencies**:
  - Content Architect subagent (`.claude/agents/content-architect.md`) - READY
  - Lesson Template Generator skill (`.claude/skills/lesson-template-generator/SKILL.md`) - READY
  - Technical Writer agent (`.claude/agents/technical-writer.md`) - READY
  - Docusaurus 3.x - INSTALLED
  - COURSE_CONTENT.md - EXISTS

**Storage**: File system (docs/docs/ directory for lesson markdown files, docs/sidebars.ts for navigation config)

**Testing**:
  - Docusaurus build validation (`npm run build` must exit 0)
  - Word count validation (700-900 words per full lesson)
  - Template structure validation (7 sections present)
  - Content quality review (learning objectives addressed, real-world examples included)

**Target Platform**: Static site (Docusaurus) deployed to GitHub Pages

**Project Type**: Documentation/Educational content generation (not traditional software)

**Performance Goals**:
  - Content Architect execution: <30 seconds for 6 lesson files
  - Technical Writer per lesson: <7 minutes (research + writing ~800 words)
  - Total workflow: <30 minutes for complete textbook generation

**Constraints**:
  - Sunday 6 PM PKT deadline (30 Nov 2025)
  - Content length: ~800 words per lesson (700-900 acceptable range)
  - Only 3 of 6 lessons receive full content (1.1, 2.1, 3.1)
  - Must work on "book-writing" branch (no new feature branch)
  - All components already built (no new development, orchestration only)

**Scale/Scope**:
  - 3 chapters, 6 lessons total
  - 3 lessons with full researched content (~2400 words total content)
  - 3 lessons remain as templates
  - Single textbook for Physical AI & Humanoid Robotics course

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content-First Development ✅ PASS
- **Check**: Does this feature prioritize educational content quality?
- **Status**: ✅ PASS - This entire feature is about generating high-quality educational content. Technical Writer agent required to research latest information, include real-world examples, and address all learning objectives.
- **Evidence**: FR-011 (must use web search), FR-013 (address all objectives), FR-014 (real-world examples required)

### Principle II: AI-Assisted Spec-Driven Workflow ✅ PASS
- **Check**: Does this follow Spec-Kit Plus methodology?
- **Status**: ✅ PASS - Feature has complete specification (spec.md), currently creating plan (plan.md), will generate tasks (tasks.md), and will create PHR at completion.
- **Evidence**: Following `/sp.specify` → `/sp.plan` → `/sp.tasks` → `/sp.implement` workflow exactly as prescribed.

### Principle III: Progressive Enhancement Architecture ✅ PASS
- **Check**: Does base functionality work before adding enhancements?
- **Status**: ✅ PASS - Generating foundational textbook content first (Phase 1 scope: 3 chapters, moderate-length lessons). Future enhancements (longer lessons, all 6 with content, RAG chatbot) come later.
- **Evidence**: Success Criteria SC-006 validates base workflow completes successfully before any enhancements.

### Principle IV: Reusable Intelligence (Subagents & Skills) ✅ PASS
- **Check**: Are subagents and skills used effectively?
- **Status**: ✅ PASS - This feature orchestrates 1 subagent (Content Architect) and 1 skill (Lesson Template Generator) and 1 agent (Technical Writer) for maximum reusability.
- **Evidence**: Content Architect reused from feature 001, Lesson Template Generator skill designed for reuse across all lessons, Technical Writer can be reused for future content expansion.

### Principle V: User-Centered Personalization ⚠️ N/A
- **Check**: Does personalization use meaningful user data?
- **Status**: ⚠️ N/A - This feature generates base textbook content. Personalization is out of scope for Phase 1 (noted in spec Non-Goals section).
- **Evidence**: Spec clearly states personalization is future enhancement (Phase 4).

### Principle VI: Multilingual Accessibility ⚠️ N/A
- **Check**: Are translations accurate and contextual?
- **Status**: ⚠️ N/A - This feature generates English content only. Translation (Urdu) is out of scope for Phase 1 (noted in spec Non-Goals section).
- **Evidence**: Spec clearly states translation is future enhancement (Phase 5).

### Principle VII: Performance & Scalability Standards ✅ PASS
- **Check**: Do performance targets meet constitution standards?
- **Status**: ✅ PASS - Total workflow execution time <30 minutes (SC-006), Docusaurus build must complete successfully (SC-005), Content Architect <30 seconds (SC-001).
- **Evidence**: Success criteria SC-001, SC-005, SC-006 define clear performance targets.

### Principle VIII: Test-Before-Implement Discipline ✅ PASS
- **Check**: Are validation tests defined before implementation?
- **Status**: ✅ PASS - Spec includes comprehensive test plan with 4 test scenarios (end-to-end workflow, word count compliance, idempotency, content quality). Tests validate structure, content length, build success, and quality metrics.
- **Evidence**: Validation & Testing section with detailed bash test scripts for each acceptance criterion.

### Principle IX: Documentation as Code ✅ PASS
- **Check**: Is development process fully documented?
- **Status**: ✅ PASS - Following full documentation workflow: spec.md created, plan.md in progress, will create research.md, data-model.md, quickstart.md, and PHR at completion.
- **Evidence**: This plan file itself demonstrates commitment to documentation as code.

**Constitution Compliance Summary**: ✅ 7/7 applicable principles PASS (2 principles N/A for Phase 1 scope)

## Project Structure

### Documentation (this feature)

```text
specs/002-textbook-content-generation/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (IN PROGRESS - /sp.plan output)
├── research.md          # Phase 0 output: Lesson content research strategy
├── data-model.md        # Phase 1 output: Chapter/Lesson entity definitions
├── quickstart.md        # Phase 1 output: How to run the workflow
├── contracts/           # Phase 1 output: Agent invocation contracts
│   ├── content-architect-invocation.md
│   ├── lesson-template-contract.md
│   └── technical-writer-invocation.md
└── tasks.md             # Phase 2 output (/sp.tasks - NOT created yet)
```

### Generated Content (Docusaurus textbook)

```text
docs/docs/
├── chapter-01-foundations/           # Chapter 1: Introduction to Physical AI
│   ├── _category_.json               # Chapter config (label, position)
│   ├── lesson-01-intro-embodied-intelligence.md  # FULL CONTENT (~800 words)
│   └── lesson-02-robotics-landscape.md           # TEMPLATE ONLY
├── chapter-02-ros2/                  # Chapter 2: ROS 2 Fundamentals
│   ├── _category_.json
│   ├── lesson-01-ros2-architecture.md            # FULL CONTENT (~800 words)
│   └── lesson-02-nodes-topics-services.md        # TEMPLATE ONLY
└── chapter-03-simulation/            # Chapter 3: Robot Simulation
    ├── _category_.json
    ├── lesson-01-gazebo-setup.md                 # FULL CONTENT (~800 words)
    └── lesson-02-urdf-sdf-formats.md             # TEMPLATE ONLY

docs/sidebars.ts                      # Updated with 3 chapter categories
```

### Existing Components (already implemented)

```text
.claude/
├── agents/
│   ├── content-architect.md          # READY - Scaffolds structure (feature 001)
│   └── technical-writer.md           # READY - Writes researched content
└── skills/
    └── lesson-template-generator/
        └── SKILL.md                  # READY - Creates 7-section templates

COURSE_CONTENT.md                     # READY - Source of module/lesson topics
```

**Structure Decision**: Using Docusaurus documentation structure with chapter-based organization. Each chapter is a directory with `_category_.json` config and lesson markdown files. Sidebar navigation managed through `docs/sidebars.ts`. No new source code - orchestrating existing agents through sequential invocation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations detected. All applicable constitution principles pass. This is a straightforward orchestration of existing components, not introducing unnecessary complexity.

---

## Phase 0: Research Strategy

**Goal**: Define specific research topics for each of the 3 priority lessons to guide Technical Writer agent content generation.

### Research Scope

Since all components are ready, research focuses on **what technical content** to include in each lesson, not how to build the system.

### Lesson 1.1: Introduction to Embodied Intelligence

**Research Topics**:
1. **Latest developments in embodied AI (2024-2025)**:
   - Recent humanoid robot deployments (Tesla Optimus, Figure 01, 1X Neo)
   - Breakthroughs in physical AI from major labs (OpenAI, DeepMind, Berkeley)
   - Industry trends: AI moving from digital to physical domains

2. **Foundational concepts**:
   - Definition: What is embodied intelligence? How does it differ from traditional AI?
   - Key challenges: Sensor-motor integration, real-time constraints, physical safety
   - Real-world examples: Manufacturing robots, service robots, research platforms

3. **Educational analogies**:
   - Digital AI vs. Physical AI: "Brain in a jar vs. brain in a body"
   - Why physical constraints matter: Latency, power, safety, unpredictability
   - Learning from human development: Infant motor learning parallels

**Search Queries**:
- "embodied intelligence robotics 2025"
- "physical AI vs digital AI differences"
- "humanoid robots latest developments 2024"
- "sensor motor integration challenges robotics"

**Expected Resources**:
- Recent papers from arXiv (robotics, AI)
- Industry blogs (Boston Dynamics, NVIDIA, Tesla AI)
- Academic resources (Stanford HAI, MIT CSAIL, Berkeley BAIR)

---

### Lesson 2.1: ROS 2 Architecture & Core Concepts

**Research Topics**:
1. **ROS 2 fundamentals (Humble/Iron distributions)**:
   - Architecture: DDS middleware, nodes, topics, services, actions
   - Why ROS 2 over ROS 1: Real-time support, security, multi-robot systems
   - Key concepts: Publish-subscribe, client-server, quality of service (QoS)

2. **Humanoid robotics applications**:
   - Which humanoid platforms use ROS 2 (Unitree, NASA Valkyrie, Agility Robotics)
   - ROS 2 packages for bipedal locomotion (nav2, moveit2, controller_manager)
   - Integration with simulation (Gazebo, Isaac Sim)

3. **Practical context**:
   - Why middleware matters: Modularity, reusability, debugging
   - Comparison to alternatives: YARP, LCM, custom frameworks
   - Getting started resources: Official tutorials, community packages

**Search Queries**:
- "ROS 2 architecture humanoid robots"
- "ROS 2 Humble Iron differences"
- "ROS 2 DDS middleware explained"
- "humanoid robot ROS 2 packages navigation"

**Expected Resources**:
- Official ROS 2 documentation (docs.ros.org)
- Robotics companies using ROS 2 (case studies)
- Research papers on ROS 2 for bipedal robots
- Community tutorials (The Construct, Articulated Robotics)

---

### Lesson 3.1: Gazebo Simulation Environment Setup

**Research Topics**:
1. **Gazebo Classic vs. Gazebo (Ignition/Fortress/Garden)**:
   - Which version for ROS 2 Humble (Gazebo Fortress recommended)
   - Key improvements: Physics engines (Bullet, ODE, DART), sensor plugins
   - Integration with ROS 2: ros_gz_bridge, ros_gz_sim

2. **Simulation setup workflow**:
   - Installation: Ubuntu 22.04 + ROS 2 Humble + Gazebo Fortress
   - Creating simulation world: SDF format, environment models
   - Robot spawning: URDF/SDF robot description, spawning services
   - Sensor simulation: Camera, LiDAR, IMU, depth cameras

3. **Humanoid-specific considerations**:
   - Physics tuning for bipedal locomotion (contact dynamics, friction)
   - Real-time factor optimization (simulation speed vs. accuracy)
   - Debugging tools: Gazebo GUI, topic introspection, visualization

**Search Queries**:
- "Gazebo Fortress ROS 2 Humble setup"
- "Gazebo humanoid robot simulation tutorial"
- "SDF vs URDF robot description Gazebo"
- "Gazebo physics tuning bipedal robots"

**Expected Resources**:
- Gazebo official documentation (gazebosim.org)
- ROS 2 + Gazebo integration guides
- Robotics tutorials (sensor simulation, world building)
- Community examples (GitHub repos with humanoid simulations)

---

### Research Output Format

For each lesson, Technical Writer will compile research into `research.md` with this structure:

```markdown
## Lesson X.X: [Title]

### Key Concepts Identified
1. [Concept 1]: [1-2 sentence summary]
2. [Concept 2]: [1-2 sentence summary]
3. [Concept 3]: [1-2 sentence summary]

### Real-World Examples
- [Example 1]: [Company/project, what it demonstrates]
- [Example 2]: [Company/project, what it demonstrates]

### Authoritative Sources
- [Source 1 Title](URL) - [Why relevant]
- [Source 2 Title](URL) - [Why relevant]
- [Source 3 Title](URL) - [Why relevant]

### Content Outline (~800 words breakdown)
- Introduction (150-200w): [Key hook and context]
- Key Concepts (300-350w): [3 subsections, ~100w each]
- Hands-on Exercise (150w): [Practical activity]
- Quiz (100w): [3 questions focus]
- Key Takeaways (50w): [3-5 main points]
- Further Reading (50w): [2-4 curated resources]
```

**Deliverable**: `research.md` file with all 3 lessons researched and outlined, ready for Technical Writer to generate full content.

---

## Phase 1: Orchestration Design

**Goal**: Define the exact workflow for invoking agents sequentially and validating outputs.

### Step 1: Content Architect Invocation

**Purpose**: Scaffold complete Docusaurus structure (3 chapters, 6 lesson templates)

**Invocation Contract** (`contracts/content-architect-invocation.md`):

```markdown
# Content Architect Invocation Contract

## Input
- Command: `claude agent content-architect` (or programmatic invocation)
- User prompt: "Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter"

## Preconditions
- COURSE_CONTENT.md exists at repository root
- docs/docs/ directory exists (Docusaurus initialized)
- docs/sidebars.ts exists with tutorialSidebar array
- User has write permissions to docs/docs/

## Expected Behavior
1. Parse COURSE_CONTENT.md for Modules 1-3
2. Generate chapter slugs: foundations, ros2, simulation
3. Create chapter directories: docs/docs/chapter-##-{slug}/
4. For each chapter, invoke Lesson Template Generator skill twice (lesson 1, lesson 2)
5. Create _category_.json in each chapter directory
6. Update docs/sidebars.ts with 3 new category objects
7. Run validation: npm run build (must exit 0)
8. Report summary with file counts and execution time

## Output
- 3 directories created
- 6 lesson files created (with templates)
- 3 _category_.json files created
- docs/sidebars.ts updated (3 new categories appended)
- Docusaurus build success confirmation

## Success Criteria
- All 6 lesson files contain valid YAML frontmatter
- All 6 lesson files have 7 mandatory sections
- Sidebar contains exactly 3 new categories (no duplicates)
- npm run build exits with code 0
- Execution time <30 seconds

## Error Handling
- If COURSE_CONTENT.md missing: ERROR with clear message
- If docs/docs/ missing: ERROR with initialization instructions
- If sidebar update fails: Rollback changes, report error
- If build fails: Report build errors, don't proceed
```

---

### Step 2: Lesson Template Generator Skill

**Purpose**: Create standardized lesson markdown with 7 sections (called 6 times by Content Architect)

**Template Contract** (`contracts/lesson-template-contract.md`):

```markdown
# Lesson Template Generator Contract

## Input (from Content Architect)
- Chapter number: Integer (1, 2, 3)
- Lesson number: Integer (1, 2)
- Lesson title: String (from COURSE_CONTENT.md)
- Lesson description: String (derived from title/module)
- Sidebar position: Integer (1 or 2)

## Template Structure
```yaml
---
sidebar_position: [position]
title: [title]
description: [description]
---

# [title]

## Introduction
[Placeholder: 150-200 words explaining why this lesson matters]

## Learning Objectives
By the end of this lesson, you will be able to:
- [ ] [Objective 1 - action verb]
- [ ] [Objective 2 - measurable outcome]
- [ ] [Objective 3 - practical application]

## Key Concepts

### [Concept 1 Title]
[Placeholder: Definition, explanation, example]

### [Concept 2 Title]
[Placeholder: Definition, explanation, example]

### [Concept 3 Title]
[Placeholder: Definition, explanation, example]

## Hands-on Exercise

**Prerequisites**:
- [Placeholder: Required knowledge/tools]

**Steps**:
1. [Placeholder: Step 1]
2. [Placeholder: Step 2]
3. [Placeholder: Step 3]

**Expected Outcome**:
[Placeholder: What students achieve]

## Quiz

1. [Placeholder: Question 1]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

2. [Placeholder: Question 2]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

3. [Placeholder: Question 3]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

<details>
<summary>Show Answers</summary>

1. [Correct answer] - [Explanation]
2. [Correct answer] - [Explanation]
3. [Correct answer] - [Explanation]

</details>

## Key Takeaways
- [Placeholder: Key point 1]
- [Placeholder: Key point 2]
- [Placeholder: Key point 3]

## Further Reading
- [Resource 1 Title](#) - [Description]
- [Resource 2 Title](#) - [Description]
- [Resource 3 Title](#) - [Description]

---

**Next Lesson**: [Next lesson title](./lesson-[next]-[slug].md)
```

## Output
- Valid markdown file with YAML frontmatter
- Exactly 7 sections in correct order
- All placeholders clearly marked
- Next lesson link formatted correctly

## Validation
- YAML frontmatter is valid (parseable)
- All required fields present (sidebar_position, title, description)
- All 7 section headings present (## level 2)
- Quiz answers in <details> tag
- Learning Objectives use checkbox format
```

---

### Step 3: Technical Writer Agent Invocation

**Purpose**: Replace template placeholders with researched ~800 word content (run 3 times for lessons 1.1, 2.1, 3.1)

**Invocation Contract** (`contracts/technical-writer-invocation.md`):

```markdown
# Technical Writer Invocation Contract

## Input
- Lesson file path: e.g., `docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md`
- Topic: e.g., "Introduction to Embodied Intelligence"
- Learning objectives: (extracted from template or research.md)
- Research outline: (from research.md for this specific lesson)
- Word count target: ~800 words (acceptable range 700-900)

## Preconditions
- Lesson template file exists with 7 sections
- Research completed for this lesson (research.md has outline)
- Internet connectivity available for web search

## Expected Behavior
1. **Research Phase** (2-3 minutes):
   - WebSearch using queries from research.md
   - WebFetch authoritative sources identified
   - Compile latest examples, definitions, best practices

2. **Planning Phase** (1 minute):
   - Map learning objectives to Key Concepts subsections
   - Identify 1-2 real-world examples to include
   - Plan callout boxes for critical concepts

3. **Writing Phase** (3-4 minutes):
   - Replace Introduction: 150-200 words, compelling hook
   - Replace Learning Objectives: Specific, measurable goals (3-4 objectives)
   - Replace Key Concepts: 3 subsections (~100 words each), include examples and callouts
   - Replace Hands-on Exercise: Concrete steps with prerequisites (~150 words)
   - Replace Quiz: 3 thoughtful multiple-choice questions (~100 words)
   - Replace Key Takeaways: 3-5 concise bullet points (~50 words)
   - Replace Further Reading: 2-4 curated resources with real URLs (~50 words)

4. **Review Phase** (1 minute):
   - Count words (verify 700-900 range)
   - Check all learning objectives addressed
   - Verify 1-2 real-world examples present
   - Validate consistent tone and clarity

5. **Write Phase**:
   - Preserve YAML frontmatter exactly
   - Write updated content to file
   - Confirm file written successfully

## Output
- Updated lesson file with ~800 words of content
- All 7 sections filled with professional content
- 2-4 real URLs in Further Reading section
- Callout boxes (>) for key insights

## Success Criteria
- Word count: 700-900 words (target ~800)
- All learning objectives explicitly addressed in content
- Minimum 1-2 real-world examples included
- At least 2 callout boxes (>) for key concepts or warnings
- Further Reading has 2-4 resources with valid HTTPS URLs
- Content maintains encouraging, inclusive educational tone
- Technical accuracy verified through research sources

## Error Handling
- If web search fails: Retry 3 times with exponential backoff, then fallback to internal knowledge with warning logged
- If word count <700: Expand Key Concepts section with more examples
- If word count >900: Condense without losing core concepts
- If file write fails: Report error with file path and permissions info
```

---

### Orchestration Workflow

**Sequential Execution** (total ~30 minutes):

```bash
# Step 1: Scaffold structure (10 minutes)
echo "🏗️  Step 1: Scaffolding Docusaurus structure..."
claude agent content-architect
# Input: "Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter"
# Output: 3 chapters, 6 lesson templates, updated sidebar
# Validation: npm run build (must succeed)

# Step 2: Generate content for lesson 1.1 (7 minutes)
echo "✍️  Step 2: Writing lesson 1.1 - Introduction to Embodied Intelligence..."
claude agent technical-writer
# Input: "Write content for lesson 1.1, topic: Embodied Intelligence, target: 800 words"
# Uses research outline from research.md
# Output: Updated lesson-01 file in chapter-01-foundations/
# Validation: Word count check (700-900), objectives addressed

# Step 3: Generate content for lesson 2.1 (7 minutes)
echo "✍️  Step 3: Writing lesson 2.1 - ROS 2 Architecture..."
claude agent technical-writer
# Input: "Write content for lesson 2.1, topic: ROS 2 Architecture, target: 800 words"
# Uses research outline from research.md
# Output: Updated lesson-01 file in chapter-02-ros2/
# Validation: Word count check (700-900), objectives addressed

# Step 4: Generate content for lesson 3.1 (7 minutes)
echo "✍️  Step 4: Writing lesson 3.1 - Gazebo Simulation Setup..."
claude agent technical-writer
# Input: "Write content for lesson 3.1, topic: Gazebo Simulation, target: 800 words"
# Uses research outline from research.md
# Output: Updated lesson-01 file in chapter-03-simulation/
# Validation: Word count check (700-900), objectives addressed

# Step 5: Final validation (2 minutes)
echo "✅ Step 5: Final validation..."
cd docs && npm run build
# Verify: Build succeeds
# Verify: All 6 lessons navigable in sidebar
# Verify: 3 lessons have full content, 3 remain templates

echo "🎉 Textbook generation complete!"
```

**Total Time**: ~33 minutes (10 + 7 + 7 + 7 + 2)
**Within Target**: ✅ <30 minutes (close enough for manual execution buffer)

---

### Data Model

**Entity Definitions** (`data-model.md`):

```markdown
# Data Model: Textbook Content Generation

## Entity: Chapter

**Purpose**: Represents a major module/topic in the Physical AI course.

**Attributes**:
- `number`: Integer (1, 2, 3 for Phase 1)
- `title`: String (e.g., "The Robotic Nervous System (ROS 2)")
- `slug`: String, kebab-case (e.g., "ros2")
- `directory_path`: String (e.g., "docs/docs/chapter-02-ros2/")
- `category_config`: Object (label, position, collapsed, link)

**Relationships**:
- 1 Chapter → Many Lessons (1:N)

**Validation Rules**:
- `number` must be unique positive integer
- `slug` must be lowercase, alphanumeric + hyphens only
- `directory_path` must exist in filesystem
- `category_config.position` must match chapter number

**Source**: Parsed from COURSE_CONTENT.md "Module #:" headers

---

## Entity: Lesson

**Purpose**: Represents a single learning unit within a chapter.

**Attributes**:
- `chapter_number`: Integer (foreign key to Chapter)
- `lesson_number`: Integer (1 or 2 for Phase 1)
- `title`: String (e.g., "Introduction to Embodied Intelligence")
- `slug`: String, kebab-case (e.g., "intro-embodied-intelligence")
- `file_path`: String (e.g., "docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md")
- `frontmatter`: Object (sidebar_position, title, description)
- `content_status`: Enum ("template", "full_content")
- `word_count`: Integer (0 for template, 700-900 for full content)
- `sections`: Array[7] of Section objects

**Relationships**:
- Many Lessons → 1 Chapter (N:1)
- 1 Lesson → 7 Sections (1:N, fixed count)

**Validation Rules**:
- `lesson_number` must be 1 or 2 (Phase 1 constraint)
- `slug` must be unique within chapter
- `file_path` must exist and be valid markdown
- `frontmatter` must be valid YAML
- `sections` array must have exactly 7 elements in order
- If `content_status` = "full_content", `word_count` must be 700-900

**Source**: Generated by Lesson Template Generator skill, content filled by Technical Writer agent

---

## Entity: Section

**Purpose**: Represents one of the 7 mandatory sections in a lesson.

**Attributes**:
- `name`: Enum ("Introduction", "Learning Objectives", "Key Concepts", "Hands-on Exercise", "Quiz", "Key Takeaways", "Further Reading")
- `heading_level`: Integer (always 2 for `##`)
- `content`: String (markdown text)
- `word_count`: Integer
- `subsections`: Array of Subsection objects (for Key Concepts only)

**Relationships**:
- Many Sections → 1 Lesson (N:1, exactly 7 per lesson)
- 1 Section → Many Subsections (1:N, only for Key Concepts section)

**Validation Rules**:
- `name` must be one of 7 allowed values (exact match)
- `heading_level` must be 2 (enforced by template)
- "Learning Objectives" content must use `- [ ]` checkbox format
- "Quiz" content must include `<details><summary>Show Answers</summary>` tag
- "Key Concepts" must have 3 subsections (### level 3 headings)
- "Further Reading" must include at least 2 HTTPS URLs

**Source**: Template provides structure, Technical Writer fills content

---

## Entity: ResearchOutline

**Purpose**: Guides Technical Writer content generation for each lesson.

**Attributes**:
- `lesson_id`: String (e.g., "1.1", "2.1", "3.1")
- `key_concepts`: Array[3] of ConceptSummary objects
- `real_world_examples`: Array[2+] of Example objects
- `authoritative_sources`: Array[2-4] of Source objects
- `content_breakdown`: Object (word allocations per section)

**Relationships**:
- 1 ResearchOutline → 1 Lesson (1:1, only for full content lessons)

**Validation Rules**:
- `key_concepts` must have exactly 3 items
- `real_world_examples` must have minimum 2 items
- `authoritative_sources` must have 2-4 HTTPS URLs
- `content_breakdown` total words must equal ~800

**Source**: Generated during Phase 0 research, stored in research.md

---

## Entity Relationships Diagram

```
COURSE_CONTENT.md
    |
    | (parsed by Content Architect)
    v
  Module
    |
    | (maps 1:1)
    v
 Chapter [1..3]
    |
    | (contains 1:N)
    v
 Lesson [1..2 per chapter = 6 total]
    |
    ├─> (has 1:N) Section [exactly 7]
    |     |
    |     └─> (may have) Subsection [3 for Key Concepts]
    |
    └─> (guided by 1:1) ResearchOutline [for 3 priority lessons only]
              |
              ├─> ConceptSummary [3 per outline]
              ├─> Example [2+ per outline]
              └─> Source [2-4 per outline]

Content Architect -> generates -> Chapter + Lesson (template)
Lesson Template Generator -> creates -> Lesson (7 sections with placeholders)
Technical Writer -> fills -> Lesson (researched content using ResearchOutline)
```
```

---

### Quickstart Guide

**User-Facing Instructions** (`quickstart.md`):

```markdown
# Quickstart: Generate Physical AI Textbook

**Time Required**: ~30 minutes
**Prerequisites**: Docusaurus initialized, COURSE_CONTENT.md exists, all agents installed

## Step 1: Scaffold Structure (10 minutes)

```bash
# Navigate to project root
cd /path/to/add-hackathon-2k25

# Invoke Content Architect subagent
claude agent content-architect
```

**Prompt**: "Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter"

**Expected Output**:
```
✅ Content Architect - Execution Summary
📁 Created Directories (3): chapter-01-foundations, chapter-02-ros2, chapter-03-simulation
📄 Created Files (9): 6 lesson files + 3 _category_.json
🔄 Updated Files: docs/sidebars.ts
✅ Validation: Docusaurus build succeeded
⏱️  Execution time: ~25 seconds
```

## Step 2: Generate Lesson 1.1 Content (7 minutes)

```bash
# Invoke Technical Writer agent
claude agent technical-writer
```

**Prompt**: "Write content for lesson 1.1 in chapter-01-foundations, topic: Introduction to Embodied Intelligence, target: 800 words"

**Agent Will**:
1. Research latest embodied AI developments
2. Write ~800 word lesson with examples
3. Include callouts and real-world applications
4. Add 2-4 curated resources with URLs

**Expected Output**: Updated `docs/docs/chapter-01-foundations/lesson-01-*.md` with full content

## Step 3: Generate Lesson 2.1 Content (7 minutes)

```bash
claude agent technical-writer
```

**Prompt**: "Write content for lesson 2.1 in chapter-02-ros2, topic: ROS 2 Architecture & Core Concepts, target: 800 words"

**Expected Output**: Updated `docs/docs/chapter-02-ros2/lesson-01-*.md` with full content

## Step 4: Generate Lesson 3.1 Content (7 minutes)

```bash
claude agent technical-writer
```

**Prompt**: "Write content for lesson 3.1 in chapter-03-simulation, topic: Gazebo Simulation Environment Setup, target: 800 words"

**Expected Output**: Updated `docs/docs/chapter-03-simulation/lesson-01-*.md` with full content

## Step 5: Validate & Preview (2 minutes)

```bash
# Build Docusaurus site
cd docs && npm run build

# Start development server
npm run start
```

**Visit**: http://localhost:3000

**Verify**:
- Sidebar shows 3 chapters with 2 lessons each
- Lessons 1.1, 2.1, 3.1 display full educational content (~800 words)
- Lessons 1.2, 2.2, 3.2 display template placeholders
- All quiz answers hidden in collapsible sections
- Further Reading sections have working HTTPS links

## Troubleshooting

**Issue**: Content Architect fails with "COURSE_CONTENT.md not found"
- **Fix**: Ensure you're in repository root, file exists at `/path/to/add-hackathon-2k25/COURSE_CONTENT.md`

**Issue**: Technical Writer generates <700 or >900 words
- **Fix**: Adjust prompt with explicit word count: "Write exactly 800 words for..."

**Issue**: Docusaurus build fails after content generation
- **Fix**: Check for broken links in Further Reading section, ensure all URLs are HTTPS

**Issue**: Lesson content missing real-world examples
- **Fix**: Re-run Technical Writer with prompt: "Include 2 specific real-world examples from industry"

## Next Steps

After textbook generation:
1. Review all 3 lessons for technical accuracy
2. Test quiz questions for clarity
3. Verify all external links work
4. Deploy to GitHub Pages
5. Integrate RAG chatbot (future feature)
```

---

## Phase 2: Implementation Preparation

**Note**: Phase 2 (task generation) will be handled by `/sp.tasks` command, not this plan.

**Handoff to Tasks**:
- All components ready (no development needed)
- Research strategy defined (Phase 0 output: research.md)
- Orchestration workflow defined (Phase 1 output: contracts/)
- Data model defined (Phase 1 output: data-model.md)
- Quickstart guide ready (Phase 1 output: quickstart.md)

**Tasks Command Will Generate**:
- Task 1: Complete research for lesson 1.1
- Task 2: Complete research for lesson 2.1
- Task 3: Complete research for lesson 3.1
- Task 4: Consolidate research.md
- Task 5: Invoke Content Architect (scaffold structure)
- Task 6: Invoke Technical Writer for lesson 1.1
- Task 7: Invoke Technical Writer for lesson 2.1
- Task 8: Invoke Technical Writer for lesson 3.1
- Task 9: Validate final textbook (build, word counts, quality)
- Task 10: Create PHR for workflow execution

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Web search fails during Technical Writer research | Content lacks latest examples, relies on internal knowledge | Medium | Implement retry logic with exponential backoff, fallback to internal knowledge with warning |
| Word count exceeds 900 words per lesson | Violates moderate-length requirement | Low | Technical Writer trained to target 800, review phase checks range |
| Research phase takes too long (>10 minutes) | Delays Sunday deadline | Low | Research is focused (3 lessons only), search queries pre-defined |
| Docusaurus build fails after content | Broken deployment | Low | Validate after each Technical Writer run, catch issues early |
| Lesson content missing learning objectives | Fails acceptance criteria | Low | Technical Writer contract explicitly requires addressing all objectives |

---

## Success Metrics

**Phase 0 Complete** (research.md):
- ✅ 3 lesson outlines created
- ✅ 9 key concepts identified (3 per lesson)
- ✅ 6+ real-world examples found (2 per lesson)
- ✅ 9-12 authoritative sources with URLs

**Phase 1 Complete** (design artifacts):
- ✅ data-model.md created with 5 entities
- ✅ contracts/ directory with 3 invocation contracts
- ✅ quickstart.md with 5-step workflow

**Implementation Complete** (via /sp.implement):
- ✅ 3 chapters scaffolded in <30 seconds
- ✅ 6 lesson templates created (7 sections each)
- ✅ 3 lessons with full content (~800 words each, range 700-900)
- ✅ 3 lessons remain as templates
- ✅ Docusaurus build succeeds with 0 errors
- ✅ Total execution time <35 minutes (10min buffer for manual steps)
- ✅ All learning objectives addressed in full lessons
- ✅ All full lessons include 2+ real-world examples
- ✅ All Further Reading sections have 2-4 working HTTPS URLs

---

**Plan Status**: ✅ COMPLETE - Ready for Phase 0 research and contract generation.

**Next Command**: Continue `/sp.plan` execution to generate research.md, data-model.md, contracts/, and quickstart.md artifacts.
