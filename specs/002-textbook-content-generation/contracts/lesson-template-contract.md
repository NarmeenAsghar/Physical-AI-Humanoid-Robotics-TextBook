# Lesson Template Generator Contract

**Component**: `.claude/skills/lesson-template-generator/SKILL.md`
**Purpose**: Create standardized lesson markdown with 7 mandatory sections and placeholder text
**Status**: Fully implemented (created in current session)
**Invoked By**: Content Architect subagent (programmatic, not user-facing)

---

## Input (from Content Architect)

**Parameters**:
```typescript
interface LessonTemplateInput {
  chapter_number: number;      // 1, 2, or 3
  lesson_number: number;        // 1 or 2
  lesson_title: string;         // e.g., "Introduction to Embodied Intelligence"
  lesson_description: string;   // e.g., "Foundations of Physical AI principles"
  sidebar_position: number;     // 1 or 2 (matches lesson_number)
}
```

**Example**:
```json
{
  "chapter_number": 1,
  "lesson_number": 1,
  "lesson_title": "Introduction to Embodied Intelligence",
  "lesson_description": "Foundations of Physical AI and embodied intelligence principles",
  "sidebar_position": 1
}
```

---

## Template Structure

### YAML Frontmatter

**Required Fields**:
```yaml
---
sidebar_position: [sidebar_position]
title: [lesson_title]
description: [lesson_description]
---
```

**Validation**:
- Must be valid YAML (parseable by `js-yaml` or equivalent)
- Must be enclosed in `---` delimiters
- All 3 fields required
- `sidebar_position` must be integer

---

### Section 1: Introduction

**Header**: `## Introduction`

**Placeholder Content**:
```markdown
## Introduction

[Why this lesson matters - 2-3 sentences explaining the importance and context of this topic in Physical AI and Humanoid Robotics]
```

**Word Count**: ~50-100 words (placeholder guidance)
**Purpose**: Provide hook and context for the lesson

---

### Section 2: Learning Objectives

**Header**: `## Learning Objectives`

**Placeholder Content**:
```markdown
## Learning Objectives

By the end of this lesson, you will be able to:

- [ ] [Objective 1 - using action verb: understand, explain, implement, etc.]
- [ ] [Objective 2 - specific, measurable outcome]
- [ ] [Objective 3 - practical application or skill]
```

**Validation**:
- Must use checkbox format `- [ ]` (note space between brackets)
- Minimum 3 objectives
- Each objective should start with action verb (understand, explain, implement, apply, identify, etc.)

---

### Section 3: Key Concepts

**Header**: `## Key Concepts`

**Placeholder Content**:
```markdown
## Key Concepts

### [Concept 1 Title]

[Detailed explanation of the first key concept. Include:
- Clear definition
- How it works
- Why it's important
- Real-world examples from robotics/AI]

### [Concept 2 Title]

[Explanation of the second key concept with similar depth]

### [Concept 3 Title]

[Explanation of the third key concept]
```

**Validation**:
- Must have exactly 3 subsections (### level 3 headings)
- Each subsection is a placeholder for 100-150 words of content

---

### Section 4: Hands-on Exercise

**Header**: `## Hands-on Exercise`

**Placeholder Content**:
```markdown
## Hands-on Exercise

[Step-by-step practical activity that reinforces the learning objectives]

**Prerequisites**:
- [Required knowledge or tools]
- [Software/hardware requirements]

**Steps**:
1. [Step 1 with clear instructions]
2. [Step 2 building on previous step]
3. [Step 3 leading to completion]

**Expected Outcome**:
[What students should achieve or understand after completing this exercise]
```

**Validation**:
- Must have Prerequisites, Steps, and Expected Outcome subsections
- Steps must be numbered list (markdown ordered list)

---

### Section 5: Quiz

**Header**: `## Quiz`

**Placeholder Content**:
```markdown
## Quiz

Test your understanding of this lesson:

1. [Multiple choice question testing Concept 1]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

2. [Multiple choice question testing Concept 2]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

3. [Application question testing practical understanding]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

<details>
<summary>Show Answers</summary>

1. [Correct answer letter] - [Brief explanation of why this is correct]
2. [Correct answer letter] - [Explanation]
3. [Correct answer letter] - [Explanation]

</details>
```

**Validation**:
- Must have exactly 3 questions
- Each question must have 4 options (A, B, C, D)
- Answers must be enclosed in `<details><summary>Show Answers</summary>...</details>` tag
- Answer format: `[Letter] - [Explanation]`

---

### Section 6: Key Takeaways

**Header**: `## Key Takeaways`

**Placeholder Content**:
```markdown
## Key Takeaways

- [Summary point 1 - most critical concept from this lesson]
- [Summary point 2 - key skill or application]
- [Summary point 3 - important warning or best practice]
```

**Validation**:
- Bulleted list format (markdown unordered list with `-`)
- Minimum 3 takeaways
- Concise (each takeaway 1-2 sentences max)

---

### Section 7: Further Reading

**Header**: `## Further Reading`

**Placeholder Content**:
```markdown
## Further Reading

- [Resource 1: Official Documentation or Tutorial](#) - [Brief description of what this covers]
- [Resource 2: Research Paper or Advanced Guide](#) - [Description]
- [Resource 3: Community Resource or Tool](#) - [Description]

---

**Next Lesson**: [Next Lesson Title](./lesson-[next-number]-[slug].md)
```

**Validation**:
- Bulleted list format
- Each item: `[Link Text](URL) - [Description]`
- Placeholder URLs can be `#` (Technical Writer replaces with real URLs)
- Must include "Next Lesson" link at bottom
- Next lesson link format: `./lesson-[number]-[slug].md` (relative path)

---

## Output

**File Structure**:
```markdown
---
sidebar_position: 1
title: Introduction to Embodied Intelligence
description: Foundations of Physical AI and embodied intelligence principles
---

# Introduction to Embodied Intelligence

## Introduction

[Placeholder text ~50-100 words]

## Learning Objectives

By the end of this lesson, you will be able to:

- [ ] [Objective 1]
- [ ] [Objective 2]
- [ ] [Objective 3]

## Key Concepts

### [Concept 1 Title]
[Placeholder ~100-150 words]

### [Concept 2 Title]
[Placeholder ~100-150 words]

### [Concept 3 Title]
[Placeholder ~100-150 words]

## Hands-on Exercise

**Prerequisites**:
- [Placeholder]

**Steps**:
1. [Placeholder]
2. [Placeholder]
3. [Placeholder]

**Expected Outcome**:
[Placeholder]

## Quiz

1. [Question 1]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

2. [Question 2]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

3. [Question 3]
   - A) [Option A]
   - B) [Option B]
   - C) [Option C]
   - D) [Option D]

<details>
<summary>Show Answers</summary>

1. [Answer] - [Explanation]
2. [Answer] - [Explanation]
3. [Answer] - [Explanation]

</details>

## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

## Further Reading

- [Resource 1](#) - [Description]
- [Resource 2](#) - [Description]
- [Resource 3](#) - [Description]

---

**Next Lesson**: [Next Lesson Title](./lesson-02-[slug].md)
```

**File Path Pattern**: `docs/docs/chapter-{chapter_number:02d}-{chapter_slug}/lesson-{lesson_number:02d}-{lesson_slug}.md`

**Example File Path**: `docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md`

---

## Validation Rules

### YAML Frontmatter Validation

```typescript
function validateFrontmatter(frontmatter: any): boolean {
  // Must have all 3 fields
  if (!frontmatter.sidebar_position || !frontmatter.title || !frontmatter.description) {
    return false;
  }

  // sidebar_position must be integer
  if (!Number.isInteger(frontmatter.sidebar_position)) {
    return false;
  }

  // title and description must be non-empty strings
  if (typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') {
    return false;
  }
  if (typeof frontmatter.description !== 'string' || frontmatter.description.trim() === '') {
    return false;
  }

  return true;
}
```

---

### Section Presence Validation

```typescript
const REQUIRED_SECTIONS = [
  'Introduction',
  'Learning Objectives',
  'Key Concepts',
  'Hands-on Exercise',
  'Quiz',
  'Key Takeaways',
  'Further Reading'
];

function validateSections(markdownContent: string): boolean {
  for (const section of REQUIRED_SECTIONS) {
    const pattern = new RegExp(`^## ${section}`, 'm');
    if (!pattern.test(markdownContent)) {
      console.error(`Missing required section: ${section}`);
      return false;
    }
  }
  return true;
}
```

---

### Quiz Format Validation

```typescript
function validateQuizFormat(markdownContent: string): boolean {
  // Must have <details> tag
  if (!/<details>[\s\S]*<summary>Show Answers<\/summary>[\s\S]*<\/details>/.test(markdownContent)) {
    console.error('Quiz answers not in <details> tag');
    return false;
  }

  // Must have 3 questions with A-D options
  const questionPattern = /\d+\.\s+\[.+\]\s+- A\).+- B\).+- C\).+- D\)/g;
  const questions = markdownContent.match(questionPattern);
  if (!questions || questions.length !== 3) {
    console.error('Quiz must have exactly 3 questions with 4 options each');
    return false;
  }

  return true;
}
```

---

### Learning Objectives Format Validation

```typescript
function validateLearningObjectives(markdownContent: string): boolean {
  // Must use checkbox format - [ ]
  const checkboxPattern = /- \[ \]/g;
  const checkboxes = markdownContent.match(checkboxPattern);

  if (!checkboxes || checkboxes.length < 3) {
    console.error('Learning Objectives must have at least 3 checkbox items');
    return false;
  }

  return true;
}
```

---

## Success Criteria

✅ **Template Must Have**:

1. **Valid YAML**: Frontmatter parseable, all 3 fields present
2. **7 Sections**: All mandatory section headers present (## level 2)
3. **3 Key Concepts**: Exactly 3 subsections (### level 3) in Key Concepts section
4. **Quiz Structure**: 3 questions with 4 options each, answers in `<details>` tag
5. **Checkboxes**: Learning Objectives use `- [ ]` format
6. **Placeholder Guidance**: Each section contains helpful placeholder text for content writers
7. **Next Lesson Link**: Relative link to next lesson file (or next chapter if last lesson)

---

## File Naming Convention

**Pattern**: `lesson-{number:02d}-{slug}.md`

**Slug Generation** (from lesson title):
1. Lowercase entire string
2. Remove special characters (keep alphanumeric, spaces, hyphens)
3. Replace spaces with hyphens
4. Remove consecutive hyphens
5. Truncate to reasonable length (~50 chars)

**Examples**:
```
"Introduction to Embodied Intelligence"
  → "introduction-to-embodied-intelligence"

"ROS 2 Architecture & Core Concepts"
  → "ros-2-architecture-core-concepts"

"URDF/SDF Robot Description Formats"
  → "urdf-sdf-robot-description-formats"
```

---

## Integration with Content Architect

**Invocation Flow**:

```typescript
// Content Architect calls Lesson Template Generator for each lesson
for (let chapterNum = 1; chapterNum <= 3; chapterNum++) {
  for (let lessonNum = 1; lessonNum <= 2; lessonNum++) {
    const templateInput = {
      chapter_number: chapterNum,
      lesson_number: lessonNum,
      lesson_title: parsedLessons[chapterNum][lessonNum].title,
      lesson_description: generateDescription(parsedLessons[chapterNum][lessonNum].title),
      sidebar_position: lessonNum
    };

    const templateContent = lessonTemplateGenerator.generate(templateInput);

    const filePath = `docs/docs/chapter-${chapterNum:02d}-${chapterSlug}/lesson-${lessonNum:02d}-${lessonSlug}.md`;

    fs.writeFileSync(filePath, templateContent);
  }
}
```

---

## Performance Target

**Generation Speed**: <1 second per lesson template
**File Size**: ~2-3 KB per template file

**Expected Execution**:
- 6 lessons × 1 second = ~6 seconds total for template generation
- Actual time dominated by file I/O and Content Architect orchestration (~10-15 seconds)

---

## Error Handling

### Invalid Input

**Trigger**: Missing required input field

**Response**:
```
❌ Error: Invalid input to Lesson Template Generator

Missing required field: lesson_title

Required input:
{
  chapter_number: number,
  lesson_number: number,
  lesson_title: string,
  lesson_description: string,
  sidebar_position: number
}
```

---

### File Write Failure

**Trigger**: Cannot write template to file path

**Response**:
```
❌ Error: Failed to write lesson template

File path: docs/docs/chapter-01-foundations/lesson-01-intro.md
Reason: [Error message from filesystem]

Check:
1. Directory exists
2. Write permissions
3. Disk space available
```

---

### Validation Failure

**Trigger**: Generated template fails validation

**Response**:
```
❌ Error: Generated template failed validation

Failed checks:
- Missing section: Hands-on Exercise
- Quiz format invalid: Answers not in <details> tag

Template not written. This is a bug in Lesson Template Generator skill.
```

---

**Contract Complete**: Lesson Template Generator skill fully specified with input schema, template structure, validation rules, and integration details.
