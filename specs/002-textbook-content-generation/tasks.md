# Tasks: Textbook Content Generation Workflow

**Input**: Design documents from `/specs/002-textbook-content-generation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests for this feature - validation done through Docusaurus builds and manual content review

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths or agent names in descriptions

## Path Conventions

This is a content generation workflow, not traditional software development:
- **Content Output**: `docs/docs/chapter-##-{slug}/`
- **Agents**: `.claude/agents/` (already implemented)
- **Skills**: `.claude/skills/` (already implemented)
- **Configuration**: `docs/sidebars.ts`, `docs/docusaurus.config.js`

---

## Phase 1: Setup & Prerequisites Validation

**Purpose**: Verify all prerequisites are in place before content generation

**⚠️ IMPORTANT**: All agents and skills are already implemented. This phase only validates environment.

- [X] T001 Verify COURSE_CONTENT.md exists at repository root with Module 1-3 definitions
- [X] T002 [P] Verify Docusaurus initialized (docs/ directory exists, npm dependencies installed)
- [X] T003 [P] Verify docs/sidebars.ts exists with tutorialSidebar array
- [X] T004 [P] Verify Content Architect subagent available at .claude/agents/content-architect.md
- [X] T005 [P] Verify Lesson Template Generator skill available at .claude/skills/lesson-template-generator/SKILL.md
- [X] T006 [P] Verify Technical Writer agent available at .claude/agents/technical-writer.md
- [X] T007 Verify write permissions to docs/docs/ directory
- [X] T008 Run baseline Docusaurus build (npm run build in docs/) to ensure starting state is valid

**Checkpoint**: Environment validated - content generation can begin

---

## Phase 2: User Story 1 - Automated Structure Scaffolding (Priority: P1) 🎯 MVP

**Goal**: Automatically scaffold complete Docusaurus textbook structure (3 chapters with 2 lessons each) with all required configuration files and lesson templates ready for content authoring.

**Independent Test**:
```bash
# Verify 3 directories created
ls -d docs/docs/chapter-01-* docs/docs/chapter-02-* docs/docs/chapter-03-*

# Verify 6 lesson files exist
find docs/docs/chapter-* -name "lesson-*.md" | wc -l  # Should be 6

# Verify Docusaurus build succeeds
cd docs && npm run build  # Should exit 0

# Verify all 6 lessons navigable in sidebar
npm run start  # Check http://localhost:3000 sidebar
```

### Implementation for User Story 1

- [ ] T009 [US1] Invoke Content Architect subagent with prompt: "Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter"
- [ ] T010 [US1] Validate 3 chapter directories created: chapter-01-foundations/, chapter-02-ros2/, chapter-03-simulation/ in docs/docs/
- [ ] T011 [P] [US1] Validate lesson file created: docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md
- [ ] T012 [P] [US1] Validate lesson file created: docs/docs/chapter-01-foundations/lesson-02-robotics-landscape.md
- [ ] T013 [P] [US1] Validate lesson file created: docs/docs/chapter-02-ros2/lesson-01-ros2-architecture.md
- [ ] T014 [P] [US1] Validate lesson file created: docs/docs/chapter-02-ros2/lesson-02-nodes-topics-services.md
- [ ] T015 [P] [US1] Validate lesson file created: docs/docs/chapter-03-simulation/lesson-01-gazebo-setup.md
- [ ] T016 [P] [US1] Validate lesson file created: docs/docs/chapter-03-simulation/lesson-02-urdf-sdf-formats.md
- [ ] T017 [P] [US1] Validate _category_.json created in docs/docs/chapter-01-foundations/
- [ ] T018 [P] [US1] Validate _category_.json created in docs/docs/chapter-02-ros2/
- [ ] T019 [P] [US1] Validate _category_.json created in docs/docs/chapter-03-simulation/
- [ ] T020 [US1] Validate docs/sidebars.ts updated with 3 new category objects (no duplicates)
- [ ] T021 [US1] Validate all 6 lesson files contain YAML frontmatter (sidebar_position, title, description)
- [ ] T022 [US1] Validate all 6 lesson files have 7 mandatory sections (Introduction, Learning Objectives, Key Concepts, Hands-on Exercise, Quiz, Key Takeaways, Further Reading)
- [ ] T023 [US1] Run Docusaurus build validation: cd docs && npm run build (must exit code 0)
- [ ] T024 [US1] Start Docusaurus dev server and verify all 6 lessons appear in sidebar navigation

**Checkpoint**: User Story 1 complete - 3 chapters with 6 lesson templates created, Docusaurus builds successfully, all lessons navigable

---

## Phase 3: User Story 2 - Moderate-Length Lesson Content Generation (Priority: P2)

**Goal**: Automatically generate concise, pedagogically-sound lesson content (~800 words per lesson) for the 3 priority lessons (1.1, 2.1, 3.1) that includes research-backed explanations, real-world examples, and proper educational scaffolding.

**Independent Test**:
```bash
# Verify lessons 1.1, 2.1, 3.1 have full content (~800 words each)
cat docs/docs/chapter-01-foundations/lesson-01-*.md | wc -w  # Should be 700-900
cat docs/docs/chapter-02-ros2/lesson-01-*.md | wc -w         # Should be 700-900
cat docs/docs/chapter-03-simulation/lesson-01-*.md | wc -w   # Should be 700-900

# Verify content quality: real-world examples present
grep -i "tesla\|figure\|unitree\|boston dynamics\|nasa\|agility" docs/docs/chapter-*/lesson-01-*.md

# Verify Further Reading has HTTPS URLs
grep "https://" docs/docs/chapter-*/lesson-01-*.md | grep "Further Reading" -A 5
```

### Implementation for User Story 2

**Lesson 1.1: Introduction to Embodied Intelligence**

- [ ] T025 [US2] Invoke Technical Writer agent with prompt: "Write content for lesson 1.1 in chapter-01-foundations, topic: Introduction to Embodied Intelligence, target: 800 words"
- [ ] T026 [US2] Validate lesson 1.1 Introduction section replaced with ~150-200 word compelling hook and context
- [ ] T027 [US2] Validate lesson 1.1 Learning Objectives replaced with 3-4 specific, measurable objectives using action verbs
- [ ] T028 [US2] Validate lesson 1.1 Key Concepts section has 3 subsections (~100-120 words each) with definitions, explanations, and examples
- [ ] T029 [US2] Validate lesson 1.1 has minimum 2 callout boxes (>) for key insights or warnings
- [ ] T030 [US2] Validate lesson 1.1 Hands-on Exercise has Prerequisites, Steps, and Expected Outcome sections filled
- [ ] T031 [US2] Validate lesson 1.1 Quiz has 3 multiple-choice questions with answers hidden in <details> tag
- [ ] T032 [US2] Validate lesson 1.1 Key Takeaways has 3-5 concise bullet points
- [ ] T033 [US2] Validate lesson 1.1 Further Reading has 2-4 resources with HTTPS URLs (verified accessible)
- [ ] T034 [US2] Validate lesson 1.1 total word count is 700-900 words (excluding YAML frontmatter)
- [ ] T035 [US2] Validate lesson 1.1 includes minimum 2 real-world examples (Tesla Optimus, Figure 01, 1X Neo, Boston Dynamics Atlas)

**Lesson 2.1: ROS 2 Architecture & Core Concepts**

- [ ] T036 [US2] Invoke Technical Writer agent with prompt: "Write content for lesson 2.1 in chapter-02-ros2, topic: ROS 2 Architecture & Core Concepts, target: 800 words"
- [ ] T037 [US2] Validate lesson 2.1 Introduction section replaced with ~150-200 word explanation of ROS 2 importance
- [ ] T038 [US2] Validate lesson 2.1 Learning Objectives replaced with specific goals (explain ROS 2 architecture, differentiate topics/services/actions)
- [ ] T039 [US2] Validate lesson 2.1 Key Concepts section covers: ROS 2 as Middleware, Publish-Subscribe Pattern, Services and Actions
- [ ] T040 [US2] Validate lesson 2.1 has callout boxes explaining middleware role and communication pattern design choices
- [ ] T041 [US2] Validate lesson 2.1 Hands-on Exercise provides practical ROS 2 commands for exploration
- [ ] T042 [US2] Validate lesson 2.1 Quiz tests understanding of middleware, topics vs services, and real-world applications
- [ ] T043 [US2] Validate lesson 2.1 Further Reading includes ROS 2 official docs, Nav2 documentation, and community resources
- [ ] T044 [US2] Validate lesson 2.1 total word count is 700-900 words
- [ ] T045 [US2] Validate lesson 2.1 includes minimum 2 real-world examples (Unitree H1, NASA Valkyrie, Agility Digit, Nav2)

**Lesson 3.1: Gazebo Simulation Environment Setup**

- [ ] T046 [US2] Invoke Technical Writer agent with prompt: "Write content for lesson 3.1 in chapter-03-simulation, topic: Gazebo Simulation Environment Setup, target: 800 words"
- [ ] T047 [US2] Validate lesson 3.1 Introduction section explains why simulation matters for robotics development
- [ ] T048 [US2] Validate lesson 3.1 Learning Objectives cover Gazebo setup, SDF/URDF understanding, sensor configuration
- [ ] T049 [US2] Validate lesson 3.1 Key Concepts section covers: Physics Engines, SDF/URDF Description, Sensor Simulation
- [ ] T050 [US2] Validate lesson 3.1 has callout boxes about sim-to-real gap and collision mesh optimization
- [ ] T051 [US2] Validate lesson 3.1 Hands-on Exercise provides concrete Gazebo launch and inspection commands
- [ ] T052 [US2] Validate lesson 3.1 Quiz tests understanding of physics engines, robot description formats, and noise models
- [ ] T053 [US2] Validate lesson 3.1 Further Reading includes Gazebo official docs, Isaac Sim comparison, SDF tutorials
- [ ] T054 [US2] Validate lesson 3.1 total word count is 700-900 words
- [ ] T055 [US2] Validate lesson 3.1 includes minimum 2 real-world examples (NASA simulation, Unitree development, RoboCup, academic research)

**Content Quality Validation (All 3 Lessons)**

- [ ] T056 [US2] Verify all 3 full content lessons address 100% of their defined learning objectives
- [ ] T057 [US2] Verify all 3 full content lessons maintain consistent educational tone (encouraging, inclusive, technically accurate)
- [ ] T058 [US2] Verify all Further Reading URLs are accessible (manually click each link)
- [ ] T059 [US2] Run Docusaurus build to ensure no broken links: cd docs && npm run build

**Checkpoint**: User Story 2 complete - 3 lessons (1.1, 2.1, 3.1) have full researched content (~800 words each, ~2400 words total)

---

## Phase 4: User Story 3 - Selective Content Population (Priority: P3)

**Goal**: Verify that only the 3 most critical lessons (first lesson of each chapter) have full content while the remaining 3 lessons remain as template placeholders, demonstrating complete textbook structure with enough substance to showcase educational quality.

**Independent Test**:
```bash
# Verify lessons 1.1, 2.1, 3.1 have full content (>700 words)
wc -w docs/docs/chapter-01-foundations/lesson-01-*.md | tail -1  # >700
wc -w docs/docs/chapter-02-ros2/lesson-01-*.md | tail -1          # >700
wc -w docs/docs/chapter-03-simulation/lesson-01-*.md | tail -1    # >700

# Verify lessons 1.2, 2.2, 3.2 remain as templates (<500 words)
wc -w docs/docs/chapter-01-foundations/lesson-02-*.md | tail -1  # <500
wc -w docs/docs/chapter-02-ros2/lesson-02-*.md | tail -1          # <500
wc -w docs/docs/chapter-03-simulation/lesson-02-*.md | tail -1    # <500

# Verify sidebar shows all 6 lessons
npm run start  # Check http://localhost:3000 sidebar displays 3 chapters × 2 lessons
```

### Implementation for User Story 3

- [ ] T060 [P] [US3] Verify lesson 1.1 has full content (word count 700-900) in docs/docs/chapter-01-foundations/lesson-01-*.md
- [ ] T061 [P] [US3] Verify lesson 2.1 has full content (word count 700-900) in docs/docs/chapter-02-ros2/lesson-01-*.md
- [ ] T062 [P] [US3] Verify lesson 3.1 has full content (word count 700-900) in docs/docs/chapter-03-simulation/lesson-01-*.md
- [ ] T063 [P] [US3] Verify lesson 1.2 remains template placeholder (word count <500) in docs/docs/chapter-01-foundations/lesson-02-*.md
- [ ] T064 [P] [US3] Verify lesson 2.2 remains template placeholder (word count <500) in docs/docs/chapter-02-ros2/lesson-02-*.md
- [ ] T065 [P] [US3] Verify lesson 3.2 remains template placeholder (word count <500) in docs/docs/chapter-03-simulation/lesson-02-*.md
- [ ] T066 [US3] Start Docusaurus dev server and manually navigate to verify: first lesson of each chapter displays professional educational content
- [ ] T067 [US3] Start Docusaurus dev server and manually navigate to verify: second lesson of each chapter displays template structure with placeholders
- [ ] T068 [US3] Verify total content generation completed in under 35 minutes (includes 5 min buffer for manual verification)

**Checkpoint**: User Story 3 complete - Selective population verified: 3 lessons with full content, 3 lessons with templates, complete textbook structure demonstrated

---

## Phase 5: Polish & Final Validation

**Purpose**: Final quality checks and deployment preparation

- [ ] T069 [P] Run comprehensive Docusaurus production build: cd docs && npm run build (must exit 0, no warnings)
- [ ] T070 [P] Verify all quiz answers are properly hidden in <details> tags (not visible in page source until expanded)
- [ ] T071 [P] Run manual content review: Read lesson 1.1 for technical accuracy and pedagogical quality
- [ ] T072 [P] Run manual content review: Read lesson 2.1 for technical accuracy and pedagogical quality
- [ ] T073 [P] Run manual content review: Read lesson 3.1 for technical accuracy and pedagogical quality
- [ ] T074 [P] Validate all external links work: Click each URL in Further Reading sections of lessons 1.1, 2.1, 3.1
- [ ] T075 [P] Test quiz functionality: Attempt quiz questions in all 3 full lessons, verify answers make sense
- [ ] T076 [P] Verify sidebar navigation: All 3 chapters visible, all 6 lessons clickable, correct ordering
- [ ] T077 [P] Check responsive design: View textbook on mobile viewport (optional, Docusaurus handles this by default)
- [ ] T078 Validate success criteria met: All 10 success criteria from spec.md (SC-001 through SC-010) verified
- [ ] T079 Generate execution summary report: Total word count, execution time, lessons completed, validation status
- [ ] T080 (Optional) Deploy to GitHub Pages: Run npm run deploy in docs/ directory if GitHub Pages configured

**Checkpoint**: Textbook generation complete and validated - ready for deployment or future expansion

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup validation - must complete before any content generation
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (needs lesson template files to exist)
- **User Story 3 (Phase 4)**: Depends on User Story 2 completion (validates selective population strategy)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately after Setup (Phase 1) - Creates foundational structure
- **User Story 2 (P2)**: MUST wait for User Story 1 to complete - Requires lesson template files to exist before content can be generated
- **User Story 3 (P3)**: MUST wait for User Story 2 to complete - Validates that only 3 lessons have full content while 3 remain as templates

### Critical Path

```
Setup (T001-T008)
  ↓
User Story 1: Scaffold Structure (T009-T024)
  ↓
User Story 2: Generate Content (T025-T059)
  ↓
User Story 3: Verify Selective Population (T060-T068)
  ↓
Polish & Validation (T069-T080)
```

### Within Each User Story

**User Story 1** (Sequential):
1. Invoke Content Architect (T009)
2. Validate directories created (T010)
3. Validate lesson files created (T011-T016) - CAN RUN IN PARALLEL
4. Validate category configs created (T017-T019) - CAN RUN IN PARALLEL
5. Validate sidebar updated (T020)
6. Validate template structure (T021-T022)
7. Validate build (T023-T024)

**User Story 2** (Per-Lesson Sequential, Lessons Parallelizable):
1. Invoke Technical Writer for lesson 1.1 (T025)
2. Validate lesson 1.1 content (T026-T035)
3. Invoke Technical Writer for lesson 2.1 (T036)
4. Validate lesson 2.1 content (T037-T045)
5. Invoke Technical Writer for lesson 3.1 (T046)
6. Validate lesson 3.1 content (T047-T055)
7. Cross-lesson validation (T056-T059)

**User Story 3** (All Parallel):
- All validation tasks (T060-T068) can run in parallel

### Parallel Opportunities

**Within User Story 1:**
- Tasks T011-T016 (lesson file validation) can run in parallel
- Tasks T017-T019 (category config validation) can run in parallel

**Within User Story 2:**
- Validation tasks within each lesson (T026-T035, T037-T045, T047-T055) can run in parallel AFTER the lesson content is generated
- If multiple agents available: lessons 1.1, 2.1, 3.1 could theoretically be written in parallel (not currently supported by single Technical Writer agent)

**Within User Story 3:**
- All validation tasks (T060-T068) can run in parallel

**Within Polish Phase:**
- Almost all tasks (T069-T077) can run in parallel since they're independent checks

---

## Parallel Example: User Story 1 Validation

```bash
# After Content Architect completes, validate all lesson files in parallel:
Task: "Validate lesson file created: lesson-01-intro-embodied-intelligence.md"
Task: "Validate lesson file created: lesson-02-robotics-landscape.md"
Task: "Validate lesson file created: lesson-01-ros2-architecture.md"
Task: "Validate lesson file created: lesson-02-nodes-topics-services.md"
Task: "Validate lesson file created: lesson-01-gazebo-setup.md"
Task: "Validate lesson file created: lesson-02-urdf-sdf-formats.md"

# Then validate all category configs in parallel:
Task: "Validate _category_.json created in chapter-01-foundations/"
Task: "Validate _category_.json created in chapter-02-ros2/"
Task: "Validate _category_.json created in chapter-03-simulation/"
```

---

## Parallel Example: User Story 3 Validation

```bash
# All verification tasks can run concurrently:
Task: "Verify lesson 1.1 has full content (700-900 words)"
Task: "Verify lesson 2.1 has full content (700-900 words)"
Task: "Verify lesson 3.1 has full content (700-900 words)"
Task: "Verify lesson 1.2 remains template (<500 words)"
Task: "Verify lesson 2.2 remains template (<500 words)"
Task: "Verify lesson 3.2 remains template (<500 words)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup & Prerequisites Validation (T001-T008)
2. Complete Phase 2: User Story 1 - Scaffold Structure (T009-T024)
3. **STOP and VALIDATE**:
   - Run `npm run start` in docs/
   - Verify 3 chapters visible in sidebar
   - Verify 6 lesson templates clickable
   - Verify all templates have 7 sections
4. **MVP DELIVERED**: Complete textbook structure with professional templates

### Incremental Delivery

1. **Foundation** (Setup): Validate environment ready (8 tasks)
2. **MVP** (User Story 1): Scaffold complete structure (16 tasks) → **DEMO-ABLE**
3. **Content** (User Story 2): Add researched content to 3 priority lessons (35 tasks) → **DEMO-ABLE**
4. **Validation** (User Story 3): Verify selective population strategy (9 tasks) → **DEMO-ABLE**
5. **Polish**: Final quality checks and deployment prep (12 tasks) → **PRODUCTION-READY**

Each increment adds value without breaking previous work.

### Sequential Solo Strategy (Recommended for Sunday Deadline)

**Total Time**: ~35 minutes

1. **Setup** (5 min): Tasks T001-T008
2. **User Story 1** (10 min): Tasks T009-T024
   - Content Architect runs (~2 min)
   - Validation checks (~8 min)
3. **User Story 2** (21 min): Tasks T025-T059
   - Lesson 1.1 generation + validation (~7 min)
   - Lesson 2.1 generation + validation (~7 min)
   - Lesson 3.1 generation + validation (~7 min)
4. **User Story 3** (3 min): Tasks T060-T068
5. **Polish** (6 min): Tasks T069-T080 (optional tasks skipped for time)

**Critical Path Total**: ~35 minutes (within <45 min budget from spec.md)

---

## Task Summary

**Total Tasks**: 80
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (User Story 1)**: 16 tasks
- **Phase 3 (User Story 2)**: 35 tasks
- **Phase 4 (User Story 3)**: 9 tasks
- **Phase 5 (Polish)**: 12 tasks

**By User Story**:
- **US1** (P1 - MVP): 16 tasks (scaffolding structure)
- **US2** (P2 - Content): 35 tasks (writing 3 lessons)
- **US3** (P3 - Validation): 9 tasks (verifying selective population)

**Parallel Opportunities**:
- 15 tasks marked [P] can run in parallel within their phase
- User Story 3 validation: 6 tasks can run fully in parallel
- Polish phase: 9 tasks can run fully in parallel

**Independent Test Criteria**: Each user story has clear independent test commands that verify completion without depending on other stories

**MVP Scope**: Phase 1 (Setup) + Phase 2 (User Story 1) = 24 tasks, ~15 minutes

---

## Notes

- **[P] tasks**: Different files, no dependencies within phase - can run concurrently
- **[Story] labels**: Map task to specific user story for traceability (US1, US2, US3)
- **No automated tests**: Content quality validated through Docusaurus builds and manual review
- **Agent invocations**: Most "implementation" tasks are invoking pre-built AI agents (Content Architect, Technical Writer)
- **Validation heavy**: Many tasks are validation checks to ensure content quality and structure correctness
- **Time estimates**: Based on plan.md estimates - actual time may vary by ±5 minutes
- **Commit strategy**: Commit after each phase completion (after T024, T059, T068, T080)
- **Avoid**: Invoking agents out of order (must scaffold before writing content), skipping validation tasks
- **Success**: All 80 tasks completed → Production-ready textbook with 3 chapters, 6 lessons (3 full, 3 templates), ~2400 words of educational content
