# Feature Specification: Textbook Content Generation Workflow

**Feature Branch**: `book-writing`
**Created**: 2025-11-29
**Status**: Draft
**Input**: Orchestrate Content Architect, Lesson Template Generator, and Technical Writer to generate complete Physical AI & Humanoid Robotics textbook

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Course Overview Page (Priority: P0)

As a student or course evaluator, I want to see a comprehensive course overview page before diving into chapters, so that I understand the complete curriculum scope, learning outcomes, and hackathon implementation status.

**Why this priority**: P0 (prerequisite) - This provides essential context before students begin learning. Sets expectations about course coverage and clearly communicates hackathon constraints. Should be the first page visitors see.

**Independent Test**: Navigate to textbook homepage → Verify Overview page displays → Verify it shows full course structure from COURSE_CONTENT.md → Verify hackathon note is visible

**Acceptance Scenarios**:

1. **Given** COURSE_CONTENT.md exists with complete course structure, **When** Overview page is created, **Then** it displays course title, theme, and quarter overview from COURSE_CONTENT.md
2. **Given** Overview page content, **When** displaying module information, **Then** all 4 modules are listed with their focus areas and key topics (even though only 3 are implemented)
3. **Given** course uses selective implementation, **When** Overview page is displayed, **Then** it includes a clear hackathon note explaining "For hackathon purposes, this book covers lesson 1 of the first 3 chapters. Full content will be added later."
4. **Given** Overview page created, **When** sidebar is updated, **Then** Overview appears as the first item before Chapter 1, with sidebar_position: 0

---

### User Story 1 - Automated Structure Scaffolding (Priority: P1)

As a course developer, I want to automatically scaffold the complete Docusaurus textbook structure (3 chapters with 2 lessons each) so that I have a consistent foundation with all required configuration files and lesson templates ready for content authoring.

**Why this priority**: This is the foundational layer that all subsequent work depends on. Without proper scaffolding, content authors cannot begin writing. Delivers immediate value by creating a navigable Docusaurus site with placeholder content.

**Independent Test**: Run Content Architect subagent → Verify 3 chapter directories created → Verify 6 lesson files with standardized templates → Verify Docusaurus build succeeds → Verify all 6 lessons appear in sidebar

**Acceptance Scenarios**:

1. **Given** COURSE_CONTENT.md exists at repository root with module definitions, **When** I invoke Content Architect with "chapters 1-3, lessons 1-2", **Then** 3 chapter directories are created (chapter-01-foundations, chapter-02-ros2, chapter-03-simulation) with proper naming conventions
2. **Given** chapter directories are created, **When** Content Architect uses Lesson Template Generator skill, **Then** each chapter contains exactly 2 lesson files with YAML frontmatter (sidebar_position, title, description) and all 7 mandatory sections (Introduction, Learning Objectives, Key Concepts, Hands-on Exercise, Quiz, Key Takeaways, Further Reading)
3. **Given** all lesson files are created, **When** Content Architect updates docs/sidebars.ts, **Then** sidebar contains 3 category objects with correct labels and document references, and Docusaurus build completes without errors
4. **Given** scaffolding is complete, **When** I run `npm run start` in docs/, **Then** all 3 chapters appear in sidebar navigation, clicking any lesson displays the template content with placeholder text

---

### User Story 2 - Moderate-Length Lesson Content Generation (Priority: P2)

As a technical educator, I want to automatically generate concise, pedagogically-sound lesson content (~800 words per lesson) for the 3 priority lessons (1.1, 2.1, 3.1) that includes research-backed explanations, real-world examples, and proper educational scaffolding, so that students receive professional-quality learning materials without overwhelming content length.

**Why this priority**: This transforms placeholder templates into valuable educational content with moderate depth. The 800-word target balances comprehensive coverage with readability and time constraints. Three priority lessons create a complete learning path through foundational concepts while remaining achievable by Sunday deadline.

**Independent Test**: Run Technical Writer agent on lesson 1.1 → Verify placeholder content replaced with ~800 word comprehensive content → Verify all learning objectives addressed → Verify real-world examples included → Compare content quality against pedagogical standards

**Acceptance Scenarios**:

1. **Given** lesson template exists with placeholder text, **When** Technical Writer agent processes lesson 1.1 (Introduction to Embodied Intelligence), **Then** Introduction section contains 150-200 words explaining why embodied intelligence matters with compelling hook
2. **Given** Technical Writer is researching content, **When** writing Key Concepts section, **Then** content includes 3 concise subsections with clear definitions, explanations of how concepts work, 1-2 real-world robotics examples per concept, and callout boxes for important insights
3. **Given** Technical Writer is creating assessment material, **When** writing Quiz section, **Then** 3 multiple-choice questions are generated that test conceptual understanding and application scenarios, with concise explanations in collapsible `<details>` tag
4. **Given** all sections are written, **When** Technical Writer completes lesson, **Then** content is approximately 800 words (acceptable range 700-900), includes 3-5 key takeaways, provides 2-4 curated external resources with URLs, and maintains consistent tone throughout

---

### User Story 3 - Selective Content Population (Priority: P3)

As a project manager with tight deadlines, I want to strategically populate only the 3 most critical lessons (first lesson of each chapter) with full content while keeping the remaining 3 lessons as template placeholders, so that I can demonstrate a complete textbook structure with enough substance to showcase educational quality without spending time on all 6 lessons.

**Why this priority**: This balances demonstration value with time constraints (Sunday deadline). Three full lessons prove content quality and agent capabilities, while 6 visible lessons in sidebar show complete structure. Perfect for hackathon presentation. With 800-word target, 3 lessons are easily achievable.

**Independent Test**: Verify lesson files 1.1, 2.1, 3.1 contain full content (~800 words each) → Verify lessons 1.2, 2.2, 3.2 remain as templates with placeholder text → Confirm total content generation time < 20 minutes for 3 lessons

**Acceptance Scenarios**:

1. **Given** all 6 lesson templates exist, **When** I run Technical Writer for lessons 1.1, 2.1, 3.1 only, **Then** these 3 files are updated with comprehensive content while lessons 1.2, 2.2, 3.2 remain unchanged with original placeholder text
2. **Given** selective population is complete, **When** viewer navigates Docusaurus site, **Then** first lesson of each chapter displays professional educational content (~800 words), second lesson displays template structure (demonstrating future content format)
3. **Given** time constraint of Sunday 6 PM deadline, **When** executing full workflow (scaffold + 3 lessons), **Then** total execution time is under 30 minutes (10 min scaffold + 20 min content generation)

---

### Edge Cases

- **What happens when COURSE_CONTENT.md is missing or malformed?** Content Architect must fail gracefully with clear error message indicating required file format and location
- **What happens if Docusaurus build fails after sidebar update?** System must detect build failure, report specific error (e.g., invalid document reference), and rollback sidebar changes if necessary
- **How does system handle Technical Writer running on already-populated lesson?** Agent should detect existing content length, prompt user for confirmation before overwriting (prevent accidental data loss)
- **What if user runs Content Architect twice with same parameters?** Agent must detect existing chapter directories and lesson files, skip duplicates with warning messages, maintain idempotent behavior
- **How does system handle internet connectivity issues during Technical Writer research phase?** Agent should retry with exponential backoff, fall back to internal knowledge if web search fails after 3 attempts, log warning about reduced content freshness

## Requirements *(mandatory)*

### Functional Requirements

**Course Overview Page**:
- **FR-000**: System MUST create an `overview.md` file at `docs/docs/overview.md` with sidebar_position: 0 to appear first in navigation
- **FR-00A**: Overview page MUST extract and display course title, theme, and quarter overview from COURSE_CONTENT.md
- **FR-00B**: Overview page MUST list all 4 modules with their focus areas and key topics from COURSE_CONTENT.md
- **FR-00C**: Overview page MUST include a prominent note: "📝 **Hackathon Note**: For demonstration purposes, this textbook currently covers Lesson 1 of the first 3 chapters (Modules 1-3). Complete content for all modules and lessons will be added in future iterations."
- **FR-00D**: Overview page MUST include learning outcomes section from COURSE_CONTENT.md
- **FR-00E**: Sidebar MUST list Overview as the first item before all chapters

**Content Architect Subagent**:
- **FR-001**: System MUST read COURSE_CONTENT.md from repository root and parse module structure using regex pattern matching for "Module #: Title" format
- **FR-002**: System MUST generate chapter directories with naming convention `chapter-##-{slug}/` where slug is kebab-case conversion of module title (lowercase, hyphens, alphanumeric only)
- **FR-003**: System MUST invoke Lesson Template Generator skill for each lesson to create standardized markdown files with YAML frontmatter and 7 mandatory sections
- **FR-004**: System MUST create `_category_.json` file in each chapter directory containing label, position (integer), collapsed flag (false), and link configuration
- **FR-005**: System MUST update docs/sidebars.ts by appending new category objects to tutorialSidebar array while preserving all existing sidebar items and comments

**Lesson Template Generator Skill**:
- **FR-006**: System MUST generate lesson files with valid YAML frontmatter containing sidebar_position (integer), title (string), and description (string) fields
- **FR-007**: Template MUST include exactly 7 sections in order: Introduction, Learning Objectives, Key Concepts, Hands-on Exercise, Quiz, Key Takeaways, Further Reading
- **FR-008**: Learning Objectives section MUST use checkbox format `- [ ]` with action verbs (define, explain, implement, apply)
- **FR-009**: Quiz section MUST include 3 multiple-choice questions with 4 options (A-D) each, and answers MUST be enclosed in `<details><summary>Show Answers</summary>` tag
- **FR-010**: Template MUST include placeholder text in each section providing clear guidance for content writers on what to include

**Technical Writer Agent**:
- **FR-011**: Agent MUST use web search tools to research latest information about the lesson topic before writing content (never rely solely on internal knowledge)
- **FR-012**: Agent MUST generate content length of approximately 800 words per lesson (acceptable range: 700-900 words)
- **FR-013**: Agent MUST address ALL learning objectives explicitly in the content with measurable learning checkpoints
- **FR-014**: Agent MUST include real-world analogies and examples from robotics/AI industry to make abstract concepts concrete (minimum 1-2 examples per lesson)
- **FR-015**: Agent MUST add callout boxes using markdown blockquotes (>) for key concepts, warnings, or diagram suggestions
- **FR-016**: Agent MUST provide 3-5 key takeaways that summarize the most critical concepts from the lesson
- **FR-017**: Agent MUST include 2-4 curated external resources in Further Reading section with actual URLs (not placeholders) and brief descriptions

**Workflow Orchestration**:
- **FR-018**: System MUST execute workflow in strict order: Content Architect → Lesson Template Generator (via skill invocation) → Technical Writer
- **FR-019**: System MUST validate Docusaurus build after scaffolding phase (run `npm run build` in docs/ directory and verify exit code 0)
- **FR-020**: System MUST log all file creation operations to console with clear status indicators (✅ created, ⚠️ skipped, ❌ failed)
- **FR-021**: System MUST generate execution summary displaying created directories count, created files count, updated files list, validation status, and total execution time

**Error Handling**:
- **FR-022**: System MUST fail with clear error message if COURSE_CONTENT.md not found at repository root, suggesting creation steps
- **FR-023**: System MUST fail with clear error message if docs/docs/ directory not found, suggesting Docusaurus initialization steps
- **FR-024**: System MUST fail with clear error message if file write permission denied, suggesting chmod/ownership fix commands

### Key Entities

- **Chapter**: Represents a major module/topic in the course. Contains multiple lessons. Has properties: number (integer), title (string), slug (kebab-case string), directory path, category configuration. Relationship: 1 Chapter → Many Lessons
- **Lesson**: Represents a single learning unit within a chapter. Has properties: number (integer 1-2 for Phase 1), title (string), slug (kebab-case string), frontmatter (YAML), content sections (7 required), file path, word count (~800 words for full content). Relationship: Many Lessons → 1 Chapter
- **Template**: Standardized markdown structure for lessons. Contains YAML frontmatter schema + 7 section definitions with placeholder text. Used by Lesson Template Generator skill. Stateless entity (same template used for all lessons)
- **Content**: The actual educational material that replaces template placeholders. Has properties: word count (~800 words, range 700-900), research sources (URLs), learning objectives coverage, key takeaways (3-5 points), callouts/diagrams. Generated by Technical Writer agent

**Entity Relationships**:
```
COURSE_CONTENT.md (source)
    ↓ parses into
Module (1-4)
    ↓ maps to
Chapter (1-3 for Phase 1)
    ↓ contains
Lesson (1-2 per chapter, 6 total)
    ↓ starts as
Template (7 sections)
    ↓ transforms into
Content (for lessons 1.1, 2.1, 3.1 only - ~800 words each)
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Content Architect execution completes in under 30 seconds for 3 chapters with 2 lessons each (6 lesson files total)
- **SC-002**: All generated lesson files pass Docusaurus markdown validation (no broken links, valid YAML frontmatter, proper heading hierarchy)
- **SC-003**: Technical Writer generates content that averages 800 words per lesson (acceptable range 700-900 words)
- **SC-004**: 100% of learning objectives defined in templates are explicitly addressed in generated content (verifiable through keyword matching)
- **SC-005**: Docusaurus production build (`npm run build`) completes with 0 errors and 0 warnings after full workflow execution
- **SC-006**: Total workflow execution time (scaffold + 3 lessons content generation) is under 30 minutes
- **SC-007**: Generated content includes minimum 1-2 real-world examples per lesson (e.g., robotics companies, research papers, industry applications)
- **SC-008**: Sidebar navigation correctly displays 3 chapters with 2 lessons each, totaling 6 clickable lesson links
- **SC-009**: Running Content Architect twice with identical parameters produces idempotent behavior (no duplicates, warning messages logged)
- **SC-010**: All generated content maintains consistent educational tone (encouraging, inclusive, technically accurate) with appropriate conciseness for 800-word target

## Architecture & Design *(mandatory)*

### Component Overview

**1. Content Architect Subagent** (`.claude/agents/content-architect.md`)
- **Purpose**: Orchestrates scaffolding of complete Docusaurus textbook structure
- **Status**: Fully implemented in feature 001-content-architect-subagent (merged to master)
- **Tools Available**: Read, Write, Glob, Bash, Grep
- **Input**: User command "chapters X-Y, lessons A-B"
- **Output**: Chapter directories, lesson files (via skill), _category_.json files, updated sidebars.ts
- **Key Algorithms**:
  - COURSE_CONTENT.md regex parser (extracts Module # and Title)
  - Slug generator (title → kebab-case)
  - Sidebar updater (TypeScript syntax-aware append)
  - Duplicate detection (checks existing directories and sidebar labels)

**2. Lesson Template Generator Skill** (`.claude/skills/lesson-template-generator/SKILL.md`)
- **Purpose**: Generates standardized lesson markdown with 7 mandatory sections
- **Status**: Created and documented
- **Invoked By**: Content Architect subagent (programmatic invocation, not user-facing)
- **Input**: Lesson metadata (chapter number, lesson number, title, description, position)
- **Output**: Complete markdown file with YAML frontmatter + 7 sections with placeholder text
- **Template Structure**:
  ```yaml
  ---
  sidebar_position: 1
  title: Lesson Title
  description: Brief description
  ---
  # Lesson Title
  ## Introduction (placeholder ~150-200 words)
  ## Learning Objectives (3 checkboxes)
  ## Key Concepts (3 subsections ~300 words total)
  ## Hands-on Exercise (prerequisites, steps, outcome ~150 words)
  ## Quiz (3 questions ~100 words)
  ## Key Takeaways (3-5 bullets ~50 words)
  ## Further Reading (2-4 resources ~50 words)
  ```

**3. Technical Writer Agent** (`.claude/agents/technical-writer.md`)
- **Purpose**: Replaces template placeholders with concise educational content (~800 words)
- **Status**: Configured and ready
- **Tools Available**: All tools (Read, Write, Edit, WebSearch, WebFetch)
- **Input**: Lesson file path + topic + learning objectives
- **Output**: Updated lesson file with ~800 word content
- **Workflow**:
  1. **Research Phase**: WebSearch for latest developments, examples, authoritative sources
  2. **Planning Phase**: Map objectives to content sections, identify analogies
  3. **Writing Phase**: Generate concise content with proper structure, transitions, callouts
  4. **Review Phase**: Verify objectives addressed, check word count (700-900 range), validate tone

### Data Flow

```
User Command: "Generate textbook with 3 chapters, 2 lessons each"
    ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: SCAFFOLDING (Content Architect)                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Read COURSE_CONTENT.md                                   │
│ 2. Parse Modules 1-3 → Extract titles                       │
│ 3. Generate slugs (kebab-case)                              │
│ 4. Create chapter directories:                              │
│    - docs/docs/chapter-01-foundations/                      │
│    - docs/docs/chapter-02-ros2/                             │
│    - docs/docs/chapter-03-simulation/                       │
│ 5. For each chapter, invoke Lesson Template Generator:      │
│    ├─ Generate lesson-01-{slug}.md                          │
│    └─ Generate lesson-02-{slug}.md                          │
│ 6. Create _category_.json in each chapter                   │
│ 7. Update docs/sidebars.ts (append 3 categories)            │
│ 8. Validate: npm run build                                  │
│ 9. Report summary                                           │
└─────────────────────────────────────────────────────────────┘
    ↓ Output: 6 lesson files with templates
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: TEMPLATE GENERATION (Lesson Template Generator)    │
├─────────────────────────────────────────────────────────────┤
│ Called 6 times (once per lesson) by Content Architect       │
│                                                              │
│ For each lesson:                                            │
│ 1. Receive metadata (chapter #, lesson #, title, desc)      │
│ 2. Generate YAML frontmatter                                │
│ 3. Add 7 sections with placeholder text:                    │
│    ├─ Introduction (150-200 word guide)                     │
│    ├─ Learning Objectives (3 checkbox templates)            │
│    ├─ Key Concepts (3 subsection placeholders ~300w)        │
│    ├─ Hands-on Exercise (steps structure ~150w)             │
│    ├─ Quiz (3 MC question templates ~100w)                  │
│    ├─ Key Takeaways (3-5 bullet placeholders ~50w)          │
│    └─ Further Reading (2-4 resource placeholders ~50w)      │
│ 4. Return complete markdown to Content Architect            │
└─────────────────────────────────────────────────────────────┘
    ↓ Output: Standardized templates ready for content
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: CONTENT GENERATION (Technical Writer)              │
├─────────────────────────────────────────────────────────────┤
│ Run 3 times for priority lessons: 1.1, 2.1, 3.1             │
│ Target: ~800 words per lesson                               │
│                                                              │
│ For each lesson:                                            │
│ 1. Research Phase:                                          │
│    ├─ WebSearch: "embodied intelligence robotics 2025"     │
│    ├─ WebSearch: "ROS 2 humanoid robots applications"      │
│    └─ WebFetch: Retrieve authoritative sources             │
│ 2. Planning Phase:                                          │
│    ├─ Map learning objectives to content sections          │
│    ├─ Identify 1-2 real-world examples                     │
│    └─ Plan callout boxes for key concepts                  │
│ 3. Writing Phase (concise, focused content):               │
│    ├─ Replace Introduction (~150-200 words)                │
│    ├─ Replace Learning Objectives (specific goals)         │
│    ├─ Replace Key Concepts (3 subsections ~300 words)      │
│    ├─ Replace Hands-on Exercise (~150 words)               │
│    ├─ Replace Quiz (thoughtful questions ~100 words)       │
│    ├─ Replace Key Takeaways (3-5 bullets ~50 words)        │
│    └─ Replace Further Reading (real URLs ~50 words)        │
│ 4. Review Phase:                                            │
│    ├─ Verify all objectives addressed                      │
│    ├─ Check word count (700-900 range)                     │
│    └─ Validate conciseness and clarity                     │
│ 5. Write updated file (preserves frontmatter)              │
└─────────────────────────────────────────────────────────────┘
    ↓ Output: 3 lessons with full content (~800w each), 3 with templates
┌─────────────────────────────────────────────────────────────┐
│ FINAL STATE: Docusaurus Textbook                            │
├─────────────────────────────────────────────────────────────┤
│ docs/docs/                                                   │
│ ├── chapter-01-foundations/                                 │
│ │   ├── _category_.json                                     │
│ │   ├── lesson-01-intro-embodied-intelligence.md (~800w)   │
│ │   └── lesson-02-robotics-landscape.md (TEMPLATE)         │
│ ├── chapter-02-ros2/                                        │
│ │   ├── _category_.json                                     │
│ │   ├── lesson-01-ros2-architecture.md (~800w)             │
│ │   └── lesson-02-nodes-topics.md (TEMPLATE)               │
│ └── chapter-03-simulation/                                  │
│     ├── _category_.json                                     │
│     ├── lesson-01-gazebo-setup.md (~800w)                  │
│     └── lesson-02-urdf-sdf.md (TEMPLATE)                   │
│                                                              │
│ Sidebar shows: 3 chapters, 6 lessons                        │
│ Content: 3 full lessons (~800 words each = ~2400w total)    │
│ Build status: ✅ Success                                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Docusaurus 3.x**: Static site generator for textbook hosting
- **Markdown + YAML Frontmatter**: Content format with metadata
- **TypeScript**: sidebars.ts configuration
- **Node.js + npm**: Build toolchain
- **Claude Code Subagents**: Custom AI agents for automation
- **Claude Code Skills**: Reusable capabilities for agents
- **Web Search APIs**: Research for content generation
- **Git**: Version control for content

### Constraints & Assumptions

**Constraints**:
- Phase 1 scope limited to 3 chapters, 2 lessons per chapter (6 total)
- Only first lesson of each chapter receives full content (3 out of 6)
- Content length limited to ~800 words per lesson (range 700-900)
- Content generation limited to moderate depth (can be enhanced in future)
- Deadline: Sunday, 30 Nov 2025, 6 PM PKT (Karachi/Islamabad time)
- Must work on existing "book-writing" branch (no new feature branch)

**Assumptions**:
- COURSE_CONTENT.md already exists and is properly formatted with Module headers
- Docusaurus project already initialized in docs/ directory with npm dependencies installed
- docs/sidebars.ts exists with valid tutorialSidebar array
- User has write permissions to docs/docs/ directory
- Internet connectivity available for Technical Writer research phase
- Content Architect subagent already fully implemented from previous feature (001)

### Non-Goals (Out of Scope for Phase 1)

- ❌ Generating all 6 lessons with full content (only 3 priority lessons)
- ❌ Creating detailed code examples or hands-on exercises (basic structure only)
- ❌ Generating diagrams or illustrations (noted as suggestions only)
- ❌ Implementing quiz interactivity (static markdown only)
- ❌ Integrating RAG-based chatbot (planned for future phase)
- ❌ Deploying to GitHub Pages (manual deployment post-generation)
- ❌ Creating comprehensive assessments or project rubrics
- ❌ Generating video transcripts or multimedia content
- ❌ Translating content to multiple languages
- ❌ Adding search functionality beyond Docusaurus defaults
- ❌ Content exceeding 900 words per lesson (keeping it moderate)

## Dependencies *(include if applicable)*

### Internal Dependencies

- **Content Architect Subagent** (`.claude/agents/content-architect.md`): Fully implemented in feature 001-content-architect-subagent (merged to master)
- **Lesson Template Generator Skill** (`.claude/skills/lesson-template-generator/SKILL.md`): Created, documented, ready for integration
- **Technical Writer Agent** (`.claude/agents/technical-writer.md`): Exists with complete prompt and configuration
- **COURSE_CONTENT.md**: Source of truth for course module structure
- **Docusaurus Configuration**: docs/docusaurus.config.js must be valid
- **Git Branch**: "book-writing" branch must be current and clean

### External Dependencies

- **Node.js** (v18+): Required for Docusaurus build
- **npm**: Package manager for dependencies
- **Docusaurus** (v3.x): Static site generator
- **Web Search API**: For Technical Writer research (Claude's built-in capability)
- **File System Access**: Write permissions to docs/docs/

### Dependency Risks

- **Risk**: Content Architect changes in future could break template generation
  - **Mitigation**: Lesson Template Generator skill has versioned contract, tests validate 7 sections
- **Risk**: Docusaurus version upgrade could change sidebar format
  - **Mitigation**: Sidebar updater uses TypeScript-aware parsing, not brittle regex
- **Risk**: Web search API rate limits during Technical Writer research
  - **Mitigation**: Agent implements exponential backoff, fallback to internal knowledge with warning

## Validation & Testing *(mandatory)*

### Test Plan

**Test 1: End-to-End Workflow Execution**
```bash
# Precondition: Clean docs/docs/ directory
rm -rf docs/docs/chapter-*

# Execute: Run Content Architect
claude agent content-architect
> Input: "chapters 1-3, lessons 1-2"

# Validate Scaffolding
assert [ -d "docs/docs/chapter-01-foundations" ]
assert [ -d "docs/docs/chapter-02-ros2" ]
assert [ -d "docs/docs/chapter-03-simulation" ]
assert [ $(find docs/docs/chapter-* -name "lesson-*.md" | wc -l) -eq 6 ]
assert [ $(find docs/docs/chapter-* -name "_category_.json" | wc -l) -eq 3 ]

# Validate Templates
cat docs/docs/chapter-01-foundations/lesson-01-*.md | grep -q "## Introduction"
cat docs/docs/chapter-01-foundations/lesson-01-*.md | grep -q "## Learning Objectives"
cat docs/docs/chapter-01-foundations/lesson-01-*.md | grep -q "## Quiz"

# Validate Build
cd docs && npm run build
assert [ $? -eq 0 ]

# Execute: Run Technical Writer on lesson 1.1
claude agent technical-writer
> Input: "lesson-01-*.md in chapter-01-foundations, topic: Embodied Intelligence, target 800 words"

# Validate Content Quality
WORD_COUNT=$(cat docs/docs/chapter-01-foundations/lesson-01-*.md | wc -w)
assert [ $WORD_COUNT -ge 700 ] && [ $WORD_COUNT -le 900 ]
cat docs/docs/chapter-01-foundations/lesson-01-*.md | grep -q "http" # At least one URL

# Validate Selective Population
TEMPLATE_WORD_COUNT=$(cat docs/docs/chapter-01-foundations/lesson-02-*.md | wc -w)
assert [ $TEMPLATE_WORD_COUNT -lt 500 ] # Should still be template
```

**Test 2: Word Count Compliance**
```bash
# Generate all 3 priority lessons
for chapter in 01 02 03; do
  claude agent technical-writer
  > Input: "lesson-01 in chapter-$chapter, 800 words"
done

# Validate word counts
for file in chapter-01-*/lesson-01-*.md chapter-02-*/lesson-01-*.md chapter-03-*/lesson-01-*.md; do
  WC=$(cat "$file" | wc -w)
  echo "$file: $WC words"
  assert [ $WC -ge 700 ] && [ $WC -le 900 ]
done
```

**Test 3: Idempotency Check**
```bash
# Run Content Architect twice
claude agent content-architect
> Input: "chapters 1-3, lessons 1-2"

claude agent content-architect
> Input: "chapters 1-3, lessons 1-2"

# Validate no duplicates
assert [ $(find docs/docs/chapter-* -name "lesson-*.md" | wc -l) -eq 6 ] # Still only 6 lessons
grep -c "Chapter 1:" docs/sidebars.ts # Should appear only once
```

### Acceptance Criteria Summary

All acceptance scenarios from User Stories 1-3 must pass:

**User Story 1** (4 scenarios):
- ✅ 3 chapter directories created with correct naming
- ✅ 6 lesson files with YAML frontmatter and 7 sections
- ✅ Sidebar updated with 3 categories, Docusaurus builds
- ✅ All lessons navigable in sidebar

**User Story 2** (4 scenarios):
- ✅ Introduction section 150-200 words with compelling hook
- ✅ Key Concepts with 3 subsections, definitions, 1-2 examples, callouts
- ✅ Quiz with 3 MC questions testing understanding, collapsible answers
- ✅ Content ~800 words (700-900 range), 3-5 takeaways, 2-4 resources with URLs

**User Story 3** (3 scenarios):
- ✅ Lessons 1.1, 2.1, 3.1 have full content (~800w); 1.2, 2.2, 3.2 remain templates
- ✅ First lesson per chapter shows professional content, second shows template
- ✅ Total execution time < 30 minutes

## Security & Privacy *(include if applicable)*

### Security Considerations

- **FR-025**: System MUST NOT include sensitive data (API keys, credentials, personal information) in generated lesson content
- **FR-026**: Generated content MUST use HTTPS URLs only for external resources (no HTTP links)
- **FR-027**: Quiz answers and solutions MUST NOT be visible in page source (properly enclosed in `<details>` tags)

### Privacy Considerations

- **No User Data**: Textbook content is educational material with no user-specific data
- **Public Resources**: All referenced resources are publicly accessible educational materials
- **No Tracking**: Generated content does not include analytics or tracking scripts (Docusaurus handles this separately)

## Future Enhancements *(optional)*

### Phase 2: Content Expansion
- Expand lessons from ~800 to 1500-2500 words for more comprehensive coverage
- Generate all 6 lessons with full content (not just 3)
- Add 3 more chapters (total 6 chapters, 12 lessons)
- Create detailed hands-on code exercises with runnable examples
- Generate Mermaid diagrams for complex concepts

### Phase 3: Interactive Features
- Integrate RAG-based chatbot with ChatKit for Q&A
- Add interactive quiz components with immediate feedback
- Create code playgrounds for ROS 2 examples
- Add video embeds for complex demonstrations

### Phase 4: Advanced Pedagogy
- Generate personalized learning paths based on prerequisites
- Add difficulty ratings and estimated completion times
- Create assessment rubrics for hands-on projects
- Generate certificate of completion materials

### Phase 5: Production Polish
- Multi-language support (translate to Urdu, Arabic)
- Accessibility improvements (WCAG 2.1 AA compliance)
- SEO optimization (meta tags, structured data)
- GitHub Pages deployment automation

---

**Specification Complete**: This document defines the complete workflow for generating a Physical AI & Humanoid Robotics textbook with moderate-length (~800 word) lessons using orchestrated subagents and skills. Next step: Run `/sp.plan` to create implementation plan.
