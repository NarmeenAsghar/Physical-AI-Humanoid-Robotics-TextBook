# Technical Writer Invocation Contract

**Component**: `.claude/agents/technical-writer.md`
**Purpose**: Replace template placeholders with researched, pedagogically-sound ~800 word content
**Status**: Configured and ready
**Invoked**: 3 times for lessons 1.1, 2.1, 3.1

---

## Input

**Command**:
```bash
claude agent technical-writer
```

**User Prompt Template**:
```
Write content for lesson [X.Y] in chapter-[##]-[slug], topic: [Topic Name], target: 800 words

Use the research outline from research.md for guidance.
```

**Example Prompts**:

**Lesson 1.1**:
```
Write content for lesson 1.1 in chapter-01-foundations, topic: Introduction to Embodied Intelligence, target: 800 words
```

**Lesson 2.1**:
```
Write content for lesson 2.1 in chapter-02-ros2, topic: ROS 2 Architecture & Core Concepts, target: 800 words
```

**Lesson 3.1**:
```
Write content for lesson 3.1 in chapter-03-simulation, topic: Gazebo Simulation Environment Setup, target: 800 words
```

---

## Preconditions

✅ **Required**:
- Lesson template file exists with 7 sections and placeholder text
- `research.md` exists with outline for this specific lesson
- Internet connectivity available for web search
- User has write permissions to lesson file

❌ **Fail if**:
- Lesson file missing → ERROR with file path
- Research outline missing for this lesson → WARN, proceed with web search only
- No internet connection → WARN, use internal knowledge only (note in content)
- Permission denied → ERROR with chmod suggestion

---

## Expected Behavior

### Phase 1: Research (2-3 minutes)

**Action**: Gather latest information about lesson topic

**Web Search Queries** (from research.md):

**Lesson 1.1 Example**:
```
- "embodied intelligence robotics 2025"
- "physical AI vs digital AI differences"
- "humanoid robots latest developments 2024"
- "sensor motor integration challenges robotics"
```

**Expected Sources**:
- Recent arXiv papers (robotics, AI)
- Industry blogs (Boston Dynamics, NVIDIA, Tesla AI)
- Academic resources (Stanford HAI, MIT CSAIL, Berkeley BAIR)
- Official documentation (if applicable)

**Compile**:
- 3 key concepts with definitions
- 2+ real-world examples (companies, projects, deployments)
- 2-4 authoritative URLs for Further Reading

**Retry Logic**:
- If WebSearch fails: Retry 3 times with exponential backoff (1s, 2s, 4s)
- If all retries fail: Fallback to internal knowledge, log warning

---

### Phase 2: Planning (1 minute)

**Action**: Map research findings to lesson structure

**Objectives Mapping**:
- Identify learning objectives from template (or create 3-4 if placeholders)
- Map each objective to specific section content
- Ensure all objectives will be addressed

**Example Allocation**:
- Objective 1: "Define embodied intelligence" → Introduction + Key Concept 1
- Objective 2: "Explain sensor-motor integration" → Key Concept 2
- Objective 3: "Identify real-world applications" → Key Concept 3 + Examples throughout

**Callout Planning**:
- Identify 2-3 critical concepts for callout boxes (`>` blockquote)
- Plan placement: One per Key Concepts subsection preferred

**Analogy Selection**:
- Choose 1-2 accessible analogies from research or create new ones
- Example: "Digital AI vs. embodied AI is like brain in a jar vs. brain in a body"

---

### Phase 3: Writing (3-4 minutes)

**Action**: Replace all placeholder text with researched content

#### Introduction Section (~150-200 words)

**Structure**:
1. **Hook** (1-2 sentences): Compelling opening that grabs attention
2. **Context** (2-3 sentences): Why this topic matters, background
3. **Thesis** (1 sentence): What this lesson will cover

**Example** (Lesson 1.1):
```markdown
## Introduction

Imagine teaching an AI to play chess versus teaching it to pour a cup of coffee. The first requires strategy; the second requires understanding physics, gravity, friction, and fragility - welcome to embodied intelligence. Unlike traditional AI confined to digital environments (like AlphaGo or ChatGPT), embodied intelligence extends AI into the physical world where robots must perceive, reason, and act in real-time. This lesson explores how AI systems gain "bodies" and the fundamental challenges of integrating sensors, actuators, and physical constraints to create robots that navigate our human-centered world.
```

**Word Count**: 150-200 words

---

#### Learning Objectives Section (~50 words)

**Replace Template with Specific, Measurable Objectives**:

**Example**:
```markdown
## Learning Objectives

By the end of this lesson, you will be able to:

- [ ] Define embodied intelligence and contrast it with traditional digital AI systems
- [ ] Explain the fundamental challenge of sensor-motor integration in real-time robotics
- [ ] Identify real-world applications where embodied AI excels (and current limitations)
```

**Validation**:
- Use action verbs: define, explain, identify, apply, implement, evaluate
- Each objective should be measurable (can be tested)
- 3-4 objectives total

**Word Count**: ~50 words

---

#### Key Concepts Section (~300-350 words, 3 subsections)

**Structure**: 3 subsections (### level 3), each ~100-120 words

**Subsection Template**:
```markdown
### [Concept Title]

[Definition/explanation - 2-3 sentences]

[How it works - 2-3 sentences with technical detail]

[Why it matters - 1-2 sentences connecting to real-world]

[Example - 1-2 sentences with specific company/project]

> 💡 **Key Insight**: [Critical takeaway in 1 sentence]
```

**Example** (Lesson 1.1, Subsection 1):
```markdown
### What is Embodied Intelligence?

Embodied intelligence refers to AI systems that perceive and act in the physical world, integrating sensory input with motor control to accomplish tasks. Unlike purely digital AI (chess engines, language models) that operate on abstract data, embodied AI must understand physical laws - gravity, friction, momentum - and respond to dynamic, unpredictable environments. The key characteristic is tight coupling between perception (what the robot senses), cognition (how it reasons), and action (what it does), forming a continuous feedback loop.

Tesla's Optimus humanoid robot exemplifies this approach: it uses cameras to perceive objects, neural networks to plan grasps, and servo motors to execute movements - all while adapting to real-time sensory feedback if an object slips or moves.

> 💡 **Key Insight**: Embodied intelligence isn't just about having a robotic body - it's about learning through physical interaction, not just data processing.
```

**Word Count per Subsection**: ~100-120 words
**Total for Section**: ~300-350 words

**Requirements**:
- Each subsection has clear definition, explanation, real-world example
- At least one callout box (`>`) per subsection (💡 Key Insight, ⚠️ Note, 📊 Diagram Suggestion)
- Use specific examples from research (companies, projects, papers)

---

#### Hands-on Exercise Section (~150 words)

**Structure**:
- **Prerequisites**: What students need (knowledge, tools, accounts)
- **Steps**: 3-5 numbered steps, clear and actionable
- **Expected Outcome**: What students should learn/achieve

**Example** (Lesson 1.1):
```markdown
## Hands-on Exercise

**Prerequisites**:
- Basic understanding of AI concepts (neural networks, reinforcement learning)
- Access to YouTube for video demonstrations

**Steps**:
1. Watch: OpenAI GPT-4 text generation demo (2 min)
2. Watch: Figure 01 robot task execution demo (2 min)
3. Compare: List 3 capabilities GPT-4 has that Figure 01 doesn't (e.g., general knowledge, language fluency, abstract reasoning)
4. Compare: List 3 capabilities Figure 01 has that GPT-4 doesn't (e.g., physical manipulation, spatial reasoning, real-time motor control)
5. Reflect: Why is pouring coffee harder for AI than writing an essay?

**Expected Outcome**:
Students understand that embodied intelligence requires skills beyond pattern recognition - it demands real-time physical interaction, spatial reasoning, and safety awareness that digital AI never encounters.
```

**Word Count**: ~150 words

**Requirements**:
- Practical, doable activity (no expensive hardware required)
- Reinforces learning objectives
- Clear expected outcome

---

#### Quiz Section (~100 words)

**Structure**: 3 multiple-choice questions with 4 options (A-D), answers hidden in `<details>` tag

**Question Types**:
1. **Conceptual**: Test understanding of definition/theory
2. **Application**: Test ability to apply concept to scenario
3. **Analysis**: Test higher-order thinking about trade-offs/comparisons

**Example** (Lesson 1.1):
```markdown
## Quiz

1. What distinguishes embodied intelligence from traditional digital AI?
   - A) Embodied AI runs on more powerful computers
   - B) Embodied AI interacts with the physical world through sensors and actuators
   - C) Embodied AI uses larger neural networks
   - D) Embodied AI only works on robots

2. Which of the following is a unique challenge for embodied AI that doesn't affect digital AI?
   - A) Training data requirements
   - B) Real-time physical safety constraints
   - C) Model architecture design
   - D) Programming language choice

3. Tesla Optimus, Figure 01, and Boston Dynamics Atlas are examples of:
   - A) Virtual assistants
   - B) Humanoid robots demonstrating embodied intelligence
   - C) Cloud-based AI services
   - D) Simulation environments

<details>
<summary>Show Answers</summary>

1. **B** - Embodied AI interacts with the physical world through sensors and actuators. Unlike purely digital AI, it must perceive and act in real space.
2. **B** - Real-time physical safety constraints. Digital AI can't physically harm anyone; robots must consider safety in every action.
3. **B** - Humanoid robots demonstrating embodied intelligence. All three are physical robots integrating AI for real-world tasks.

</details>
```

**Word Count**: ~100 words (including questions and answers)

**Requirements**:
- Exactly 3 questions
- Each question has 4 options (A, B, C, D)
- Answers in `<details>` tag with explanations
- Correct answer bolded: `**B**`

---

#### Key Takeaways Section (~45-50 words)

**Structure**: 3-5 concise bullet points summarizing lesson

**Example** (Lesson 1.1):
```markdown
## Key Takeaways

- Embodied intelligence extends AI from digital realms into the physical world, requiring sensor-motor integration and real-time responsiveness
- Physical constraints (power, safety, irreversibility) fundamentally shape embodied AI design differently from digital AI
- Real-world applications span manufacturing (Tesla Optimus), healthcare, and domestic assistance (Figure 01)
- The next AI frontier is robots that learn through physical interaction, not just data processing
```

**Word Count**: ~45-50 words

**Requirements**:
- 3-5 bullet points
- Each point 1-2 sentences max
- Captures most critical concepts from lesson
- Actionable or memorable phrasing

---

#### Further Reading Section (~50-60 words)

**Structure**: 2-4 curated resources with real HTTPS URLs and descriptions

**Example** (Lesson 1.1):
```markdown
## Further Reading

- [Physical Intelligence (Pi): Generalist Robot Foundation Models](https://www.physicalintelligence.company/) - Startup building foundation models for robot control (2024)
- [Google DeepMind Robotics Research](https://deepmind.google/discover/blog/shaping-the-future-of-advanced-robotics/) - Latest work on learning dexterous manipulation and whole-body control
- [IEEE Spectrum Robotics](https://spectrum.ieee.org/topic/robotics/) - Industry news and technical deep-dives on embodied AI developments
```

**Word Count**: ~50-60 words

**Requirements**:
- 2-4 resources (prefer 3)
- All URLs must be HTTPS (no http://)
- Format: `[Title](URL) - [Brief description]`
- Mix of types: official docs, research, industry blogs, communities
- URLs must be accessible (verify during research phase)

---

### Phase 4: Review (1 minute)

**Action**: Validate content before writing to file

**Checklist**:
- [ ] Word count: 700-900 words (target ~800)
- [ ] All learning objectives addressed in content
- [ ] Minimum 1-2 real-world examples present
- [ ] At least 2 callout boxes (`>`) in Key Concepts
- [ ] Further Reading has 2-4 HTTPS URLs (verified accessible)
- [ ] Quiz has 3 questions with answers in `<details>` tag
- [ ] Consistent tone: encouraging, inclusive, technically accurate

**Word Count Check**:
```python
# Exclude frontmatter and count markdown body
content_without_frontmatter = remove_yaml_frontmatter(lesson_content)
word_count = len(content_without_frontmatter.split())

if word_count < 700:
    print(f"⚠️ Warning: Word count {word_count} below target (700-900)")
    # Expand Key Concepts or add more examples

if word_count > 900:
    print(f"⚠️ Warning: Word count {word_count} above target (700-900)")
    # Condense without losing core concepts
```

---

### Phase 5: Write (< 1 minute)

**Action**: Write updated content to lesson file

**Process**:
1. Read existing lesson file
2. Extract YAML frontmatter (preserve exactly)
3. Replace entire body content (all 7 sections)
4. Write file with preserved frontmatter + new content

**Example Code**:
```python
# Read existing file
with open(lesson_file_path, 'r') as f:
    existing_content = f.read()

# Extract frontmatter
frontmatter = extract_yaml_frontmatter(existing_content)

# Generate new content
new_body = generate_lesson_content(research_outline, topic, word_count=800)

# Combine frontmatter + new body
updated_content = f"""---
{frontmatter}
---

{new_body}
"""

# Write updated file
with open(lesson_file_path, 'w') as f:
    f.write(updated_content)

print(f"✅ Updated {lesson_file_path} ({word_count} words)")
```

---

## Output

**Updated Lesson File**:
- Same YAML frontmatter (sidebar_position, title, description)
- All 7 sections replaced with researched content
- Word count: 700-900 words (target ~800)
- 2+ real-world examples
- 2-4 HTTPS URLs in Further Reading
- 2+ callout boxes in Key Concepts

**Example File** (lesson 1.1):
```
docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md

Word count: 823 words
Sections filled: 7/7
Examples: 4 (Tesla Optimus, Figure 01, 1X Neo, Boston Dynamics Atlas)
URLs: 3 (all HTTPS, verified)
Callouts: 3 (one per Key Concepts subsection)
```

---

## Success Criteria

✅ **Content Must Have**:

1. **Word Count**: 700-900 words (excluding frontmatter)
2. **Objectives Addressed**: All learning objectives explicitly covered in content
3. **Real-World Examples**: Minimum 2 specific examples (companies, projects, papers)
4. **Callout Boxes**: Minimum 2 blockquote callouts (`>`) for key insights
5. **HTTPS URLs**: 2-4 valid, accessible URLs in Further Reading (no broken links)
6. **Educational Tone**: Encouraging, inclusive, technically accurate language
7. **Preserved Frontmatter**: YAML frontmatter unchanged from template
8. **Quiz Answers**: Hidden in `<details>` tag with explanations

---

## Performance Target

**Execution Time**: <7 minutes per lesson

**Breakdown**:
- Research: 2-3 minutes (web search, compile sources)
- Planning: 1 minute (map objectives, plan callouts)
- Writing: 3-4 minutes (generate ~800 words)
- Review: 1 minute (validate criteria)
- Write file: <1 minute

**Total**: ~7 minutes × 3 lessons = ~21 minutes for all content

---

## Error Handling

### Error 1: Lesson File Not Found

**Trigger**: File path doesn't exist

**Message**:
```
❌ Error: Lesson file not found

Expected path: docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md

Have you run Content Architect to scaffold the structure first?

Run:
claude agent content-architect
> Input: "chapters 1-3, lessons 1-2"

Then retry Technical Writer.
```

---

### Error 2: Web Search Failure

**Trigger**: All web search retries fail

**Message**:
```
⚠️ Warning: Web search failed after 3 retries

Proceeding with internal knowledge only. Content may lack latest developments and real URLs.

Recommendation: Check internet connection and retry for best results.
```

**Behavior**: Continue with content generation using internal knowledge, note limitation in Further Reading section

---

### Error 3: Word Count Out of Range

**Trigger**: Generated content <700 or >900 words

**Message**:
```
⚠️ Warning: Word count 1050 exceeds target range (700-900)

Condensing content while preserving core concepts...
```

**Behavior**: Automatically trim/expand content to fit range, log adjustment

---

### Error 4: Missing Research Outline

**Trigger**: research.md doesn't have outline for this lesson

**Message**:
```
⚠️ Warning: No research outline found for lesson 1.1 in research.md

Proceeding with web search only (no pre-planned structure).

Content quality may vary. Consider creating research outlines first.
```

**Behavior**: Perform web search, create ad-hoc outline, continue

---

### Error 5: File Write Permission Denied

**Trigger**: Cannot write to lesson file

**Message**:
```
❌ Error: Permission denied writing to lesson file

File: docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md

To fix:
sudo chown -R $USER:$USER docs/docs/
chmod -R u+w docs/docs/

Then retry Technical Writer.
```

---

## Idempotency

**Behavior on Re-run**:

If Technical Writer invoked on already-filled lesson:

1. **Detect Existing Content**:
   - Check word count of lesson file
   - If >500 words (likely full content, not template), prompt user

2. **User Confirmation**:
   ```
   ⚠️ Warning: lesson-01-intro-embodied-intelligence.md appears to have full content (823 words)

   Overwrite with new content? (y/n)
   ```

3. **If User Chooses**:
   - `y`: Overwrite file with newly generated content
   - `n`: Skip this lesson, move to next

**Backup Option** (optional enhancement):
- Before overwriting, create backup: `lesson-01-intro-embodied-intelligence.md.backup`

---

**Contract Complete**: Technical Writer invocation fully specified with inputs, research workflow, writing guidelines, validation criteria, and error handling.
